import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { envs } from '../config/index.js';

@Injectable()
export class PublisherService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PublisherService.name);
    private conn: amqp.Connection | null = null;
    private ch: amqp.Channel | null = null;
    private readonly exchange = 'riff_events';

    async onModuleInit() {
        try {
            this.conn = await amqp.connect(envs.rabbitUrl);
            this.ch = await this.conn.createChannel();
            await this.ch.assertExchange(this.exchange, 'topic', { durable: true });
            this.logger.log('PublisherService connected to RabbitMQ');
        } catch (err) {
            this.logger.error('Failed to connect to RabbitMQ', err as any);
            throw err;
        }
    }

    publish(routingKey: string, payload: any) {
        if (!this.ch) {
            this.logger.error('Channel not initialized; cannot publish');
            return false;
        }
        try {
            const ok = this.ch.publish(
                this.exchange,
                routingKey,
                Buffer.from(JSON.stringify(payload)),
                { persistent: true },
            );
            this.logger.debug(`Published ${routingKey}`);
            return ok;
        } catch (err) {
            this.logger.error('Publish failed', err as any);
            return false;
        }
    }

    async onModuleDestroy() {
        try {
            if (this.ch) await this.ch.close();
            if (this.conn) await this.conn.close();
            this.logger.log('PublisherService disconnected from RabbitMQ');
        } catch (err) {
            this.logger.error('Error closing RabbitMQ connection', err as any);
        }
    }
}

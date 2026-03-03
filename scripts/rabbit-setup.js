const amqp = require('amqplib');

const EXCHANGE = 'riff_events';
const EXCHANGE_TYPE = 'topic';
const QUEUES = [
  {
    name: 'notifications_queue',
    bindings: ['auth.tokenGenerated', 'post.created', 'event.*', 'send.resetPassword'],
  },
  {
    name: 'content_queue',
    bindings: ['auth.tokenGenerated', 'post.created', 'event.created', 
        'event.updated', 'event.cancelled'],
  },
  { name: 'users_queue', bindings: ['user.*', 'auth.tokenGenerated'] },
  // add more queues/bindings as needed
];

async function setupRabbit() {
  const conn = await amqp.connect(process.env.RABBIT_URL);
  const ch = await conn.createChannel();

  await ch.assertExchange(EXCHANGE, EXCHANGE_TYPE, { durable: true });

  for (const q of QUEUES) {
    await ch.assertQueue(q.name, { durable: true });
    for (const rk of q.bindings) {
      await ch.bindQueue(q.name, EXCHANGE, rk);
    }
  }

  await ch.close();
  await conn.close();
  console.log('Rabbit setup completed: exchange + queues + bindings created');
}

if (require.main === module) {
  setupRabbit().catch((err) => {
    console.error('Rabbit setup failed', err);
    process.exit(1);
  });
}

module.exports = { setupRabbit };

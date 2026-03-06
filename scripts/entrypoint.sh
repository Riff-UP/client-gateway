#!/bin/sh
set -e

echo "▶ Running RabbitMQ setup..."
node /app/scripts/rabbit-setup.js

echo "▶ Starting client-gateway..."
exec node dist/main


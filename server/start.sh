#!/bin/sh
npx prisma migrate deploy
exec node src/index.js

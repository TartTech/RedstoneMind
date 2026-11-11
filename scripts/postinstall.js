#!/usr/bin/env node
/**
 * Postinstall script для redstonemind
 * Устанавливает зеркало Prisma для РФ и запускает установку
 */

const { execSync } = require('child_process');

// Устанавливаем зеркало Prisma для РФ (если не установлено вручную)
if (!process.env.PRISMA_ENGINES_MIRROR) {
    process.env.PRISMA_ENGINES_MIRROR = 'https://cdn.npmmirror.com/binaries/prisma';
}
if (!process.env.PRISMA_BINARIES_MIRROR) {
    process.env.PRISMA_BINARIES_MIRROR = 'https://cdn.npmmirror.com/binaries/prisma';
}

console.log('[RedstoneMind] Running postinstall...');

try {
    // Устанавливаем frontend зависимости без скриптов
    console.log('[RedstoneMind] Installing frontend dependencies...');
    execSync('npm install --workspace=frontend --ignore-scripts', {
        stdio: 'inherit',
        env: process.env
    });

    // Генерируем Prisma клиент с зеркалом
    console.log('[RedstoneMind] Generating Prisma client...');
    execSync('prisma generate --schema=./backend/prisma/schema.prisma', {
        stdio: 'inherit',
        env: process.env
    });

    console.log('[RedstoneMind] Postinstall completed successfully!');
} catch (error) {
    console.error('[RedstoneMind] Postinstall failed:', error.message);
    process.exit(1);
}

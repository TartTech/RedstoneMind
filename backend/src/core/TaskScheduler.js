const cron = require('node-cron');
const prisma = require('../lib/prisma');
const { botManager } = require('./services');
const { t } = require('../i18n');

class TaskScheduler {
    constructor() {
        this.scheduledJobs = new Map();
        this.runningTasks = new Set();
        console.log(t('tasks:log_50084482'));
    }

    async initialize() {
        console.log(t('tasks:log_92118bc0'));
        const allTasks = await prisma.scheduledTask.findMany();
        
        const tasksToSchedule = allTasks.filter(task => task.isEnabled && task.cronPattern && cron.validate(task.cronPattern));
        const tasksToRunOnStartup = allTasks.filter(task => task.isEnabled && task.runOnStartup);

        tasksToSchedule.forEach(task => {
            this.scheduleTask(task);
        });
        
        console.log(t('tasks:log_d68f0ef4', { this: this.scheduledJobs.size }));

        if (tasksToRunOnStartup.length > 0) {
            console.log(t('tasks:log_c7ddea0c', { tasksToRunOnStartup: tasksToRunOnStartup.length }));
            for (const task of tasksToRunOnStartup) {
                setTimeout(() => this.executeTask(task), 2000);
            }
        }
    }

    async executeTask(task) {
        if (this.runningTasks.has(task.id)) {
            console.warn(`[TaskScheduler] Задача "${task.name}" (ID: ${task.id}) ещё выполняется, пропускаем запуск.`);
            return;
        }
        this.runningTasks.add(task.id);
        try {
            console.log(`[TaskScheduler] Выполнение задачи: "${task.name}" (ID: ${task.id}) в ${new Date().toLocaleString('ru-RU')}`);
            let botIds = [];
            
            try {
                const targetIds = JSON.parse(task.targetBotIds);
                if (Array.isArray(targetIds) && targetIds[0] === 'ALL') {
                    const allBots = await prisma.bot.findMany({ select: { id: true } });
                    botIds = allBots.map(b => b.id);
                    console.log(t('tasks:log_a7a1676c', { botIds: botIds.length }));
                } else {
                    botIds = targetIds.map(id => parseInt(id, 10));
                    console.log(`[TaskScheduler] Задача будет выполнена для ботов: ${botIds.join(', ')}`);
                }
            } catch (e) {
                console.error(t('tasks:error_9379381f', { task: task.id }), e.message);
                return;
            }

            for (const botId of botIds) {
                try {
                    const botConfig = await prisma.bot.findUnique({ where: { id: botId }, include: { server: true, proxy: true } });
                    if (!botConfig) continue;

                    switch (task.action) {
                        case 'START_BOT':
                            console.log(t('tasks:log_74b0d139', { botConfig: botConfig.username, botId: botId }));
                            if (!botManager.isBotRunning(botId)) {
                                await botManager.startBot(botConfig);
                                console.log(t('tasks:success_ccbe2340', { botConfig: botConfig.username }));
                            } else {
                                console.log(t('tasks:log_7101d07d', { botConfig: botConfig.username }));
                            }
                            break;
                        case 'STOP_BOT':
                            console.log(t('tasks:log_130e5fc6', { botConfig: botConfig.username, botId: botId }));
                            if (botManager.isBotRunning(botId)) {
                                await botManager.stopBot(botId);
                                console.log(t('tasks:log_c097d602', { botConfig: botConfig.username }));
                            } else {
                                console.log(t('tasks:log_de607b02', { botConfig: botConfig.username }));
                            }
                            break;
                        case 'RESTART_BOT':
                            console.log(t('tasks:log_f59af163', { botConfig: botConfig.username, botId: botId }));
                            if (botManager.isBotRunning(botId)) {
                                await botManager.restartBot(botId);
                            } else {
                                await botManager.startBot(botConfig);
                            }
                            console.log(t('tasks:log_73b1bb3f', { botConfig: botConfig.username }));
                            break;
                        case 'SEND_COMMAND':
                            if (botManager.isBotRunning(botId)) {
                                const payload = JSON.parse(task.payload || '{}');
                                if (payload.command) {
                                    console.log(`[TaskScheduler] -> Отправка команды "${payload.command}" боту ${botConfig.username}`);
                                    botManager.sendMessageToBot(botId, payload.command);
                                }
                            } else {
                                console.log(t('tasks:log_fc4c80ff', { botConfig: botConfig.username }));
                            }
                            break;
                    }
                } catch (error) {
                    console.error(t('tasks:error_3ed7cbbb', { botId: botId }), error);
                }
            }
            await prisma.scheduledTask.update({ where: { id: task.id }, data: { lastRun: new Date() } });
            console.log(`[TaskScheduler] Задача "${task.name}" выполнена успешно`);
        } catch (error) {
            console.error(`[TaskScheduler] Критическая ошибка при выполнении задачи "${task.name}":`, error);
        } finally {
            this.runningTasks.delete(task.id);
        }
    }

    scheduleTask(task) {
        if (this.scheduledJobs.has(task.id)) {
            this.unscheduleTask(task.id);
        }

        if (!task.cronPattern || !cron.validate(task.cronPattern)) {
            if (!task.runOnStartup) {
                 console.error(t('tasks:error_1e75f4ff', { task: task.id, task1: task.cronPattern }));
            }
            return;
        }

        try {
            const job = cron.schedule(task.cronPattern, () => this.executeTask(task), {
                scheduled: true,
            });

            this.scheduledJobs.set(task.id, job);
            console.log(`[TaskScheduler] Задача "${task.name}" запланирована с паттерном: ${task.cronPattern}`);
        } catch (error) {
            console.error(`[TaskScheduler] Ошибка планирования задачи "${task.name}":`, error.message);
        }
    }

    unscheduleTask(taskId) {
        const job = this.scheduledJobs.get(taskId);
        if (job) {
            job.stop();
            this.scheduledJobs.delete(taskId);
            console.log(t('tasks:log_a897e0ae', { taskId: taskId }));
        }
    }

    async updateTask(updatedTask) {
        this.unscheduleTask(updatedTask.id);
        if (updatedTask.isEnabled) {
            this.scheduleTask(updatedTask);
        }
    }

    shutdown() {
        console.log(t('tasks:log_afd1a419'));
        this.scheduledJobs.forEach(job => job.stop());
        this.scheduledJobs.clear();
        console.log(t('tasks:log_43e11c35'));
    }
}

module.exports = new TaskScheduler();
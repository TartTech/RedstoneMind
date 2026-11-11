const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const TaskScheduler = require('../../core/TaskScheduler');
const { authenticate, authorize } = require('../middleware/auth');

const { CronExpressionParser } = require('cron-parser');
const cron = require('node-cron');
const { t } = require('../../i18n');

const prisma = new PrismaClient();

router.use(authenticate);

const normalizeCronPattern = (pattern) => {
    if (typeof pattern !== 'string') return '';
    return pattern.replace(/\*\/1/g, '*').replace(/\s+/g, ' ').trim();
};

const parseCronOrError = (pattern) => {
    const normalized = normalizeCronPattern(pattern);
    if (!normalized || !cron.validate(normalized)) {
        return { error: t('tasks:msg_0bd22271') };
    }
    return { pattern: normalized };
};

router.get('/', authorize('task:list'), async (req, res) => {
    try {
        const tasks = await prisma.scheduledTask.findMany({ orderBy: { createdAt: 'desc' } });
        const normalizedTasks = tasks.map(task => ({
            ...task,
            cronPattern: normalizeCronPattern(task.cronPattern),
        }));
        res.json(normalizedTasks);
    } catch (error) {
        console.error(t('tasks:error_8bd01234'), error);
        res.status(500).json({ error: t('tasks:error_2f5274c2') });
    }
});

router.post('/', authorize('task:create'), async (req, res) => {
    try {
        const { runOnStartup, cronPattern, ...restOfBody } = req.body;
        const taskData = { ...restOfBody, runOnStartup: !!runOnStartup };

        if (runOnStartup) {
            taskData.cronPattern = null;
        } else {
            const parsed = parseCronOrError(cronPattern);
            if (parsed.error) {
                return res.status(400).json({ error: parsed.error });
            }
            taskData.cronPattern = parsed.pattern;
        }

        const newTask = await prisma.scheduledTask.create({ data: taskData });
        if (!runOnStartup) {
            TaskScheduler.scheduleTask(newTask);
        }
        res.status(201).json(newTask);
    } catch (error) {
        console.error(t('tasks:error_c9d8ff0f'), error);
        res.status(500).json({ error: t('tasks:error_496407a2') });
    }
});

router.put('/:id', authorize('task:edit'), async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    try {
        const { id, createdAt, updatedAt, lastRun, ...dataToUpdate } = req.body;
        
        if (typeof dataToUpdate.runOnStartup !== 'undefined') {
            dataToUpdate.runOnStartup = !!dataToUpdate.runOnStartup;
            if (dataToUpdate.runOnStartup) {
                dataToUpdate.cronPattern = null;
            }
        }

        if (dataToUpdate.cronPattern) {
            const parsed = parseCronOrError(dataToUpdate.cronPattern);
            if (parsed.error) {
                return res.status(400).json({ error: parsed.error });
            }
            dataToUpdate.cronPattern = parsed.pattern;
        }

        const updatedTask = await prisma.scheduledTask.update({
            where: { id: taskId },
            data: dataToUpdate,
        });
        await TaskScheduler.updateTask(updatedTask);
        res.json(updatedTask);
    } catch (error) {
        console.error(t('tasks:error_21ce0d39', { taskId: taskId }), error);
        res.status(500).json({ error: t('tasks:error_13dfc0b1') });
    }
});

router.delete('/:id', authorize('task:delete'), async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    try {
        await prisma.scheduledTask.delete({ where: { id: taskId } });
        TaskScheduler.unscheduleTask(taskId);
        res.status(204).send();
    } catch (error) {
        console.error(t('tasks:error_b002d744', { taskId: taskId }), error);
        res.status(500).json({ error: t('tasks:error_c3ce05af') });
    }
});


router.post('/describe', authorize('task:list'), (req, res) => {
    const { pattern } = req.body;

    if (!pattern) {
        return res.status(400).json({ error: t('tasks:msg_0bd22271') });
    }

    try {
        const interval = CronExpressionParser.parse(pattern);
        
        res.json({
            human: interval.stringify(true),
            next: interval.next().toDate().toLocaleString('ru-RU')
        });
    } catch (error) {
        console.error(`[API /tasks/describe] Ошибка парсинга паттерна "${pattern}":`, error.message);
        res.status(500).json({ error: t('tasks:error_e8c760a1') });
    }
});

module.exports = router;
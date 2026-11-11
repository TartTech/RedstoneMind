const prisma = require('../../lib/prisma');
const { randomUUID } = require('crypto');
const { t } = require('../../i18n');

/**
 * Service for сбора and управления трассировками execution графов
 */
class TraceCollectorService {
  constructor() {
    // Хранилище активных трассировок in памяти
    // Key: traceId, Value: { trace, steps: [] }
    this.activeTraces = new Map();

    // Socket.IO instance (will установлен извне)
    this.io = null;

    // Configuration
    this.config = {
      // Хранить ли трассировки in БД
      persistToDb: process.env.TRACE_PERSIST_TO_DB !== 'false', // По умолчанию true
      // Максимальное количество трассировок in памяти on bot
      maxTracesPerBot: parseInt(process.env.TRACE_MAX_PER_BOT) || 50,
      // Автоочистка старых трассировок (дни)
      cleanupAfterDays: parseInt(process.env.TRACE_CLEANUP_DAYS) || 7,
    };

    // Хранилище завершённых трассировок in памяти
    // Key: botId, Value: [traces] (отсортированные by времени)
    this.completedTraces = new Map();

    this._cleanupTimer = null;
    this._startPeriodicCleanup();
  }

  _startPeriodicCleanup() {
    const intervalMs = parseInt(process.env.TRACE_CLEANUP_INTERVAL_MS) || (60 * 60 * 1000);
    if (this._cleanupTimer) clearInterval(this._cleanupTimer);
    this._cleanupTimer = setInterval(() => {
      this.cleanup().catch((error) => {
        console.error('[TraceCollector] Periodic cleanup failed:', error);
      });
    }, intervalMs);
    if (typeof this._cleanupTimer.unref === 'function') {
      this._cleanupTimer.unref();
    }
  }

  stopPeriodicCleanup() {
    if (this._cleanupTimer) {
      clearInterval(this._cleanupTimer);
      this._cleanupTimer = null;
    }
  }

  /**
   * Установить Socket.IO instance for real-time уведомлений
   */
  setSocketIO(io) {
    this.io = io;
  }

  /**
   * Начать новую трассировку execution
   */
  async startTrace(botId, graphId, eventType, eventArgs = {}) {
    const traceId = this._generateTraceId();

    const trace = {
      id: traceId,
      graphId,
      botId,
      eventType,
      eventArgs: JSON.stringify(eventArgs),
      startTime: new Date(),
      endTime: null,
      status: 'running',
      error: null,
      steps: []
    };

    this.activeTraces.set(traceId, trace);

    // Эмитим event начала трассировки
    this._emitTraceEvent(botId, graphId, 'trace:start', {
      traceId,
      graphId,
      eventType,
      startTime: trace.startTime,
    });

    return traceId;
  }

  /**
   * Записать шаг execution ноды
   */
  recordStep(traceId, stepData) {
    const trace = this.activeTraces.get(traceId);
    if (!trace) {
      console.warn(t('services:log_b792eb41', { traceId: traceId }));
      return;
    }

    const step = {
      nodeId: stepData.nodeId,
      nodeType: stepData.nodeType,
      timestamp: new Date(),
      status: stepData.status || 'executed', // executed, skipped, error
      inputs: stepData.inputs || {},
      outputs: stepData.outputs || {},
      error: stepData.error || null,
      duration: stepData.duration || null,
    };

    trace.steps.push(step);

    // Эмитим event шага
    this._emitTraceEvent(trace.botId, trace.graphId, 'trace:step', {
      traceId,
      step,
    });
  }

  /**
   * Обновить outputs for последнего шага with указанным nodeId
   */
  updateStepOutputs(traceId, nodeId, outputs) {
    const trace = this.activeTraces.get(traceId);
    if (!trace) {
      // Трассировка already завершена - это нормально, просто игнорируем
      return;
    }

    // Находим last шаг with этим nodeId
    for (let i = trace.steps.length - 1; i >= 0; i--) {
      if (trace.steps[i].nodeId === nodeId && trace.steps[i].type !== 'traversal') {
        trace.steps[i].outputs = outputs;
        break;
      }
    }
  }

  /**
   * Обновить duration for последнего шага with указанным nodeId
   */
  updateStepDuration(traceId, nodeId, duration) {
    const trace = this.activeTraces.get(traceId);
    if (!trace) {
      // Трассировка already завершена - это нормально, просто игнорируем
      return;
    }

    // Находим last шаг with этим nodeId
    for (let i = trace.steps.length - 1; i >= 0; i--) {
      if (trace.steps[i].nodeId === nodeId && trace.steps[i].type !== 'traversal') {
        trace.steps[i].duration = duration;
        break;
      }
    }
  }

  /**
   * Обновить status errors for последнего шага with указанным nodeId
   */
  updateStepError(traceId, nodeId, error, duration) {
    const trace = this.activeTraces.get(traceId);
    if (!trace) {
      return;
    }

    // Находим last шаг with этим nodeId
    for (let i = trace.steps.length - 1; i >= 0; i--) {
      if (trace.steps[i].nodeId === nodeId && trace.steps[i].type !== 'traversal') {
        trace.steps[i].status = 'error';
        trace.steps[i].error = error;
        trace.steps[i].duration = duration;
        break;
      }
    }
  }

  /**
   * Записать прохождение by связи (exec flow)
   */
  recordTraversal(traceId, fromNodeId, toPinId, toNodeId) {
    const trace = this.activeTraces.get(traceId);
    if (!trace) {
      return;
    }

    const step = {
      type: 'traversal',
      fromNodeId,
      toPinId,
      toNodeId,
      timestamp: new Date(),
    };

    trace.steps.push(step);

    this._emitTraceEvent(trace.botId, trace.graphId, 'trace:traversal', {
      traceId,
      step,
    });
  }

  /**
   * Завершить трассировку (успешно)
   */
  async completeTrace(traceId) {
    const trace = this.activeTraces.get(traceId);
    if (!trace) {
      console.warn(t('services:log_b792eb41', { traceId: traceId }));
      return;
    }

    // Защита от race condition - помечаем trace как завершаемый
    if (trace.isCompleting) {
      console.warn(t('services:log_f70fa53c', { traceId: traceId }));
      return trace;
    }
    trace.isCompleting = true;

    trace.endTime = new Date();
    trace.status = 'completed';

    // Удаляем with небольшой задержкой, чтобы updateStepOutputs успел завершиться
    setTimeout(() => {
      this.activeTraces.delete(traceId);
    }, 100);

    await this._storeCompletedTrace(trace);

    // Not сохраняем трассировки команд in БД (only events)
    if (this.config.persistToDb && trace.eventType !== 'command') {
      await this._persistTraceToDb(trace);
    }

    this._emitTraceEvent(trace.botId, trace.graphId, 'trace:complete', {
      traceId,
      status: 'completed',
      endTime: trace.endTime,
      duration: trace.endTime - trace.startTime,
    });

    return trace;
  }

  /**
   * Завершить трассировку with ошибкой
   */
  async failTrace(traceId, error) {
    const trace = this.activeTraces.get(traceId);
    if (!trace) {
      console.warn(t('services:log_b792eb41', { traceId: traceId }));
      return;
    }

    trace.endTime = new Date();
    trace.status = 'error';
    trace.error = error?.message || String(error);

    this.activeTraces.delete(traceId);

    await this._storeCompletedTrace(trace);

    // Not сохраняем трассировки команд in БД (only events)
    if (this.config.persistToDb && trace.eventType !== 'command') {
      await this._persistTraceToDb(trace);
    }

    this._emitTraceEvent(trace.botId, trace.graphId, 'trace:error', {
      traceId,
      status: 'error',
      error: trace.error,
      endTime: trace.endTime,
      duration: trace.endTime - trace.startTime,
    });

    return trace;
  }

  /**
   * Получить трассировку by ID (from активных or завершённых)
   */
  getTrace(traceId) {
    const activeTrace = this.activeTraces.get(traceId);
    if (activeTrace) {
      return activeTrace;
    }

    for (const traces of this.completedTraces.values()) {
      const trace = traces.find(t => t.id === traceId);
      if (trace) {
        return trace;
      }
    }

    return null;
  }

  /**
   * Получить all трассировки for bot
   */
  getTracesForBot(botId, options = {}) {
    const {
      limit = 50,
      status = null, // 'running', 'completed', 'error'
      graphId = null,
    } = options;

    let traces = [];

    for (const trace of this.activeTraces.values()) {
      if (trace.botId === botId) {
        traces.push(trace);
      }
    }

    const completedForBot = this.completedTraces.get(botId) || [];
    traces.push(...completedForBot);

    if (status) {
      traces = traces.filter(t => t.status === status);
    }
    if (graphId) {
      traces = traces.filter(t => t.graphId === graphId);
    }

    traces.sort((a, b) => b.startTime - a.startTime);

    return traces.slice(0, limit);
  }

  /**
   * Получить последнюю трассировку for graph
   * @param {number} botId - ID bot
   * @param {number} graphId - ID graph
   * @param {string} eventType - Опциональный фильтр by типу events (например, 'command', 'chat', 'botStartup')
   */
  async getLastTraceForGraph(botId, graphId, eventType = null) {
    let traces = this.getTracesForBot(botId, { graphId, limit: 100 }); // Увеличиваем лимит для фильтрации

    if (eventType) {
      traces = traces.filter(t => t.eventType === eventType);
    }

    if (traces.length > 0) {
      return traces[0];
    }

    if (this.config.persistToDb) {
      try {
        const where = {
          botId,
          graphId,
        };

        if (eventType) {
          where.eventType = eventType;
        }

        const dbTrace = await prisma.executionTrace.findFirst({
          where,
          orderBy: {
            startTime: 'desc'
          }
        });

        if (dbTrace) {
          console.log('[TraceCollector] Loaded trace from DB:', {
            traceId: dbTrace.id,
            eventType: dbTrace.eventType,
            stepsType: typeof dbTrace.steps,
            stepsIsString: typeof dbTrace.steps === 'string',
            stepsLength: dbTrace.steps?.length,
            rawSteps: dbTrace.steps,
          });

          return {
            ...dbTrace,
            eventArgs: typeof dbTrace.eventArgs === 'string' ? JSON.parse(dbTrace.eventArgs) : dbTrace.eventArgs,
            steps: typeof dbTrace.steps === 'string' ? JSON.parse(dbTrace.steps) : dbTrace.steps,
          };
        }
      } catch (error) {
        console.error(t('services:error_536be18c'), error);
      }
    }

    return null;
  }

  /**
   * Очистить all трассировки for конкретного bot (when остановке bot)
   */
  clearForBot(botId) {
    // Удаляем активные трассировки этого bot
    for (const [traceId, trace] of this.activeTraces.entries()) {
      if (trace.botId === botId) {
        this.activeTraces.delete(traceId);
      }
    }

    // Удаляем завершённые трассировки
    this.completedTraces.delete(botId);

    console.log(t('services:log_396ff24e', { botId: botId }));
  }

  /**
   * Очистить старые трассировки (периодическая очистка)
   */
  async cleanup() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.cleanupAfterDays);

    for (const [botId, traces] of this.completedTraces.entries()) {
      const filtered = traces.filter(t => t.startTime > cutoffDate);
      if (filtered.length === 0) {
        this.completedTraces.delete(botId);
      } else {
        this.completedTraces.set(botId, filtered);
      }
    }

    if (this.config.persistToDb) {
      await prisma.executionTrace.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          }
        }
      });
    }

    console.log(t('services:log_f2fc538c'));
  }

  /**
   * Сохранить завершённую трассировку in памяти
   */
  async _storeCompletedTrace(trace) {
    const botId = trace.botId;

    if (!this.completedTraces.has(botId)) {
      this.completedTraces.set(botId, []);
    }

    const traces = this.completedTraces.get(botId);
    traces.unshift(trace); // Добавляем в начало (новые первыми)

    if (traces.length > this.config.maxTracesPerBot) {
      traces.splice(this.config.maxTracesPerBot);
    }

    this.completedTraces.set(botId, traces);
  }

  /**
   * Сохранить трассировку in БД
   */
  async _persistTraceToDb(trace) {
    try {
      await prisma.executionTrace.create({
        data: {
          id: trace.id,
          botId: trace.botId,
          graphId: trace.graphId,
          eventType: trace.eventType,
          eventArgs: trace.eventArgs,
          startTime: trace.startTime,
          endTime: trace.endTime,
          status: trace.status,
          error: trace.error,
          steps: JSON.stringify(trace.steps),
        }
      });
    } catch (error) {
      console.error(t('services:error_0b6a8609'), error);
    }
  }

  /**
   * Генерировать уникальный ID трассировки
   */
  _generateTraceId() {
    return `trace_${randomUUID()}`;
  }

  /**
   * Загрузить трассировку from БД
   */
  async loadTraceFromDb(traceId) {
    if (!this.config.persistToDb) {
      return null;
    }

    try {
      const trace = await prisma.executionTrace.findUnique({
        where: { id: traceId }
      });

      if (!trace) {
        return null;
      }

      return {
        ...trace,
        eventArgs: typeof trace.eventArgs === 'string' ? JSON.parse(trace.eventArgs) : trace.eventArgs,
        steps: typeof trace.steps === 'string' ? JSON.parse(trace.steps) : trace.steps,
      };
    } catch (error) {
      console.error(t('services:error_1ee804bc'), error);
      return null;
    }
  }

  /**
   * Получить статистику трассировок
   */
  getStats() {
    let totalActive = this.activeTraces.size;
    let totalCompleted = 0;

    for (const traces of this.completedTraces.values()) {
      totalCompleted += traces.length;
    }

    return {
      active: totalActive,
      completed: totalCompleted,
      botsWithTraces: this.completedTraces.size,
      config: this.config,
    };
  }

  /**
   * Эмитить Socket.IO event for трассировки
   */
  _emitTraceEvent(botId, graphId, eventName, data) {
    if (!this.io) {
      return; // Socket.IO не инициализирован
    }

    this.io.emit(`bot:${botId}:${eventName}`, {
      botId,
      graphId,
      ...data,
    });

    this.io.emit(`graph:${graphId}:${eventName}`, {
      botId,
      graphId,
      ...data,
    });
  }
}

let instance = null;

module.exports = {
  TraceCollectorService,
  getTraceCollector: () => {
    if (!instance) {
      instance = new TraceCollectorService();
    }
    return instance;
  }
};

const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { checkBotAccess } = require('../middleware/botAccess');
const router = express.Router();
const { getTraceCollector } = require('../../core/services/TraceCollectorService');
const { t } = require('../../i18n');

router.use(authenticate);
router.use('/:botId', (req, res, next) => {
    if (!/^\d+$/.test(req.params.botId)) return next();
    return checkBotAccess(req, res, next);
});

/**
 * GET /api/traces/:botId
 * Получить трассировки for bot
 */
router.get('/:botId', authorize('management:view'), async (req, res) => {
  try {
    const botId = parseInt(req.params.botId);
    const { limit, status, graphId } = req.query;

    const options = {
      limit: limit ? parseInt(limit) : 150,
      status: status || null,
      graphId: graphId ? parseInt(graphId) : null,
    };

    const traceCollector = getTraceCollector();
    const traces = traceCollector.getTracesForBot(botId, options);

    res.json({
      success: true,
      traces,
    });
  } catch (error) {
    console.error(t('api:error_a2d08b49'), error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/traces/:botId/:traceId
 * Получить конкретную трассировку by ID
 */
router.get('/:botId/:traceId', authorize('management:view'), async (req, res) => {
  try {
    const { traceId } = req.params;

    const traceCollector = getTraceCollector();
    let trace = traceCollector.getTrace(traceId);

    // If not нашли in памяти, пытаемся загрузить from БД
    if (!trace) {
      trace = await traceCollector.loadTraceFromDb(traceId);
    }

    if (!trace) {
      return res.status(404).json({
        success: false,
        error: t('api:msg_b3ba1397'),
      });
    }

    res.json({
      success: true,
      trace,
    });
  } catch (error) {
    console.error(t('api:error_e29a2c91'), error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/traces/:botId/graph/:graphId/last
 * Получить последнюю трассировку for graph
 * Query params: eventType (опционально) - фильтр by типу events
 */
router.get('/:botId/graph/:graphId/last', authorize('management:view'), async (req, res) => {
  try {
    const botId = parseInt(req.params.botId);
    const graphId = parseInt(req.params.graphId);
    const { eventType } = req.query;

    const traceCollector = getTraceCollector();
    const trace = await traceCollector.getLastTraceForGraph(botId, graphId, eventType);

    if (!trace) {
      return res.status(404).json({
        success: false,
        error: t('api:msg_b3ba1397'),
      });
    }

    res.json({
      success: true,
      trace,
    });
  } catch (error) {
    console.error(t('api:error_7b61ba36'), error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/traces/stats
 * Получить статистику трассировок
 */
router.get('/stats', authorize('management:view'), async (req, res) => {
  try {
    const traceCollector = getTraceCollector();
    const stats = traceCollector.getStats();

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error(t('api:error_204fb65a'), error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

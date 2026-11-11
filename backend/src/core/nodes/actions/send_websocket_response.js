const { t } = require('../../../i18n');
/**
 * Нода: Отправить response in WebSocket
 * Sends data обратно клиенту, вызвавшему graph through WebSocket API
 *
 * @param {object} node - Instance node from graph.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {function} helpers.resolvePinValue - Function for getting values with pin.
 * @param {function} helpers.traverse - Function for transitioning to next node.
 */
async function execute(node, context, helpers) {
    const data = await helpers.resolvePinValue(node, 'data', null);

    // Проверяем, что graph was вызван through WebSocket API
    if (!context.sendResponse || typeof context.sendResponse !== 'function') {
        console.warn(t('nodes:log_bd8d608e'));
        await helpers.traverse(node, 'exec');
        return;
    }

    // Отправляем response клиенту
    try {
        context.sendResponse(data);
        console.log(t('nodes:log_6ef6921d'), data);
    } catch (error) {
        console.error(t('nodes:error_b04a9fcd'), error);
    }

    // Продолжаем выполнение graph
    await helpers.traverse(node, 'exec');
}

module.exports = { execute };

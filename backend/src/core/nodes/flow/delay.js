/**
 * Node delay execution.
 *
 * Логика:
 * - Ждет указанное количество миллисекунд.
 * - After ожидания продолжает выполнение by выходу exec.
 *
 * Usage in графе:
 * - Input exec подключается от предыдущего действия.
 * - Input delay (Number) можно задать константой or подать with другого node.
 * - Output exec соединяется with следующим действием.
 */

/**
 * @param {object} node - Instance node from graph.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {function} helpers.resolvePinValue - Function for getting values with входного pin.
 * @param {function} helpers.traverse - Function for transitioning to next node.
 */
async function execute(node, context, helpers) {
    const { resolvePinValue, traverse } = helpers;

    // Value delay in миллисекундах.
    // Можно задать как data.delay in ноде, либо through входной пин delay.
    let delayMs = await resolvePinValue(node, 'delay', node.data?.delay ?? 0);

    // Нормализуем value
    delayMs = Number(delayMs);
    if (!Number.isFinite(delayMs) || delayMs < 0) {
        delayMs = 0;
    }

    if (delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    await traverse(node, 'exec');
}

module.exports = {
    execute,
};

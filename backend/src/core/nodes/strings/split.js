/**
 * @param {object} node - Instance node from graph.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {function} helpers.resolvePinValue - Function for getting values with входного pin.
 * @param {function} helpers.traverse - Function for transitioning to next node.
 */
async function execute(node, context, helpers) {
    const { resolvePinValue, traverse } = helpers;

    await traverse(node, 'exec');
}

/**
 * @param {object} node - Instance node from graph.
 * @param {string} pinId - Идентификатор выходного pin, value которого need вычислить.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {function} helpers.resolvePinValue - Function for getting values with входного pin.
 * @returns {Promise<any>} - Вычисленное value for выходного pin.
 */
async function evaluate(node, pinId, context, helpers) {
    const { resolvePinValue } = helpers;

    if (pinId === 'array') {
        const str = String(await resolvePinValue(node, 'string', ''));
        const separator = String(await resolvePinValue(node, 'separator', ''));
        return str.split(separator);
    }

    return [];
}

module.exports = {
    execute,
    evaluate,
};

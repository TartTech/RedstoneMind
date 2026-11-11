/**
 * @param {object} node - Instance node from graph.
 * @param {string} pinId - Идентификатор выходного pin, value которого need вычислить.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @returns {Promise<any>} - Вычисленное value for выходного pin.
 */
async function evaluate(node, pinId, context, helpers, defaultValue = null) {
    const args = context.args || context.commandArguments || {};
    const argName = (await helpers?.resolvePinValue?.(node, 'argumentName', node.data?.argumentName || ''))
        || node.data?.argumentName
        || '';

    if (pinId === 'value') {
        return args && argName && args[argName] !== undefined ? args[argName] : defaultValue;
    } else if (pinId === 'exists') {
        return args && argName && args[argName] !== undefined;
    }

    return null;
}

module.exports = {
    evaluate,
};

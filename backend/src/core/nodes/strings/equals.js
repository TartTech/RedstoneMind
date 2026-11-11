/**
 * @param {object} node - Instance node from graph.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {function} helpers.traverse - Function for transitioning to next node.
 */
async function execute(node, context, helpers) {
    const { traverse } = helpers;
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

    if (pinId === 'result') {
        const strA = String(await resolvePinValue(node, 'a', ''));
        const strB = String(await resolvePinValue(node, 'b', ''));
        const caseSensitive = node.data?.case_sensitive ?? true;
        return caseSensitive ? strA === strB : strA.toLowerCase() === strB.toLowerCase();
    }

    return null;
}

module.exports = {
    execute,
    evaluate,
};

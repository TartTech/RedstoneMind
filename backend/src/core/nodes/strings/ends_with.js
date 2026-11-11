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

    if (pinId === 'result') {
        const str = String(await resolvePinValue(node, 'string', ''));
        const suffix = String(await resolvePinValue(node, 'suffix', ''));
        const caseSensitive = await resolvePinValue(node, 'case_sensitive', false);

        if (caseSensitive) {
            return str.endsWith(suffix);
        } else {
            return str.toLowerCase().endsWith(suffix.toLowerCase());
        }
    }

    return null;
}

module.exports = {
    execute,
    evaluate,
};

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
        const haystack = String(await resolvePinValue(node, 'haystack', ''));
        const needle = String(await resolvePinValue(node, 'needle', ''));
        const caseSensitive = await resolvePinValue(node, 'case_sensitive', false);

        if (caseSensitive) {
            return haystack.includes(needle);
        } else {
            return haystack.toLowerCase().includes(needle.toLowerCase());
        }
    }

    return null;
}

module.exports = {
    execute,
    evaluate,
};

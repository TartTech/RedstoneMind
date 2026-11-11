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
        const str = String(await resolvePinValue(node, 'string', ''));
        const regexStr = String(await resolvePinValue(node, 'regex', ''));
        if (str.length > 10000 || regexStr.length > 1000) {
            return false;
        }
        try {
            return new RegExp(regexStr).test(str);
        } catch (e) {
            return false;
        }
    }

    return null;
}

module.exports = {
    execute,
    evaluate,
};

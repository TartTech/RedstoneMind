/**
 * @param {object} node - Instance node from graph.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {function} helpers.resolvePinValue - Function for getting values with pin.
 * @param {function} helpers.traverse - Function for transitioning to next node.
 */
async function execute(node, context, helpers) {
    const { resolvePinValue, traverse } = helpers;

    const value = await resolvePinValue(node, 'value');
    const caseCount = node.data?.caseCount || 0;
    let matched = false;

    for (let i = 0; i < caseCount; i++) {
        const caseValue = node.data?.[`case_${i}`];
        if (caseValue !== undefined) {
            let isMatch = false;

            if (Array.isArray(value) && Array.isArray(caseValue)) {
                isMatch = JSON.stringify(value) === JSON.stringify(caseValue);
            } else if (typeof value === 'object' && typeof caseValue === 'object' && value !== null && caseValue !== null) {
                isMatch = JSON.stringify(value) === JSON.stringify(caseValue);
            } else if (typeof value === 'number' && typeof caseValue === 'number') {
                isMatch = value === caseValue;
            } else if (typeof value === 'boolean' && typeof caseValue === 'boolean') {
                isMatch = value === caseValue;
            } else {
                isMatch = String(value) === String(caseValue);
            }

            if (isMatch) {
                await traverse(node, `case_${i}`);
                matched = true;
                break;
            }
        }
    }

    if (!matched) {
        await traverse(node, 'default');
    }
}

module.exports = {
    execute,
};

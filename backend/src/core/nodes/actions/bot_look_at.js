/**
 * @param {object} node - Instance node from graph.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {function} helpers.resolvePinValue - Function for getting values with pin.
 * @param {function} helpers.traverse - Function for transitioning to next node.
 */
async function execute(node, context, helpers) {
    const { resolvePinValue, traverse } = helpers;

    const target = await resolvePinValue(node, 'target');
    const yOffset = await resolvePinValue(node, 'add_y', 0);

    if (target && context.bot?.lookAt) {
        let finalPosition;
        // If цель - это entity, у которой есть position
        if (target.position) {
            finalPosition = { ...target.position };
        }
        // If цель - это object with координатами
        else if (target.x !== undefined && target.y !== undefined && target.z !== undefined) {
            finalPosition = { ...target };
        }

        if (finalPosition) {
            finalPosition.y += Number(yOffset || 0);
            await context.bot.lookAt(finalPosition.x, finalPosition.y, finalPosition.z);
        }
    }

    await traverse(node, 'exec');
}

module.exports = {
    execute,
};

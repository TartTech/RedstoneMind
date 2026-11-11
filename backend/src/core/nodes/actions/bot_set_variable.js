/**
 * @param {object} node - Instance node from graph.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {function} helpers.resolvePinValue - Function for getting values with pin.
 * @param {function} helpers.traverse - Function for transitioning to next node.
 */
async function execute(node, context, helpers) {
    const { resolvePinValue, traverse } = helpers;

    const varName = await resolvePinValue(node, 'name', '');
    const varValue = await resolvePinValue(node, 'value');
    let shouldPersist = await resolvePinValue(node, 'persist', false);

    // In графах команд принудительно отключаем сохранение in БД, чтобы избежать случайных записей
    if (context.eventType === 'command') {
        shouldPersist = false;
    }

    if (varName) {
        context.variables[varName] = varValue;
        if (context.persistenceIntent) {
          context.persistenceIntent.set(varName, shouldPersist);
        }
    }

    await traverse(node, 'exec');
}

module.exports = {
    execute,
};

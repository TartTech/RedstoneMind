const BreakLoopSignal = require('../../BreakLoopSignal');

/**
 * @param {object} node - Instance node from graph.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {function} helpers.resolvePinValue - Function for getting values with pin.
 * @param {function} helpers.traverse - Function for transitioning to next node.
 * @param {Map} helpers.memo - Карта for мемоизации значений in рамках одного execution graph.
 * @param {function} helpers.clearLoopBodyMemo - Function for очистки мемоизации внутри body цикла.
 */
async function execute(node, context, helpers) {
    const { resolvePinValue, traverse, memo, clearLoopBodyMemo } = helpers;

    const array = await resolvePinValue(node, 'array', []);
    if (Array.isArray(array)) {
        try {
            for (let i = 0; i < array.length; i++) {
                const element = array[i];
                memo.set(`${node.id}:element`, element);
                memo.set(`${node.id}:index`, i);
                clearLoopBodyMemo(node);
                await traverse(node, 'loop_body');
            }
        } catch (e) {
            if (e instanceof BreakLoopSignal) {
                // Цикл was прерван узлом Break, это ожидаемое поведение.
            } else {
                // Перебрасываем другие, неожиданные errors.
                throw e;
            }
        }
    }
    await traverse(node, 'completed');
}

module.exports = {
    execute,
};

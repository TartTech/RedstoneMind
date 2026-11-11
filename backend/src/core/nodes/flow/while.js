const BreakLoopSignal = require('../../BreakLoopSignal');
const { t } = require('../../../i18n');

/**
 * @param {object} node - Instance node from graph.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {function} helpers.resolvePinValue - Function for getting values with входного pin.
 * @param {function} helpers.traverse - Function for transitioning to next node.
 * @param {function} helpers.clearLoopBodyMemo - Function for очистки мемоизации body цикла.
 * @param {Map} helpers.memo - Map for хранения мемоизированных значений.
 */
async function execute(node, context, helpers) {
    const { resolvePinValue, traverse, clearLoopBodyMemo, memo } = helpers;

    let iteration = 0;
    const maxIterations = 1000;

    try {
        while (iteration < maxIterations) {
            const condition = await resolvePinValue(node, 'condition', false);
            if (!condition) break;

            memo.set(`${node.id}:iteration`, iteration);
            clearLoopBodyMemo(node);
            await traverse(node, 'loop_body');
            iteration++;
        }

        if (iteration >= maxIterations) {
            console.warn(t('nodes:log_a72d8cf8', { maxIterations: maxIterations }));
        }
    } catch (e) {
        if (e instanceof BreakLoopSignal) {
            // Прерывание цикла - это нормально
        } else {
            throw e;
        }
    }

    await traverse(node, 'completed');
}

/**
 * @param {object} node - Instance node from graph.
 * @param {string} pinId - Идентификатор выходного pin, value которого need вычислить.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {Map} helpers.memo - Map for хранения мемоизированных значений.
 * @returns {Promise<any>} - Вычисленное value for выходного pin.
 */
async function evaluate(node, pinId, context, helpers) {
    const { memo } = helpers;

    if (pinId === 'iteration') {
        return memo.get(`${node.id}:iteration`);
    }

    return null;
}

module.exports = {
    execute,
    evaluate,
};

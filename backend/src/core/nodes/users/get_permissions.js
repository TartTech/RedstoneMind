const User = require('../../UserService');

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

    const userIdentifier = await resolvePinValue(node, 'user', null);
    let permissions = [];
    let usernameToFind = null;

    if (typeof userIdentifier === 'string') {
        usernameToFind = userIdentifier;
    } else if (userIdentifier && typeof userIdentifier === 'object' && userIdentifier.username) {
        usernameToFind = userIdentifier.username;
    }

    if (usernameToFind) {
        const { graphUser } = require('../../graphServices');
        const user = await graphUser(context, usernameToFind);
        if (user && user.permissionsSet) {
            permissions = Array.from(user.permissionsSet);
        }
    }
    
    return permissions;
}

module.exports = {
    evaluate,
};

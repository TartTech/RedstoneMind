const User = require('../../UserService');

/**
 * @param {object} node - Instance node from graph.
 * @param {string} pinId - Идентификатор выходного pin, value которого need вычислить.
 * @param {object} context - Context execution graph.
 * @param {object} helpers - Helper functions engine.
 * @param {function} helpers.resolvePinValue - Function for getting values with входного pin.
 * @returns {Promise<any>} - Вычисленное value for выходного pin.
 */
async function evaluate(node, pinId, context, helpers, defaultValue = null) {
    const { resolvePinValue } = helpers;

    const userIdentifier = await resolvePinValue(node, 'user');
    let userObject = null;

    if (userIdentifier && typeof userIdentifier === 'object' && userIdentifier.username) {
        userObject = userIdentifier;
    } else if (typeof userIdentifier === 'string' && userIdentifier.length > 0) {
        const { graphUser } = require('../../graphServices');
        userObject = await graphUser(context, userIdentifier);
    }

    if (userObject) {
        if (pinId === 'username') {
            return userObject.username;
        } else if (pinId === 'groups') {
            return userObject.groups ? userObject.groups.map(g => g.group?.name).filter(Boolean) : [];
        } else if (pinId === 'permissions') {
            return userObject.permissionsSet ? Array.from(userObject.permissionsSet) : [];
        } else if (pinId === 'isBlacklisted') {
            return !!userObject.isBlacklisted;
        }
    }

    return defaultValue;
}

module.exports = {
    evaluate,
};

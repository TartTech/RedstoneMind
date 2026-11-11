const { t } = require('../i18n');
function parseStringList(value, fallback) {
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string' || !value) return fallback;
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch {
        return fallback;
    }
}

function cooldownDomain(permissionName) {
    const name = String(permissionName || '');
    const domain = name.split('.')[0];
    return domain || 'user';
}

function checkCommandAccess({
    commandName,
    prefix = '@',
    isEnabled = true,
    allowedChatTypes = ['chat', 'private'],
    argumentsDef = [],
    args = {},
    typeChat = 'chat',
    permissionName = null,
    cooldown = 0,
    asOwner = false,
    permissions = [],
    cooldownLeft = 0,
}) {
    const granted = new Set((permissions || []).map((item) => String(item)));
    const chatTypes = parseStringList(allowedChatTypes, ['chat', 'private']);

    if (!isEnabled && !asOwner) {
        return { allowed: false, reason: 'disabled', messages: [] };
    }

    if (!chatTypes.includes(typeChat) && !asOwner) {
        return { allowed: false, reason: 'chat', messages: [] };
    }

    for (const argDef of argumentsDef) {
        if (!argDef?.required) continue;
        if (args[argDef.name] !== undefined && args[argDef.name] !== null) continue;
        const usage = argumentsDef.map((arg) => (
            arg.required ? `<${arg.description || arg.name}>` : `[${arg.description || arg.name}]`
        )).join(' ');
        return {
            allowed: false,
            reason: 'args',
            messages: [
                { typeChat, message: t('core:error_18fc663a', { argDef: argDef.description || argDef.name }) },
                { typeChat, message: t('core:msg_94cf8115', { prefix: prefix, commandName: commandName, usage: usage }).trim() },
            ],
        };
    }

    if (permissionName && !asOwner && !granted.has(permissionName) && !granted.has('*')) {
        return {
            allowed: false,
            reason: 'permission',
            messages: [
                { typeChat, message: t('core:msg_d8258c77', { commandName: commandName }) },
            ],
        };
    }

    const bypass = granted.has(`${cooldownDomain(permissionName)}.cooldown.bypass`);
    if (Number(cooldown) > 0 && !asOwner && !bypass && Number(cooldownLeft) > 0) {
        return {
            allowed: false,
            reason: 'cooldown',
            messages: [
                { typeChat, message: t('core:msg_c8355083', { commandName: commandName, cooldownLeft: cooldownLeft }) },
            ],
        };
    }

    return { allowed: true, reason: null, messages: [] };
}

module.exports = { checkCommandAccess, parseStringList };

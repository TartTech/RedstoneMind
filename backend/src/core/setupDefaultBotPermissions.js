const prisma = require('../lib/prisma');
const { t } = require('../i18n');

const INITIAL = {
    groups: ['User', 'Admin'],
    permissions: [
        { name: 'admin.*', description: t('tests:perm_87b060b3') },
        { name: 'admin.cooldown.bypass', description: t('services:msg_8e581741') },
        { name: 'user.*', description: t('services:perm_9b091116') },
        { name: 'user.say', description: t('services:perm_a22ada6c') },
        { name: 'user.cooldown.bypass', description: t('services:msg_c72d67c6') },
    ],
    groupPermissions: {
        User: ['user.say'],
        Admin: ['admin.*', 'admin.cooldown.bypass', 'user.cooldown.bypass', 'user.*'],
    },
};

async function setupDefaultPermissionsForBot(botId, prismaClient = prisma) {
    for (const perm of INITIAL.permissions) {
        await prismaClient.permission.upsert({
            where: { botId_name: { botId, name: perm.name } },
            update: { description: perm.description },
            create: { ...perm, botId, owner: 'system' },
        });
    }
    for (const groupName of INITIAL.groups) {
        await prismaClient.group.upsert({
            where: { botId_name: { botId, name: groupName } },
            update: {},
            create: { name: groupName, botId, owner: 'system' },
        });
    }
    for (const [groupName, permNames] of Object.entries(INITIAL.groupPermissions)) {
        const group = await prismaClient.group.findUnique({ where: { botId_name: { botId, name: groupName } } });
        if (!group) continue;
        for (const permName of permNames) {
            const permission = await prismaClient.permission.findUnique({ where: { botId_name: { botId, name: permName } } });
            if (!permission) continue;
            await prismaClient.groupPermission.upsert({
                where: { groupId_permissionId: { groupId: group.id, permissionId: permission.id } },
                update: {},
                create: { groupId: group.id, permissionId: permission.id },
            });
        }
    }
}

module.exports = { setupDefaultPermissionsForBot };

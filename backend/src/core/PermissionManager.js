const { PrismaClient } = require('@prisma/client');
const { t } = require('../i18n');
const prisma = new PrismaClient();

class PermissionManager {
    /**
     * Регистрирует одно or несколько прав for КОНКРЕТНОГО bot.
     * @param {number} botId - ID bot, for которого регистрируются permissions.
     * @param {Array<object>} permissions - Array объектов прав.
     */
    async registerPermissions(botId, permissions) {
        for (const perm of permissions) {
            if (!perm.name || !perm.owner) {
                console.warn(t('core:log_6a02dbae'), perm);
                continue;
            }
            await prisma.permission.upsert({
                where: { botId_name: { botId, name: perm.name } },
                update: { description: perm.description },
                create: {
                    botId,
                    name: perm.name,
                    description: perm.description || '',
                    owner: perm.owner,
                },
            });
        }
    }


    /**
     * Добавляет permissions to already существующей группе.
     * @param {number} botId - ID bot.
     * @param {string} groupName - Name groups, которую need обновить.
     * @param {Array<string>} permissionNames - Array имен прав for добавления.
     */
    async addPermissionsToGroup(botId, groupName, permissionNames) {
        const group = await prisma.group.findUnique({
            where: { botId_name: { botId, name: groupName } }
        });

        if (!group) {
            console.warn(`[PermissionManager] Попытка добавить права в несуществующую группу "${groupName}" для бота ID ${botId}.`);
            return;
        }

        for (const permName of permissionNames) {
            const permission = await prisma.permission.findUnique({
                where: { botId_name: { botId, name: permName } }
            });

            if (permission) {
                await prisma.groupPermission.upsert({
                    where: { groupId_permissionId: { groupId: group.id, permissionId: permission.id } },
                    update: {},
                    create: { groupId: group.id, permissionId: permission.id },
                });
            } else {
                console.warn(`[PermissionManager] Право "${permName}t('core:msg_6087c904')${groupName}".`);
            }
        }
    }

    /**
     * Регистрирует группу for КОНКРЕТНОГО bot and привязывает to ней permissions.
     * @param {number} botId - ID bot, for которого регистрируется group.
     * @param {object} groupConfig - Configuration groups.
     */
    async registerGroup(botId, groupConfig) {
        if (!groupConfig.name || !groupConfig.owner) {
            console.warn(t('core:log_f469eddf'), groupConfig);
            return;
        }

        const group = await prisma.group.upsert({
            where: { botId_name: { botId, name: groupConfig.name } },
            update: {},
            create: { botId, name: groupConfig.name, owner: groupConfig.owner },
        });

        if (groupConfig.permissions && groupConfig.permissions.length > 0) {
            for (const permName of groupConfig.permissions) {
                const permission = await prisma.permission.findUnique({ where: { botId_name: { botId, name: permName } } });
                if (permission) {
                    await prisma.groupPermission.upsert({
                        where: { groupId_permissionId: { groupId: group.id, permissionId: permission.id } },
                        update: {},
                        create: { groupId: group.id, permissionId: permission.id },
                    });
                } else {
                    console.warn(`[PermissionManager] Право "${permName}t('core:msg_bab428c6')${groupConfig.name}".`);
                }
            }
        }
    }
}

module.exports = new PermissionManager();
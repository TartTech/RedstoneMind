const fs = require('fs/promises');
const path = require('path');
const prisma = require('../lib/prisma');
const { t } = require('../i18n');

class PluginService {
    async registerPluginFromPath(directoryPath) {
        const absolutePath = path.resolve(directoryPath);
        const packageJsonPath = path.join(absolutePath, 'package.json');

        try {
            await fs.access(packageJsonPath);
            const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
            const packageJson = JSON.parse(packageJsonContent);

            if (!packageJson.name || !packageJson.version || !packageJson.main) {
                throw new Error(t('core:validation_157b159e'));
            }

            const manifest = packageJson.botpanel || {};
            const pluginData = {
                name: packageJson.name,
                description: packageJson.description || '',
                version: packageJson.version,
                path: path.join(absolutePath, packageJson.main),
                sourceType: 'LOCAL',
                sourceUri: absolutePath,
                manifest,
            };

            return prisma.plugin.upsert({
                where: { name: pluginData.name },
                update: { ...pluginData },
                create: { ...pluginData },
            });
        } catch (error) {
            console.error(t('core:error_30bb2275', { directoryPath: directoryPath }), error.message);
            throw new Error(t('core:error_bbb0f4f5', { error: error.message }));
        }
    }

    async syncPluginsWithDb() {
        return { ok: true };
    }
}

module.exports = new PluginService();

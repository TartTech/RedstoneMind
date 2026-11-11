const { pluginDependencySatisfied, diffSettings, listDeclaredPermissions } = require('../../core/utils/pluginManifest');
const { t } = require('../../i18n');

describe('pluginManifest', () => {
    test(t('tests:msg_63f4ce5c'), () => {
        expect(pluginDependencySatisfied('1.2.0', '^1.0.0')).toBe(true);
        expect(pluginDependencySatisfied('2.0.0', '^1.0.0')).toBe(false);
        expect(pluginDependencySatisfied('1.0.0', '*')).toBe(true);
    });

    test(t('tests:msg_47eb8aea'), () => {
        const diff = diffSettings(
            { muteReason: { type: 'string', label: t('tests:msg_d88300c7') } },
            { reason: { type: 'string', label: t('tests:msg_d88300c7') } },
        );
        expect(diff.renamed).toEqual([{ from: 'muteReason', to: 'reason', label: t('tests:msg_d88300c7') }]);
        expect(diff.added).toEqual([]);
        expect(diff.removed).toEqual([]);
    });

    test(t('tests:msg_43d7dd6a'), () => {
        expect(listDeclaredPermissions({
            permissions: [
                { name: ' clan.mute ', description: t('tests:msg_73e9be7d') },
                { name: '' },
                null,
            ],
        })).toEqual([{ name: 'clan.mute', description: t('tests:msg_73e9be7d') }]);
    });
});

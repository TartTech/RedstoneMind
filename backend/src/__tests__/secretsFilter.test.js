const {
    SECRET_MASK,
    isSecretSetting,
    maskSecretValue,
    filterSecretSettings,
    isMaskedValue,
    prepareSettingsForSave
} = require('../core/utils/secretsFilter');
const { t } = require('../i18n');

describe('secretsFilter', () => {
    describe('isSecretSetting', () => {
        it(t('tests:validation_7e4cfa08'), () => {
            expect(isSecretSetting({ secret: true })).toBe(true);
        });

        it(t('tests:validation_adf81cbd'), () => {
            expect(isSecretSetting({ secret: false })).toBe(false);
            expect(isSecretSetting({})).toBe(false);
            expect(isSecretSetting(null)).toBe(false);
        });
    });

    describe('maskSecretValue', () => {
        const secretConfig = { secret: true };
        const normalConfig = { secret: false };

        it(t('tests:validation_f1630e58'), () => {
            expect(maskSecretValue('my-secret-key', secretConfig)).toBe(SECRET_MASK);
        });

        it(t('tests:validation_d439ce83'), () => {
            expect(maskSecretValue('public-value', normalConfig)).toBe('public-value');
        });

        it(t('tests:validation_93337837'), () => {
            const result = maskSecretValue(['key1', 'key2', 'key3'], secretConfig);
            expect(result).toEqual([SECRET_MASK, SECRET_MASK, SECRET_MASK]);
        });

        it(t('tests:validation_6f1479f3'), () => {
            const result = maskSecretValue({ key1: 'value1', key2: 'value2' }, secretConfig);
            expect(result).toEqual({ key1: SECRET_MASK, key2: SECRET_MASK });
        });

        it(t('tests:validation_8384dd08'), () => {
            expect(maskSecretValue(null, secretConfig)).toBe(null);
            expect(maskSecretValue(undefined, secretConfig)).toBe(undefined);
            expect(maskSecretValue('', secretConfig)).toBe('');
        });

        it(t('tests:validation_b1d29d6d'), () => {
            expect(maskSecretValue(12345, secretConfig)).toBe(SECRET_MASK);
            expect(maskSecretValue(0, secretConfig)).toBe(SECRET_MASK);
            expect(maskSecretValue(-999, secretConfig)).toBe(SECRET_MASK);
        });

        it(t('tests:validation_21844ace'), () => {
            expect(maskSecretValue(true, secretConfig)).toBe(SECRET_MASK);
            expect(maskSecretValue(false, secretConfig)).toBe(SECRET_MASK);
        });

        it(t('tests:validation_9d306f73'), () => {
            expect(maskSecretValue(12345, normalConfig)).toBe(12345);
            expect(maskSecretValue(true, normalConfig)).toBe(true);
            expect(maskSecretValue(false, normalConfig)).toBe(false);
        });
    });

    describe('filterSecretSettings', () => {
        it(t('tests:validation_a7be3593'), () => {
            const settings = {
                apiKey: 'secret-key-123',
                username: 'john_doe',
                password: 'my-password'
            };

            const manifest = {
                apiKey: { type: 'string', secret: true },
                username: { type: 'string' },
                password: { type: 'string', secret: true }
            };

            const result = filterSecretSettings(settings, manifest, false);

            expect(result.apiKey).toBe(SECRET_MASK);
            expect(result.username).toBe('john_doe');
            expect(result.password).toBe(SECRET_MASK);
        });

        it(t('tests:validation_1b206309'), () => {
            const settings = {
                apiKey: 'secret-key-123',
                username: 'john_doe'
            };

            const manifest = {
                t('tests:msg_fe794973'): {
                    label: t('tests:msg_f6dfa4b7'),
                    apiKey: { type: 'string', secret: true },
                    username: { type: 'string' }
                }
            };

            const result = filterSecretSettings(settings, manifest, true);

            expect(result.apiKey).toBe(SECRET_MASK);
            expect(result.username).toBe('john_doe');
        });

        it(t('tests:validation_9330e045'), () => {
            const settings = {
                apiKeys: ['key1', 'key2', 'key3']
            };

            const manifest = {
                apiKeys: { type: 'string[]', secret: true }
            };

            const result = filterSecretSettings(settings, manifest, false);

            expect(result.apiKeys).toEqual([SECRET_MASK, SECRET_MASK, SECRET_MASK]);
        });

        it(t('tests:validation_43d0a052'), () => {
            const settings = { apiKey: 'test' };
            const result = filterSecretSettings(settings, null, false);
            expect(result).toEqual(settings);
        });
    });

    describe('isMaskedValue', () => {
        it(t('tests:validation_53c47afc'), () => {
            expect(isMaskedValue(SECRET_MASK)).toBe(true);
        });

        it(t('tests:validation_dbec935e'), () => {
            expect(isMaskedValue([SECRET_MASK, SECRET_MASK])).toBe(true);
        });

        it(t('tests:validation_7c0ded5d'), () => {
            expect(isMaskedValue({ key1: SECRET_MASK, key2: SECRET_MASK })).toBe(true);
        });

        it(t('tests:validation_d3e178a9'), () => {
            expect(isMaskedValue('real-value')).toBe(false);
            expect(isMaskedValue(['key1', SECRET_MASK])).toBe(false);
            expect(isMaskedValue({ key1: 'value', key2: SECRET_MASK })).toBe(false);
        });

        it(t('tests:validation_a20bc2f2'), () => {
            expect(isMaskedValue([])).toBe(false);
        });

        it(t('tests:validation_7213168c'), () => {
            expect(isMaskedValue({})).toBe(false);
        });

        it(t('tests:validation_1f7d9f09'), () => {
            expect(isMaskedValue([SECRET_MASK, 'real-value'])).toBe(false);
            expect(isMaskedValue(['real-value', SECRET_MASK])).toBe(false);
            expect(isMaskedValue([SECRET_MASK, null])).toBe(false);
        });

        it(t('tests:validation_4c608cd7'), () => {
            expect(isMaskedValue({ key1: SECRET_MASK, key2: 'real-value' })).toBe(false);
            expect(isMaskedValue({ key1: 'real-value', key2: SECRET_MASK })).toBe(false);
            expect(isMaskedValue({ key1: SECRET_MASK, key2: null })).toBe(false);
        });

        it(t('tests:validation_4df6e977'), () => {
            expect(isMaskedValue([SECRET_MASK, 123, true])).toBe(false);
        });

        it(t('tests:validation_f4994c7e'), () => {
            expect(isMaskedValue({ key1: SECRET_MASK, key2: 123, key3: true })).toBe(false);
        });
    });

    describe('prepareSettingsForSave', () => {
        it(t('tests:validation_b884abbc'), () => {
            const newSettings = {
                apiKey: SECRET_MASK,  // не изменилось
                username: 'new_user'  // изменилось
            };

            const existingSettings = {
                apiKey: 'old-secret-key',
                username: 'old_user'
            };

            const manifest = {
                apiKey: { type: 'string', secret: true },
                username: { type: 'string' }
            };

            const result = prepareSettingsForSave(newSettings, existingSettings, manifest, false);

            expect(result.apiKey).toBe('old-secret-key');  // сохранено старое
            expect(result.username).toBe('new_user');       // сохранено новое
        });

        it(t('tests:validation_3feda77f'), () => {
            const newSettings = {
                apiKey: 'new-secret-key',  // изменилось
                username: 'new_user'
            };

            const existingSettings = {
                apiKey: 'old-secret-key',
                username: 'old_user'
            };

            const manifest = {
                apiKey: { type: 'string', secret: true },
                username: { type: 'string' }
            };

            const result = prepareSettingsForSave(newSettings, existingSettings, manifest, false);

            expect(result.apiKey).toBe('new-secret-key');  // сохранено новое
            expect(result.username).toBe('new_user');
        });

        it(t('tests:validation_4820cf05'), () => {
            const newSettings = {
                apiKey: SECRET_MASK,
                username: 'new_user'
            };

            const existingSettings = {
                username: 'old_user'
                // apiKey отсутствует
            };

            const manifest = {
                apiKey: { type: 'string', secret: true },
                username: { type: 'string' }
            };

            const result = prepareSettingsForSave(newSettings, existingSettings, manifest, false);

            expect(result.apiKey).toBeUndefined();  // удалено
            expect(result.username).toBe('new_user');
        });

        it(t('tests:validation_61655a69'), () => {
            const newSettings = {
                apiKey: SECRET_MASK,
                password: 'new-password'
            };

            const existingSettings = {
                apiKey: 'old-key',
                password: 'old-password'
            };

            const manifest = {
                t('tests:msg_f9c1d3e8'): {
                    label: t('tests:msg_e7fdd350'),
                    apiKey: { type: 'string', secret: true },
                    password: { type: 'string', secret: true }
                }
            };

            const result = prepareSettingsForSave(newSettings, existingSettings, manifest, true);

            expect(result.apiKey).toBe('old-key');        // сохранено старое
            expect(result.password).toBe('new-password'); // сохранено новое
        });

        it(t('tests:validation_9330e045'), () => {
            const newSettings = {
                apiKeys: [SECRET_MASK, SECRET_MASK]
            };

            const existingSettings = {
                apiKeys: ['key1', 'key2']
            };

            const manifest = {
                apiKeys: { type: 'string[]', secret: true }
            };

            const result = prepareSettingsForSave(newSettings, existingSettings, manifest, false);

            expect(result.apiKeys).toEqual(['key1', 'key2']);  // сохранены старые
        });

        it(t('tests:validation_62236ee5'), () => {
            const newSettings = {
                apiKeys: ['new-key-1', 'new-key-2', 'new-key-3'],
                passwords: [SECRET_MASK, SECRET_MASK]
            };

            const existingSettings = {
                apiKeys: ['old-key-1', 'old-key-2'],
                passwords: ['old-pass-1', 'old-pass-2']
            };

            const manifest = {
                apiKeys: { type: 'string[]', secret: true },
                passwords: { type: 'string[]', secret: true }
            };

            const result = prepareSettingsForSave(newSettings, existingSettings, manifest, false);

            expect(result.apiKeys).toEqual(['new-key-1', 'new-key-2', 'new-key-3']);  // новые сохранены
            expect(result.passwords).toEqual(['old-pass-1', 'old-pass-2']);  // старые сохранены
        });

        it(t('tests:validation_e0b89d95'), () => {
            const newSettings = {
                secretObj: { key1: SECRET_MASK, key2: SECRET_MASK },
                normalValue: 'updated-value'
            };

            const existingSettings = {
                secretObj: { key1: 'secret1', key2: 'secret2' },
                normalValue: 'old-value'
            };

            const manifest = {
                secretObj: { type: 'object', secret: true },
                normalValue: { type: 'string' }
            };

            const result = prepareSettingsForSave(newSettings, existingSettings, manifest, false);

            expect(result.secretObj).toEqual({ key1: 'secret1', key2: 'secret2' });  // старые сохранены
            expect(result.normalValue).toBe('updated-value');  // новое сохранено
        });

        it(t('tests:success_9b1d86e2'), () => {
            const newSettings = {
                apiKey: SECRET_MASK,  // не изменилось
                username: 'new_user',  // изменилось
                // serverUrl отсутствует in новых настройках
            };

            const existingSettings = {
                apiKey: 'secret-key',
                username: 'old_user',
                serverUrl: 'https://api.example.com'
            };

            const manifest = {
                apiKey: { type: 'string', secret: true },
                username: { type: 'string' },
                serverUrl: { type: 'string' }
            };

            const result = prepareSettingsForSave(newSettings, existingSettings, manifest, false);

            expect(result.apiKey).toBe('secret-key');  // старое сохранено
            expect(result.username).toBe('new_user');  // новое сохранено
            expect(result.serverUrl).toBeUndefined();  // отсутствует в новых настройках
        });
    });

    describe(t('tests:msg_4e964986'), () => {
        it(t('tests:validation_b7f10d95'), () => {
            // Начальное state in БД
            const dbSettings = {
                apiKey: 'secret-api-key',
                username: 'john_doe',
                serverUrl: 'https://api.example.com'
            };

            const manifest = {
                apiKey: { type: 'string', secret: true },
                username: { type: 'string' },
                serverUrl: { type: 'string' }
            };

            // 1. Читаем settings (GET)
            const settingsForFrontend = filterSecretSettings(dbSettings, manifest, false);
            expect(settingsForFrontend.apiKey).toBe(SECRET_MASK);
            expect(settingsForFrontend.username).toBe('john_doe');

            // 2. User изменяет only username on фронтенде
            const updatedFromFrontend = {
                apiKey: SECRET_MASK,  // не изменилось
                username: 'jane_doe', // изменилось
                serverUrl: 'https://api.example.com'
            };

            // 3. Сохраняем settings (PUT)
            const settingsToSaveInDb = prepareSettingsForSave(
                updatedFromFrontend,
                dbSettings,
                manifest,
                false
            );

            // 4. Проверяем что apiKey not перезаписан маской
            expect(settingsToSaveInDb.apiKey).toBe('secret-api-key');  // оригинал сохранен
            expect(settingsToSaveInDb.username).toBe('jane_doe');       // новое значение
            expect(settingsToSaveInDb.serverUrl).toBe('https://api.example.com');
        });

        it(t('tests:validation_e87eefd5'), () => {
            const dbSettings = {
                apiKey: 'old-secret-key'
            };

            const manifest = {
                apiKey: { type: 'string', secret: true }
            };

            // 1. Читаем (маскируется)
            const forFrontend = filterSecretSettings(dbSettings, manifest, false);
            expect(forFrontend.apiKey).toBe(SECRET_MASK);

            // 2. User вводит new key
            const newSettings = {
                apiKey: 'new-secret-key'
            };

            // 3. Сохраняем
            const toSave = prepareSettingsForSave(newSettings, dbSettings, manifest, false);
            expect(toSave.apiKey).toBe('new-secret-key');  // новое значение сохранено
        });
    });
});


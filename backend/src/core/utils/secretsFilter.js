const { t } = require('../../i18n');
/**
 * Utility for работы со скрытыми (секретными) значениями настроек плагинов
 * Позволяет маскировать чувствительные data when отправке on фронтенд
 */

const SECRET_MASK = '********';

/**
 * Creates глубокую копию object
 * @param {any} obj - object for клонирования
 * @returns {any} - глубокая копия object
 */
function deepClone(obj) {
    // Используем structuredClone if доступен (Node.js 17+)
    if (typeof structuredClone !== 'undefined') {
        try {
            return structuredClone(obj);
        } catch (e) {
            // Fallback for случаев when structuredClone not can обработать object
        }
    }
    
    // Fallback on JSON parse/stringify
    // Ограничения: not saves functions, undefined, Symbol, circular references
    try {
        return JSON.parse(JSON.stringify(obj));
    } catch (e) {
        console.error(t('core:error_45af7575'), e);
        return obj;
    }
}

/**
 * Определяет, использует ли plugin группированные settings
 * Группированные settings имеют структуру: { "CategoryName": { label: "...", setting1: {...}, ... } }
 * @param {Object} manifestSettings - settings from манифеста plugin
 * @returns {boolean}
 */
function isGroupedSettings(manifestSettings) {
    if (!manifestSettings || typeof manifestSettings !== 'object') {
        return false;
    }
    
    const firstKey = Object.keys(manifestSettings)[0];
    if (!firstKey) {
        return false;
    }
    
    const firstValue = manifestSettings[firstKey];
    
    // Проверяем, что первое value - object with label and without type
    // (settings имеют type, groups имеют label)
    return (
        firstValue &&
        typeof firstValue === 'object' &&
        !Array.isArray(firstValue) &&
        'label' in firstValue &&
        !('type' in firstValue)
    );
}

/**
 * Определяет, является ли setting секретной
 * @param {Object} settingConfig - configuration settings from manifest
 * @returns {boolean}
 */
function isSecretSetting(settingConfig) {
    if (!settingConfig) {
        return false;
    }
    return settingConfig.secret === true;
}

/**
 * Маскирует секретное value
 * @param {any} value - value for маскировки
 * @param {Object} settingConfig - configuration settings
 * @returns {any} - замаскированное value
 */
function maskSecretValue(value, settingConfig) {
    if (!isSecretSetting(settingConfig)) {
        return value;
    }

    // If value пустое/null/undefined, возвращаем как есть
    if (value === null || value === undefined || value === '') {
        return value;
    }

    // For массивов маскируем each element
    if (Array.isArray(value)) {
        return value.map(() => SECRET_MASK);
    }

    // For объектов маскируем каждое value
    if (typeof value === 'object') {
        const masked = {};
        for (const key in value) {
            masked[key] = SECRET_MASK;
        }
        return masked;
    }

    // For остальных типов просто возвращаем маску
    return SECRET_MASK;
}

/**
 * Фильтрует settings plugin, маскируя секретные values
 * @param {Object} settings - текущие settings plugin
 * @param {Object} manifestSettings - description настроек from manifest
 * @param {boolean} isGrouped - использует ли plugin группированные settings
 * @returns {Object} - отфильтрованные settings
 */
function filterSecretSettings(settings, manifestSettings, isGrouped = false) {
    if (!settings || !manifestSettings) {
        return settings;
    }

    const filteredSettings = { ...settings };

    if (isGrouped) {
        // Processing группированных настроек
        for (const categoryKey in manifestSettings) {
            const categoryConfig = manifestSettings[categoryKey];
            if (typeof categoryConfig !== 'object' || !categoryConfig.label) {
                continue;
            }

            for (const settingKey in categoryConfig) {
                if (settingKey === 'label') continue;
                
                const settingConfig = categoryConfig[settingKey];
                if (isSecretSetting(settingConfig) && settingKey in filteredSettings) {
                    filteredSettings[settingKey] = maskSecretValue(
                        filteredSettings[settingKey],
                        settingConfig
                    );
                }
            }
        }
    } else {
        // Processing обычных настроек
        for (const settingKey in manifestSettings) {
            const settingConfig = manifestSettings[settingKey];
            if (isSecretSetting(settingConfig) && settingKey in filteredSettings) {
                filteredSettings[settingKey] = maskSecretValue(
                    filteredSettings[settingKey],
                    settingConfig
                );
            }
        }
    }

    return filteredSettings;
}

/**
 * Checks, является ли value замаскированным
 * @param {any} value - value for verification
 * @returns {boolean}
 */
function isMaskedValue(value) {
    if (value === SECRET_MASK) {
        return true;
    }

    if (Array.isArray(value)) {
        // Empty array not является замаскированным
        if (value.length === 0) {
            return false;
        }
        return value.every(item => item === SECRET_MASK);
    }

    if (typeof value === 'object' && value !== null) {
        const values = Object.values(value);
        // Empty object not является замаскированным
        if (values.length === 0) {
            return false;
        }
        return values.every(v => v === SECRET_MASK);
    }

    return false;
}

/**
 * Фильтрует обновления настроек, удаляя замаскированные values
 * Это предотвращает сохранение маски вместо реального values
 * @param {Object} newSettings - новые settings for сохранения
 * @param {Object} existingSettings - существующие settings
 * @param {Object} manifestSettings - description настроек from manifest
 * @param {boolean} isGrouped - использует ли plugin группированные settings
 * @returns {Object} - отфильтрованные settings for сохранения
 */
function prepareSettingsForSave(newSettings, existingSettings, manifestSettings, isGrouped = false) {
    if (!newSettings || !manifestSettings) {
        return newSettings;
    }

    // Используем глубокое клонирование for избежания мутаций and side effects
    const settingsToSave = deepClone(newSettings);

    if (isGrouped) {
        for (const categoryKey in manifestSettings) {
            const categoryConfig = manifestSettings[categoryKey];
            if (typeof categoryConfig !== 'object' || !categoryConfig.label) {
                continue;
            }

            for (const settingKey in categoryConfig) {
                if (settingKey === 'label') continue;
                
                const settingConfig = categoryConfig[settingKey];
                
                // If setting секретная and новое value является маской,
                // используем существующее value
                if (isSecretSetting(settingConfig) && 
                    settingKey in settingsToSave && 
                    isMaskedValue(settingsToSave[settingKey])) {
                    
                    if (existingSettings && settingKey in existingSettings) {
                        settingsToSave[settingKey] = existingSettings[settingKey];
                    } else {
                        // If существующего values no, удаляем key
                        delete settingsToSave[settingKey];
                    }
                }
            }
        }
    } else {
        for (const settingKey in manifestSettings) {
            const settingConfig = manifestSettings[settingKey];
            
            if (isSecretSetting(settingConfig) && 
                settingKey in settingsToSave && 
                isMaskedValue(settingsToSave[settingKey])) {
                
                if (existingSettings && settingKey in existingSettings) {
                    settingsToSave[settingKey] = existingSettings[settingKey];
                } else {
                    delete settingsToSave[settingKey];
                }
            }
        }
    }

    return settingsToSave;
}

module.exports = {
    SECRET_MASK,
    isSecretSetting,
    maskSecretValue,
    filterSecretSettings,
    isMaskedValue,
    prepareSettingsForSave,
    isGroupedSettings,
    deepClone
};


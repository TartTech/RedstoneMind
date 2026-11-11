/**
 * Проверяет, должно ли поле быть показано, основываясь на зависимостях dependsOn
 * @param {string} key - Key настройки
 * @param {Object} config - Конфигурация поля из manifest
 * @param {Object} allSettings - All текущие значения настроек
 * @returns {boolean} - true, if поле должно быть показано
 */
function parseSettingDefault(rawDefault) {
  if (rawDefault === undefined) return undefined;
  if (typeof rawDefault !== 'string') return rawDefault;
  try {
    return JSON.parse(rawDefault);
  } catch {
    return rawDefault;
  }
}

function defaultForSetting(config) {
  if (!config || typeof config !== 'object' || !config.type) return undefined;
  const parsed = parseSettingDefault(config.default);
  if (parsed !== undefined) return parsed;
  if (config.type === 'boolean') return false;
  if (config.type === 'string' || config.type === 'password') return '';
  if (config.type === 'number') return 0;
  if (config.type === 'string[]') return [];
  if (config.type === 'json_file') return {};
  return undefined;
}

export function collectManifestDefaults(manifestSettings) {
  const defaults = {};
  if (!manifestSettings || typeof manifestSettings !== 'object') return defaults;
  const entries = Object.entries(manifestSettings);
  const grouped = entries.some(([, value]) => value && typeof value === 'object' && value.label && !value.type);
  const visit = (configMap) => {
    Object.entries(configMap).forEach(([key, config]) => {
      if (key === 'label') return;
      const value = defaultForSetting(config);
      if (value !== undefined) defaults[key] = value;
    });
  };
  if (grouped) {
    entries.forEach(([, category]) => {
      if (category && typeof category === 'object') visit(category);
    });
    return defaults;
  }
  visit(manifestSettings);
  return defaults;
}

export function shouldShowField(key, config, allSettings) {
  // Старая логика for обратной совместимости с actionsPreset
  if (allSettings?.actionsPreset !== undefined && key.startsWith('enable')) {
    return allSettings.actionsPreset === 'custom';
  }

  // Если no dependsOn, показываем поле
  if (!config?.dependsOn) return true;

  // Преобразуем dependsOn в массив условий for единообразной обраbotки
  const conditions = Array.isArray(config.dependsOn)
    ? config.dependsOn
    : [config.dependsOn];

  // All условия должны быть выполнены (AND логика)
  return conditions.every(condition => {
    const fieldValue = allSettings?.[condition.field];
    const targetValue = condition.value;
    const operator = condition.operator || 'eq';

    let result;

    // Если targetValue - массив, проверяем, входит ли текущее значение в него
    // Note: при использовании массива значений параметр operator игнорируется
    if (Array.isArray(targetValue)) {
      result = targetValue.includes(fieldValue);
    } else {
      // Check по оператору
      switch (operator) {
        case 'eq':  // равно (по умолчанию)
          result = fieldValue === targetValue;
          break;
        case 'ne':  // не равно
          result = fieldValue !== targetValue;
          break;
        case 'gt':  // больше
          result = fieldValue > targetValue;
          break;
        case 'gte': // больше или равно
          result = fieldValue >= targetValue;
          break;
        case 'lt':  // меньше
          result = fieldValue < targetValue;
          break;
        case 'lte': // меньше или равно
          result = fieldValue <= targetValue;
          break;
        default:
          result = fieldValue === targetValue;
      }
    }

    // Инвертируем результат, if указан флаг invert (NOT логика)
    return condition.invert ? !result : result;
  });
}

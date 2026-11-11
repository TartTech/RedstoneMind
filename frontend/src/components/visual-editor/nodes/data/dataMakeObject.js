import { NodeDefinition } from '../../core/registry';
import DataMakeObjectSettings from './DataMakeObjectSettings';

/**
 * Определение ноды data:make_object
 * Creation объекта из пар ключ-значение (упрощенная версия)
 */
export const dataMakeObjectDefinition = new NodeDefinition({
  type: 'data:make_object',
  category: 'data',
  label: t('labels.createObekt'),
  description: t('descriptions.sozdaetObektIzParKlyuchznachenie'),



  SettingsComponent: DataMakeObjectSettings,

  defaultData: {
    pinCount: 0,
  },

  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataMakeObjectDefinition;

import { NodeDefinition } from '../../core/registry';
import DataMakeObjectSettings from './DataMakeObjectSettings';
import i18n from '@/i18n';

/**
 * Определение ноды data:make_object
 * Creation объекта из пар ключ-значение (упрощенная версия)
 */
export const dataMakeObjectDefinition = new NodeDefinition({
  type: 'data:make_object',
  category: 'data',
  label: i18n.t('labels.createObekt'),
  description: i18n.t('descriptions.sozdaetObektIzParKlyuchznachenie'),



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

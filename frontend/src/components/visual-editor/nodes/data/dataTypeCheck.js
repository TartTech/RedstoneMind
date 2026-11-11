import { NodeDefinition } from '../../core/registry';
import DataTypeCheckSettings from './DataTypeCheckSettings';
import i18n from '@/i18n';

/**
 * Определение ноды data:type_check
 * Проверяет тип значения
 */
export const dataTypeCheckDefinition = new NodeDefinition({
  type: 'data:type_check',
  category: 'data',
  label: i18n.t('labels.proveritTip'),
  description: i18n.t('descriptions.proveryaetSootvetstvieZnacheniyaTipu'),



  SettingsComponent: DataTypeCheckSettings,

  defaultData: {
    checkType: 'string',
  },

  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataTypeCheckDefinition;

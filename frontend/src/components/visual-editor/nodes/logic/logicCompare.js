import { NodeDefinition } from '../../core/registry';
import LogicCompareSettings from './LogicCompareSettings';
import i18n from '@/i18n';

/**
 * Определение ноды logic:compare
 * Сравнение значений
 */
export const logicCompareDefinition = new NodeDefinition({
  type: 'logic:compare',
  category: 'logic',
  label: i18n.t('labels.sravnenie'),
  description: i18n.t('descriptions.sravnenieDvukhZnacheniy'),



  SettingsComponent: LogicCompareSettings,

  defaultData: {
    operation: '==',
    a: '',
    b: '',
  },

  theme: {
    headerColor: '#dc2626',
    accentColor: '#ef4444',
  },
});

export default logicCompareDefinition;

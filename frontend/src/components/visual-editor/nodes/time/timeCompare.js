import { NodeDefinition } from '../../core/registry';
import TimeCompareSettings from './TimeCompareSettings';
import i18n from '@/i18n';

/**
 * Определение ноды time:compare
 * Сравнивает две даты
 */
export const timeCompareDefinition = new NodeDefinition({
  type: 'time:compare',
  category: 'time',
  label: i18n.t('labels.sravnitDaty'),
  description: i18n.t('descriptions.sravnivaetDveDaty'),



  SettingsComponent: TimeCompareSettings,

  defaultData: {
    operation: 'before',
  },

  theme: {
    headerColor: '#ec4899',
    accentColor: '#f472b6',
  },
});

export default timeCompareDefinition;

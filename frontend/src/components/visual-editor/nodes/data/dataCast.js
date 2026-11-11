import { NodeDefinition } from '../../core/registry';
import DataCastSettings from './DataCastSettings';
import i18n from '@/i18n';

/**
 * Определение ноды data:cast
 * Преобразует значение из одного типа в другой
 */
export const dataCastDefinition = new NodeDefinition({
  type: 'data:cast',
  category: 'data',
  label: i18n.t('labels.preobrazovatTip'),
  description: i18n.t('descriptions.preobrazuetZnachenieVVybrannyyTip'),



  SettingsComponent: DataCastSettings,

  defaultData: {
    targetType: 'String',
  },

  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataCastDefinition;

import { NodeDefinition } from '../../core/registry';
import LogicOperationSettings from './LogicOperationSettings';
import i18n from '@/i18n';

/**
 * Определение ноды logic:operation
 * Логические операции (AND, OR, NOT)
 */
export const logicOperationDefinition = new NodeDefinition({
  type: 'logic:operation',
  category: 'logic',
  label: i18n.t('labels.logicheskayaOperatsiya'),
  description: i18n.t('descriptions.logicheskieOperatsii'),



  SettingsComponent: LogicOperationSettings,

  defaultData: {
    operation: 'AND',
    pinCount: 2,
  },

  theme: {
    headerColor: '#dc2626',
    accentColor: '#ef4444',
  },
});

export default logicOperationDefinition;

import { NodeDefinition } from '../../core/registry';
import LogicOperationSettings from './LogicOperationSettings';

/**
 * Определение ноды logic:operation
 * Логические операции (AND, OR, NOT)
 */
export const logicOperationDefinition = new NodeDefinition({
  type: 'logic:operation',
  category: 'logic',
  label: t('labels.logicheskayaOperatsiya'),
  description: t('descriptions.logicheskieOperatsii'),



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

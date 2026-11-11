import { NodeDefinition } from '../../core/registry';
import MathOperationSettings from './MathOperationSettings';
import i18n from '@/i18n';

/**
 * Определение ноды math:operation
 * Математические и сравнительные операции
 */
export const mathOperationDefinition = new NodeDefinition({
  type: 'math:operation',
  category: 'math',
  label: i18n.t('labels.matematicheskayaOperatsiya'),
  description: i18n.t('descriptions.matematicheskieOperatsiiISravneniya'),



  SettingsComponent: MathOperationSettings,

  defaultData: {
    operation: '+',
    a: 0,
    b: 0,
  },

  theme: {
    headerColor: '#3b82f6',
    accentColor: '#60a5fa',
  },
});

export default mathOperationDefinition;

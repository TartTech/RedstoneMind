import { NodeDefinition } from '../../core/registry';
import FlowSwitchSettings from './FlowSwitchSettings';

/**
 * Определение ноды flow:switch
 * Множественное ветвление на основе значения
 */
export const flowSwitchDefinition = new NodeDefinition({
  type: 'flow:switch',
  category: 'flow',
  label: t('labels.pereklyuchatel'),
  description: t('descriptions.vybiraetVetkuVypolneniyaNaOsnoveZnacheniya'),



  SettingsComponent: FlowSwitchSettings,

  defaultData: {
    caseCount: 0,
    value: '',
  },

  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default flowSwitchDefinition;

import { NodeDefinition } from '../../core/registry';
import FlowSwitchSettings from './FlowSwitchSettings';
import i18n from '@/i18n';

/**
 * Определение ноды flow:switch
 * Множественное ветвление на основе значения
 */
export const flowSwitchDefinition = new NodeDefinition({
  type: 'flow:switch',
  category: 'flow',
  label: i18n.t('labels.pereklyuchatel'),
  description: i18n.t('descriptions.vybiraetVetkuVypolneniyaNaOsnoveZnacheniya'),



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

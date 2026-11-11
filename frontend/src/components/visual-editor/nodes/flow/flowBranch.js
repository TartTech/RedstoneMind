import { NodeDefinition } from '../../core/registry';
import FlowBranchSettings from './FlowBranchSettings';
import i18n from '@/i18n';

/**
 * Определение ноды flow:branch
 * Условное ветвление execution
 */
export const flowBranchDefinition = new NodeDefinition({
  type: 'flow:branch',
  category: 'flow',
  label: i18n.t('labels.vetvlenie'),
  description: i18n.t('descriptions.uslovnoeVetvlenieNaOsnoveBooleanZnacheniya'),



  SettingsComponent: FlowBranchSettings,

  defaultData: {
    advanced: false,
    operator: 'AND',
    pinCount: 2,
  },

  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default flowBranchDefinition;

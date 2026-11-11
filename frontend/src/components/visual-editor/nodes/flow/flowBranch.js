import { NodeDefinition } from '../../core/registry';
import FlowBranchSettings from './FlowBranchSettings';

/**
 * Определение ноды flow:branch
 * Условное ветвление execution
 */
export const flowBranchDefinition = new NodeDefinition({
  type: 'flow:branch',
  category: 'flow',
  label: t('labels.vetvlenie'),
  description: t('descriptions.uslovnoeVetvlenieNaOsnoveBooleanZnacheniya'),



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

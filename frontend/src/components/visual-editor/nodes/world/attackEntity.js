import { NodeDefinition } from '../../core/registry';

export const worldAttackDefinition = new NodeDefinition({
  type: 'world:attack',
  category: 'world',
  label: t('labels.udarit'),
  description: t('descriptions.odinUdarPoSushchnosti'),
  defaultData: {},
  theme: {
    headerColor: '#dc2626',
    accentColor: '#ef4444',
  },
});

export default worldAttackDefinition;

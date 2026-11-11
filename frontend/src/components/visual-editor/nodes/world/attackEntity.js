import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

export const worldAttackDefinition = new NodeDefinition({
  type: 'world:attack',
  category: 'world',
  label: i18n.t('labels.udarit'),
  description: i18n.t('descriptions.odinUdarPoSushchnosti'),
  defaultData: {},
  theme: {
    headerColor: '#dc2626',
    accentColor: '#ef4444',
  },
});

export default worldAttackDefinition;

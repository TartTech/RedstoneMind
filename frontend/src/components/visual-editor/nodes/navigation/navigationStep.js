import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

export const navigationStepDefinition = new NodeDefinition({
  type: 'navigation:step',
  category: 'navigation',
  label: i18n.t('labels.shag'),
  description: i18n.t('descriptions.idyotVperyodAgoVlevoIliVpravo'),
  defaultData: {
    direction: 'forward',
    distance: 1,
  },
  theme: {
    headerColor: '#3b82f6',
    accentColor: '#60a5fa',
  },
});

export default navigationStepDefinition;

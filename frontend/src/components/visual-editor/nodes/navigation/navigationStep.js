import { NodeDefinition } from '../../core/registry';

export const navigationStepDefinition = new NodeDefinition({
  type: 'navigation:step',
  category: 'navigation',
  label: t('labels.shag'),
  description: t('descriptions.idyotVperyodAgoVlevoIliVpravo'),
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

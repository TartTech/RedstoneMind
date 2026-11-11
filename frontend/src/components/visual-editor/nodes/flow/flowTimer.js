import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

export const flowTimerDefinition = new NodeDefinition({
  type: 'flow:timer',
  category: 'flow',
  label: i18n.t('labels.timer'),
  description: i18n.t('descriptions.vypolnyaetTeloTsiklaKazhdyeNSeconds'),



  defaultData: { interval: 1, max_ticks: 0 },

  theme: {
    headerColor: '#3b82f6',
    accentColor: '#60a5fa',
  },
});

export default flowTimerDefinition;

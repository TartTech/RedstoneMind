import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды flow:delay
 * Ожидает указанное количество миллиseconds
 */
export const flowDelayDefinition = new NodeDefinition({
  type: 'flow:delay',
  category: 'flow',
  label: i18n.t('labels.delay'),
  description: i18n.t('descriptions.ozhidaetUkazannoeKolichestvoMillisecondsZatemProdolzhaet'),



  defaultData: {
    delay: 1000,
  },

  theme: {
    headerColor: '#3b82f6',
    accentColor: '#60a5fa',
  },
});

export default flowDelayDefinition;

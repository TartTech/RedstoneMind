import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды flow:delay
 * Ожидает указанное количество миллиseconds
 */
export const flowDelayDefinition = new NodeDefinition({
  type: 'flow:delay',
  category: 'flow',
  label: t('labels.delay'),
  description: t('descriptions.ozhidaetUkazannoeKolichestvoMillisecondsZatemProdolzhaet'),



  defaultData: {
    delay: 1000,
  },

  theme: {
    headerColor: '#3b82f6',
    accentColor: '#60a5fa',
  },
});

export default flowDelayDefinition;

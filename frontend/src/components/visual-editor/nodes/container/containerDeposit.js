import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды container:deposit
 * Кладёт предмет в открытый контейнер
 */
export const containerDepositDefinition = new NodeDefinition({
  type: 'container:deposit',
  category: 'container',
  label: t('labels.konteynerPolozhit'),
  description: t('descriptions.kladyotPredmetIzInventaryaVOtkrytyy'),



  defaultData: {
    itemName: '',
    count: null,
  },

  theme: {
    headerColor: '#d97706',
    accentColor: '#f59e0b',
  },
});

export default containerDepositDefinition;

import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды container:deposit
 * Кладёт предмет в открытый контейнер
 */
export const containerDepositDefinition = new NodeDefinition({
  type: 'container:deposit',
  category: 'container',
  label: i18n.t('labels.konteynerPolozhit'),
  description: i18n.t('descriptions.kladyotPredmetIzInventaryaVOtkrytyy'),



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

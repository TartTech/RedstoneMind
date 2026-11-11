import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды container:deposit_all
 * Кладёт все предметы указанного типа (or вообще все) в контейнер
 */
export const containerDepositAllDefinition = new NodeDefinition({
  type: 'container:deposit_all',
  category: 'container',
  label: t('labels.konteynerPolozhitVsyo'),
  description: t('descriptions.kladyotVsePredmetyIliOpredelyonnogoTipa'),



  defaultData: {
    itemName: '',
    keepOne: false,
  },

  theme: {
    headerColor: '#d97706',
    accentColor: '#f59e0b',
  },
});

export default containerDepositAllDefinition;

import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды container:deposit_all
 * Кладёт все предметы указанного типа (or вообще все) в контейнер
 */
export const containerDepositAllDefinition = new NodeDefinition({
  type: 'container:deposit_all',
  category: 'container',
  label: i18n.t('labels.konteynerPolozhitVsyo'),
  description: i18n.t('descriptions.kladyotVsePredmetyIliOpredelyonnogoTipa'),



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

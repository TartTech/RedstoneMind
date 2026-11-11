import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды array:join
 * Объединяет элементы массива в строку с разделителем
 */
export const arrayJoinDefinition = new NodeDefinition({
  type: 'array:join',
  category: 'array',
  label: i18n.t('labels.obedinitVStroku'),
  description: i18n.t('descriptions.obedinyaetElementyMassivaVStrokuS'),



  defaultData: {
    array: '',
    separator: ', ',
  },

  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default arrayJoinDefinition;

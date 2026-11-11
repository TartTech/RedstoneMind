import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды array:join
 * Объединяет элементы массива в строку с разделителем
 */
export const arrayJoinDefinition = new NodeDefinition({
  type: 'array:join',
  category: 'array',
  label: t('labels.obedinitVStroku'),
  description: t('descriptions.obedinyaetElementyMassivaVStrokuS'),



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

import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды array:remove_by_index
 * Удаляет элемент из массива по его индексу
 */
export const arrayRemoveByIndexDefinition = new NodeDefinition({
  type: 'array:remove_by_index',
  category: 'array',
  label: t('labels.deletePoIndeksu'),
  description: t('descriptions.udalyaetElementIzMassivaPoEgo'),



  defaultData: {
    index: 0,
  },

  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default arrayRemoveByIndexDefinition;

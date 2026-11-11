import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды array:contains
 * Проверяет, contains ли массив указанный элемент и returns его индекс
 */
export const arrayContainsDefinition = new NodeDefinition({
  type: 'array:contains',
  category: 'array',
  label: t('labels.soderzhit'),
  description: t('descriptions.proveryaetSoderzhitLiMassivUkazannyyElement'),



  defaultData: {
    array: '',
    element: '',
  },

  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default arrayContainsDefinition;

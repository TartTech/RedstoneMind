import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды array:contains
 * Проверяет, contains ли массив указанный элемент и returns его индекс
 */
export const arrayContainsDefinition = new NodeDefinition({
  type: 'array:contains',
  category: 'array',
  label: i18n.t('labels.soderzhit'),
  description: i18n.t('descriptions.proveryaetSoderzhitLiMassivUkazannyyElement'),



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

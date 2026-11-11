import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды array:get_by_index
 * Получает элемент массива по его индексу
 */
export const arrayGetByIndexDefinition = new NodeDefinition({
  type: 'array:get_by_index',
  category: 'array',
  label: i18n.t('labels.poluchitPoIndeksu'),
  description: i18n.t('descriptions.poluchaetElementMassivaPoEgoIndeksu'),



  defaultData: {
    index: 0,
  },

  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default arrayGetByIndexDefinition;

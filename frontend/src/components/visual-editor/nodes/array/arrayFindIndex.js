import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды array:find_index
 * Находит индекс элемента в массиве (or -1 if не найден)
 */
export const arrayFindIndexDefinition = new NodeDefinition({
  type: 'array:find_index',
  category: 'array',
  label: i18n.t('labels.naytiIndeks'),
  description: i18n.t('descriptions.nakhoditIndeksElementaVMassive'),



  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default arrayFindIndexDefinition;

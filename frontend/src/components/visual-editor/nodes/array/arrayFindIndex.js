import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды array:find_index
 * Находит индекс элемента в массиве (or -1 if не найден)
 */
export const arrayFindIndexDefinition = new NodeDefinition({
  type: 'array:find_index',
  category: 'array',
  label: t('labels.naytiIndeks'),
  description: t('descriptions.nakhoditIndeksElementaVMassive'),



  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default arrayFindIndexDefinition;

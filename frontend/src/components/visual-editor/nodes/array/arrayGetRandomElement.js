import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды array:get_random_element
 * Возвращает случайный элемент из массива и его индекс
 */
export const arrayGetRandomElementDefinition = new NodeDefinition({
  type: 'array:get_random_element',
  category: 'array',
  label: t('labels.sluchaynyyElement'),
  description: t('descriptions.vozvrashchaetSluchaynyyElementIzMassivaI'),



  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default arrayGetRandomElementDefinition;

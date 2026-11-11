import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды array:get_random_element
 * Возвращает случайный элемент из массива и его индекс
 */
export const arrayGetRandomElementDefinition = new NodeDefinition({
  type: 'array:get_random_element',
  category: 'array',
  label: i18n.t('labels.sluchaynyyElement'),
  description: i18n.t('descriptions.vozvrashchaetSluchaynyyElementIzMassivaI'),



  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default arrayGetRandomElementDefinition;

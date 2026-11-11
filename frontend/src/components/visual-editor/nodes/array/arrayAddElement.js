import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды array:add_element
 * Добавляет элемент в конец массива
 */
export const arrayAddElementDefinition = new NodeDefinition({
  type: 'array:add_element',
  category: 'array',
  label: i18n.t('labels.addElement'),
  description: i18n.t('descriptions.dobavlyaetElementVKonetsMassiva'),



  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default arrayAddElementDefinition;

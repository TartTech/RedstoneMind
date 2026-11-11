import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды array:get_next
 * Получает следующий элемент массива
 */
export const arrayGetNextDefinition = new NodeDefinition({
  type: 'array:get_next',
  category: 'array',
  label: i18n.t('labels.sleduyushchiyElement'),
  description: i18n.t('descriptions.poluchaetSleduyushchiyElementMassiva'),



  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default arrayGetNextDefinition;

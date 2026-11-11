import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды array:get_next
 * Получает следующий элемент массива
 */
export const arrayGetNextDefinition = new NodeDefinition({
  type: 'array:get_next',
  category: 'array',
  label: t('labels.sleduyushchiyElement'),
  description: t('descriptions.poluchaetSleduyushchiyElementMassiva'),



  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default arrayGetNextDefinition;

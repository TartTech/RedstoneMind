import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды math:random_number
 * Генерирует случайное число в заданном диапазоне
 */
export const mathRandomNumberDefinition = new NodeDefinition({
  type: 'math:random_number',
  category: 'math',
  label: i18n.t('labels.sluchaynoeChislo'),
  description: i18n.t('descriptions.generiruetSluchaynoeChisloVZadannomDiapazone'),



  defaultData: {
    min: 0,
    max: 100,
  },

  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default mathRandomNumberDefinition;

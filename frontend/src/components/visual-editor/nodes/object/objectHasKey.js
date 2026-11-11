import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды object:has_key
 * Проверяет наличие ключа в объекте и returns значение
 */
export const objectHasKeyDefinition = new NodeDefinition({
  type: 'object:has_key',
  category: 'object',
  label: i18n.t('labels.estKlyuch'),
  description: i18n.t('descriptions.proveryaetNalichieKlyuchaVObekte'),



  defaultData: {
    key: '',
  },

  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default objectHasKeyDefinition;

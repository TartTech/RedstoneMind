import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды object:has_key
 * Проверяет наличие ключа в объекте и returns значение
 */
export const objectHasKeyDefinition = new NodeDefinition({
  type: 'object:has_key',
  category: 'object',
  label: t('labels.estKlyuch'),
  description: t('descriptions.proveryaetNalichieKlyuchaVObekte'),



  defaultData: {
    key: '',
  },

  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default objectHasKeyDefinition;

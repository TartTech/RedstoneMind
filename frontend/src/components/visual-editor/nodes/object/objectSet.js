import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды object:set
 * Добавляет or изменяет значение по ключу в объекте
 */
export const objectSetDefinition = new NodeDefinition({
  type: 'object:set',
  category: 'object',
  label: t('labels.installZnachenie'),
  description: t('descriptions.dobavlyaetIliIzmenyaetZnacheniePoKlyuchu'),



  defaultData: {
    key: '',
    value: '',
  },

  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default objectSetDefinition;

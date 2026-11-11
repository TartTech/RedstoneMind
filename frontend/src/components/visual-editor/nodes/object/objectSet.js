import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды object:set
 * Добавляет or изменяет значение по ключу в объекте
 */
export const objectSetDefinition = new NodeDefinition({
  type: 'object:set',
  category: 'object',
  label: i18n.t('labels.installZnachenie'),
  description: i18n.t('descriptions.dobavlyaetIliIzmenyaetZnacheniePoKlyuchu'),



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

import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды object:delete
 * Удаляет ключ из объекта
 */
export const objectDeleteDefinition = new NodeDefinition({
  type: 'object:delete',
  category: 'object',
  label: t('labels.deleteKlyuch'),
  description: t('descriptions.udalyaetKlyuchIzObekta'),



  defaultData: {
    key: '',
  },

  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default objectDeleteDefinition;

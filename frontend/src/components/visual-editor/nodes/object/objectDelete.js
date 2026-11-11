import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды object:delete
 * Удаляет ключ из объекта
 */
export const objectDeleteDefinition = new NodeDefinition({
  type: 'object:delete',
  category: 'object',
  label: i18n.t('labels.deleteKlyuch'),
  description: i18n.t('descriptions.udalyaetKlyuchIzObekta'),



  defaultData: {
    key: '',
  },

  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default objectDeleteDefinition;

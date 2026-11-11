import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды action:delete_command
 * Удаляет существующую команду
 */
export const actionDeleteCommandDefinition = new NodeDefinition({
  type: 'action:delete_command',
  category: 'action',
  label: i18n.t('labels.deleteKomandu'),
  description: i18n.t('descriptions.udalyaetSushchestvuyushchuyuKomanduBota'),



  defaultData: {
    commandName: '',
  },

  theme: {
    headerColor: '#ef4444',
    accentColor: '#f87171',
  },
});

export default actionDeleteCommandDefinition;

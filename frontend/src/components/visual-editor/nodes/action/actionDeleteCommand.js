import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды action:delete_command
 * Удаляет существующую команду
 */
export const actionDeleteCommandDefinition = new NodeDefinition({
  type: 'action:delete_command',
  category: 'action',
  label: t('labels.deleteKomandu'),
  description: t('descriptions.udalyaetSushchestvuyushchuyuKomanduBota'),



  defaultData: {
    commandName: '',
  },

  theme: {
    headerColor: '#ef4444',
    accentColor: '#f87171',
  },
});

export default actionDeleteCommandDefinition;

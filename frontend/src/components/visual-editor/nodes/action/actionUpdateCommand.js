import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды action:update_command
 * Редактирует существующую команду
 */
export const actionUpdateCommandDefinition = new NodeDefinition({
  type: 'action:update_command',
  category: 'action',
  label: i18n.t('labels.editKomandu'),
  description: i18n.t('descriptions.izmenyaetParametrySushchestvuyushcheyKomandy'),



  defaultData: {
    commandName: '',
    newName: '',
    description: '',
    aliases: '[]',
    cooldown: 0,
    allowedChatTypes: '["chat", "private", "local", "global"]',
    permissionName: '',
  },

  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default actionUpdateCommandDefinition;

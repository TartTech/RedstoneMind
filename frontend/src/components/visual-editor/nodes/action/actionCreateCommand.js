import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды action:create_command
 * Создает новую команду (временную or постоянную)
 */
export const actionCreateCommandDefinition = new NodeDefinition({
  type: 'action:create_command',
  category: 'action',
  label: i18n.t('labels.createKomandu'),
  description: i18n.t('descriptions.sozdaetNovuyuKomanduDlyaBotaVremennuyu'),



  defaultData: {
    name: '',
    description: '',
    aliases: '[]',
    cooldown: 0,
    allowedChatTypes: '["chat", "private"]',
    permissionName: '',
    temporary: false,
  },

  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default actionCreateCommandDefinition;

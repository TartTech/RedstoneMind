import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды event:chat
 * Срабатывает при получении сообщения в чате
 */
export const eventChatDefinition = new NodeDefinition({
  type: 'event:chat',
  category: 'event',
  label: i18n.t('labels.soobshchenieVChate'),
  description: i18n.t('descriptions.srabatyvaetKogdaVChatPrikhoditSoobshchenie'),



  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventChatDefinition;

import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды event:chat
 * Срабатывает при получении сообщения в чате
 */
export const eventChatDefinition = new NodeDefinition({
  type: 'event:chat',
  category: 'event',
  label: t('labels.soobshchenieVChate'),
  description: t('descriptions.srabatyvaetKogdaVChatPrikhoditSoobshchenie'),



  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventChatDefinition;

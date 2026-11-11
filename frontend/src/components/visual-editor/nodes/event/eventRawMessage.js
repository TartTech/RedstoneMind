import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды event:raw_message
 * Срабатывает при получении любого сырого сообщения
 */
export const eventRawMessageDefinition = new NodeDefinition({
  type: 'event:raw_message',
  category: 'event',
  label: t('labels.syroeSoobshchenie'),
  description: t('descriptions.srabatyvaetPriPolucheniiLyubogoSoobshcheniyaV'),



  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventRawMessageDefinition;

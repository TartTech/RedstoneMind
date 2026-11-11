import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды event:raw_message
 * Срабатывает при получении любого сырого сообщения
 */
export const eventRawMessageDefinition = new NodeDefinition({
  type: 'event:raw_message',
  category: 'event',
  label: i18n.t('labels.syroeSoobshchenie'),
  description: i18n.t('descriptions.srabatyvaetPriPolucheniiLyubogoSoobshcheniyaV'),



  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventRawMessageDefinition;

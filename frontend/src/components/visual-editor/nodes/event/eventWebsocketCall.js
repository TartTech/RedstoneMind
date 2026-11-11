import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды event:websocket_call
 * Срабатывает при вызове графа через WebSocket API
 */
export const eventWebsocketCallDefinition = new NodeDefinition({
  type: 'event:websocket_call',
  category: 'event',
  label: i18n.t('labels.vyzovIzWebsocketApi'),
  description: i18n.t('descriptions.srabatyvaetKogdaGrafVyzyvaetsyaCherezWebsocket'),



  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventWebsocketCallDefinition;

import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды event:websocket_call
 * Срабатывает при вызове графа через WebSocket API
 */
export const eventWebsocketCallDefinition = new NodeDefinition({
  type: 'event:websocket_call',
  category: 'event',
  label: t('labels.vyzovIzWebsocketApi'),
  description: t('descriptions.srabatyvaetKogdaGrafVyzyvaetsyaCherezWebsocket'),



  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventWebsocketCallDefinition;

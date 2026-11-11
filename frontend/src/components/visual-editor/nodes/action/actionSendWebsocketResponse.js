import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды action:send_websocket_response
 * Отправляет data обратно клиенту через WebSocket API
 */
export const actionSendWebsocketResponseDefinition = new NodeDefinition({
  type: 'action:send_websocket_response',
  category: 'action',
  label: i18n.t('labels.websocketOtvet'),
  description: i18n.t('descriptions.otpravlyaetOtvetKlientuCherezWebsocketApi'),



  theme: {
    headerColor: '#0ea5e9',
    accentColor: '#38bdf8',
  },
});

export default actionSendWebsocketResponseDefinition;

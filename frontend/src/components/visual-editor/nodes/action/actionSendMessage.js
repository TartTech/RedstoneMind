import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды action:send_message
 * Sending сообщения с инлайн-полями for ввода
 */
export const actionSendMessageDefinition = new NodeDefinition({
  type: 'action:send_message',
  category: 'action',
  label: i18n.t('labels.sendSoobshchenie'),
  description: i18n.t('descriptions.otpravlyaetSoobshchenieVChatPodderzhivaetPeremennye'),



  defaultData: {
    chat_type: '',
    message: '',
    recipient: '',
  },

  theme: {
    headerColor: '#0ea5e9',
    accentColor: '#38bdf8',
  },
});

export default actionSendMessageDefinition;

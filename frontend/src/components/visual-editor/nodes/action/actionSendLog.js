import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды action:send_log
 * Отправляет сообщение в консоль на странице botа
 */
export const actionSendLogDefinition = new NodeDefinition({
  type: 'action:send_log',
  category: 'action',
  label: i18n.t('labels.sendLog'),
  description: i18n.t('descriptions.zapisyvaetSoobshchenieVVebkonsol'),



  defaultData: {
    message: '',
  },

  theme: {
    headerColor: '#0ea5e9',
    accentColor: '#38bdf8',
  },
});

export default actionSendLogDefinition;

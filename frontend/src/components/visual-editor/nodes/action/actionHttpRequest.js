import { NodeDefinition } from '../../core/registry';
import ActionHttpRequestSettings from './ActionHttpRequestSettings';
import i18n from '@/i18n';

/**
 * Определение ноды action:http_request
 * HTTP запрос с различными методами
 */
export const actionHttpRequestDefinition = new NodeDefinition({
  type: 'action:http_request',
  category: 'action',
  label: i18n.t('labels.httpZapros'),
  description: i18n.t('descriptions.vypolnyaetHttpZaprosPodderzhivaetPeremennyeVarname'),



  SettingsComponent: ActionHttpRequestSettings,

  defaultData: {
    method: 'GET',
    url: '',
    body: '',
  },

  theme: {
    headerColor: '#0ea5e9',
    accentColor: '#38bdf8',
  },
});

export default actionHttpRequestDefinition;

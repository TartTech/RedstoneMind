import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

export const dataStoreReadDefinition = new NodeDefinition({
  type: 'data:store_read',
  category: 'data',
  label: i18n.t('labels.prochitatIzStore'),
  description: i18n.t('descriptions.chitaetZnachenieIzKhranilishchaPluginaPo'),



  defaultData: { plugin_name: '', key: '' },

  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataStoreReadDefinition;

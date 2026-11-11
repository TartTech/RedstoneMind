import { NodeDefinition } from '../../core/registry';

export const dataStoreReadDefinition = new NodeDefinition({
  type: 'data:store_read',
  category: 'data',
  label: t('labels.prochitatIzStore'),
  description: t('descriptions.chitaetZnachenieIzKhranilishchaPluginaPo'),



  defaultData: { plugin_name: '', key: '' },

  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataStoreReadDefinition;

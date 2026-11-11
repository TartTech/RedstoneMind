import { NodeDefinition } from '../../core/registry';

export const dataStoreWriteDefinition = new NodeDefinition({
  type: 'data:store_write',
  category: 'data',
  label: t('labels.zapisatVStore'),
  description: t('descriptions.sokhranyaetZnachenieVKhranilishchePluginaPo'),



  defaultData: { plugin_name: '', key: '' },

  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataStoreWriteDefinition;

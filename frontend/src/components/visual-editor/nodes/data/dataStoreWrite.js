import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

export const dataStoreWriteDefinition = new NodeDefinition({
  type: 'data:store_write',
  category: 'data',
  label: i18n.t('labels.zapisatVStore'),
  description: i18n.t('descriptions.sokhranyaetZnachenieVKhranilishchePluginaPo'),



  defaultData: { plugin_name: '', key: '' },

  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataStoreWriteDefinition;

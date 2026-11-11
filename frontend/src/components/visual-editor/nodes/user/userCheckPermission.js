import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

export const userCheckPermissionDefinition = new NodeDefinition({
  type: 'user:check_permission',
  category: 'user',
  label: i18n.t('labels.proveritPravo'),
  description: i18n.t('descriptions.proveryaetEstLiUPolzovatelyaUkazannoe'),



  defaultData: { permission: '' },

  theme: {
    headerColor: '#14b8a6',
    accentColor: '#2dd4bf',
  },
});

export default userCheckPermissionDefinition;

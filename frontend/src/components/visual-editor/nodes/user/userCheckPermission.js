import { NodeDefinition } from '../../core/registry';

export const userCheckPermissionDefinition = new NodeDefinition({
  type: 'user:check_permission',
  category: 'user',
  label: t('labels.proveritPravo'),
  description: t('descriptions.proveryaetEstLiUPolzovatelyaUkazannoe'),



  defaultData: { permission: '' },

  theme: {
    headerColor: '#14b8a6',
    accentColor: '#2dd4bf',
  },
});

export default userCheckPermissionDefinition;

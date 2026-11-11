import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

export const userAddToGroupDefinition = new NodeDefinition({
  type: 'user:add_to_group',
  category: 'user',
  label: i18n.t('labels.addVGruppu'),
  description: i18n.t('descriptions.dobavlyaetPolzovatelyaVUkazannuyuGruppu'),



  defaultData: { group: '' },

  theme: {
    headerColor: '#14b8a6',
    accentColor: '#2dd4bf',
  },
});

export default userAddToGroupDefinition;

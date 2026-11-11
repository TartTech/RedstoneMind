import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

export const userRemoveFromGroupDefinition = new NodeDefinition({
  type: 'user:remove_from_group',
  category: 'user',
  label: i18n.t('labels.ubratIzGruppy'),
  description: i18n.t('descriptions.ubiraetPolzovatelyaIzUkazannoyGruppy'),



  defaultData: { group: '' },

  theme: {
    headerColor: '#14b8a6',
    accentColor: '#2dd4bf',
  },
});

export default userRemoveFromGroupDefinition;

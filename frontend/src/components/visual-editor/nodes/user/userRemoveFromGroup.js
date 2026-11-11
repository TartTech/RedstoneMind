import { NodeDefinition } from '../../core/registry';

export const userRemoveFromGroupDefinition = new NodeDefinition({
  type: 'user:remove_from_group',
  category: 'user',
  label: t('labels.ubratIzGruppy'),
  description: t('descriptions.ubiraetPolzovatelyaIzUkazannoyGruppy'),



  defaultData: { group: '' },

  theme: {
    headerColor: '#14b8a6',
    accentColor: '#2dd4bf',
  },
});

export default userRemoveFromGroupDefinition;

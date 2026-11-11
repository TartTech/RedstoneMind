import { NodeDefinition } from '../../core/registry';

export const worldPlaceDefinition = new NodeDefinition({
  type: 'world:place',
  category: 'world',
  label: t('labels.postavitBlok'),
  description: t('descriptions.stavitPredmetIzRukiNaGran'),
  defaultData: {
    x: null,
    y: null,
    z: null,
    face: 'up',
    itemName: '',
  },
  theme: {
    headerColor: '#15803d',
    accentColor: '#22c55e',
  },
});

export default worldPlaceDefinition;

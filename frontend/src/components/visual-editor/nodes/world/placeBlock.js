import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

export const worldPlaceDefinition = new NodeDefinition({
  type: 'world:place',
  category: 'world',
  label: i18n.t('labels.postavitBlok'),
  description: i18n.t('descriptions.stavitPredmetIzRukiNaGran'),
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

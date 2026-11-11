import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

export const worldFindBlockDefinition = new NodeDefinition({
  type: 'world:find_block',
  category: 'world',
  label: i18n.t('labels.naytiBlok'),
  description: i18n.t('descriptions.ishchetBlokiPoImeniVZagruzhennykh'),
  defaultData: {
    name: 'wheat',
    radius: 16,
    count: 1,
    minAge: null,
  },
  theme: {
    headerColor: '#0f766e',
    accentColor: '#14b8a6',
  },
});

export default worldFindBlockDefinition;

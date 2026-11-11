import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

export const worldDigDefinition = new NodeDefinition({
  type: 'world:dig',
  category: 'world',
  label: i18n.t('labels.slomatBlok'),
  description: i18n.t('descriptions.lomaetBlokPoObektuIliKoordinatam'),
  defaultData: {
    x: null,
    y: null,
    z: null,
  },
  theme: {
    headerColor: '#d97706',
    accentColor: '#f59e0b',
  },
});

export default worldDigDefinition;

import { NodeDefinition } from '../../core/registry';
import ContainerOpenSettings from './ContainerOpenSettings';
import i18n from '@/i18n';

/**
 * Определение ноды container:open
 * Открывает контейнер (сундук, бочку и т.д.) по координатам
 */
export const containerOpenDefinition = new NodeDefinition({
  type: 'container:open',
  category: 'container',
  label: i18n.t('labels.konteynerOtkryt'),
  description: i18n.t('descriptions.otkryvaetKonteynerSundukBochkuPoKoordinatam'),



  SettingsComponent: ContainerOpenSettings,

  defaultData: {
    x: 0,
    y: 64,
    z: 0,
  },

  theme: {
    headerColor: '#d97706',
    accentColor: '#f59e0b',
  },
});

export default containerOpenDefinition;

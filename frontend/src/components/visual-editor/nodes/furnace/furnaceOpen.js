import { NodeDefinition } from '../../core/registry';
import FurnaceOpenSettings from './FurnaceOpenSettings';
import i18n from '@/i18n';

/**
 * Определение ноды furnace:open
 * Открывает печку по координатам
 */
export const furnaceOpenDefinition = new NodeDefinition({
  type: 'furnace:open',
  category: 'furnace',
  label: i18n.t('labels.pechkaOtkryt'),
  description: i18n.t('descriptions.otkryvaetPechkuObychnuyuPlavilnuyuKoptilnyuPo'),



  SettingsComponent: FurnaceOpenSettings,

  defaultData: {
    x: 0,
    y: 64,
    z: 0,
  },

  theme: {
    headerColor: '#dc2626',
    accentColor: '#ef4444',
  },
});

export default furnaceOpenDefinition;

import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды furnace:close
 * Закрывает открытую печку
 */
export const furnaceCloseDefinition = new NodeDefinition({
  type: 'furnace:close',
  category: 'furnace',
  label: i18n.t('labels.pechkaZakryt'),
  description: i18n.t('descriptions.zakryvaetOtkrytuyuPechku'),



  defaultData: {},

  theme: {
    headerColor: '#dc2626',
    accentColor: '#ef4444',
  },
});

export default furnaceCloseDefinition;

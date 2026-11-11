import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды inventory:find_item
 * Ищет предмет в инвентаре по имени
 */
export const inventoryFindItemDefinition = new NodeDefinition({
  type: 'inventory:find_item',
  category: 'inventory',
  label: i18n.t('labels.naytiPredmet'),
  description: i18n.t('descriptions.ishchetPredmetVInventarePoImeni'),



  defaultData: {
    itemName: '',
  },

  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default inventoryFindItemDefinition;

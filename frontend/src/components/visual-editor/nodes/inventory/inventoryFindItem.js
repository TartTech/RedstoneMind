import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды inventory:find_item
 * Ищет предмет в инвентаре по имени
 */
export const inventoryFindItemDefinition = new NodeDefinition({
  type: 'inventory:find_item',
  category: 'inventory',
  label: t('labels.naytiPredmet'),
  description: t('descriptions.ishchetPredmetVInventarePoImeni'),



  defaultData: {
    itemName: '',
  },

  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default inventoryFindItemDefinition;

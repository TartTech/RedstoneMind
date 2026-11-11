import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды inventory:has_item
 * Проверяет наличие предмета в инвентаре
 */
export const inventoryHasItemDefinition = new NodeDefinition({
  type: 'inventory:has_item',
  category: 'inventory',
  label: t('labels.estPredmet'),
  description: t('descriptions.proveryaetEstLiUkazannyyPredmetV'),



  defaultData: {
    itemName: '',
    minCount: 1,
  },

  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default inventoryHasItemDefinition;

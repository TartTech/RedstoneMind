import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды inventory:has_item
 * Проверяет наличие предмета в инвентаре
 */
export const inventoryHasItemDefinition = new NodeDefinition({
  type: 'inventory:has_item',
  category: 'inventory',
  label: i18n.t('labels.estPredmet'),
  description: i18n.t('descriptions.proveryaetEstLiUkazannyyPredmetV'),



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

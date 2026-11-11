import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды inventory:get_slot
 * Получает предмет в указанном слоте инвентаря
 */
export const inventoryGetSlotDefinition = new NodeDefinition({
  type: 'inventory:get_slot',
  category: 'inventory',
  label: i18n.t('labels.poluchitSlot'),
  description: i18n.t('descriptions.poluchaetPredmetVUkazannomSloteInventarya'),



  defaultData: {
    slotNumber: 0,
  },

  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default inventoryGetSlotDefinition;

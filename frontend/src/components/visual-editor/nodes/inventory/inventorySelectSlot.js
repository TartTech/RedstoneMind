import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды inventory:select_slot
 * Выбирает слот хотбара (переключает предмет в руке)
 */
export const inventorySelectSlotDefinition = new NodeDefinition({
  type: 'inventory:select_slot',
  category: 'inventory',
  label: i18n.t('labels.vybratSlot'),
  description: i18n.t('descriptions.vybiraetSlotKhotbara08PereklyuchayaAktivnyy'),



  defaultData: {
    slot: 0,
  },

  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default inventorySelectSlotDefinition;

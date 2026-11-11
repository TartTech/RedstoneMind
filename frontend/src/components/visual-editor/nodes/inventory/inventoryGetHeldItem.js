import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды inventory:get_held_item
 * Получает предмет в руке botа
 */
export const inventoryGetHeldItemDefinition = new NodeDefinition({
  type: 'inventory:get_held_item',
  category: 'inventory',
  label: t('labels.itemVRuke'),
  description: t('descriptions.poluchaetPredmetKotoryyBotDerzhitV'),



  defaultData: {
    hand: 'main',
  },

  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default inventoryGetHeldItemDefinition;

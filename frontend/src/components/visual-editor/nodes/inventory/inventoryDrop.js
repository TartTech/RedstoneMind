import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды inventory:drop
 * Выбрасывает предмет из инвентаря
 */
export const inventoryDropDefinition = new NodeDefinition({
  type: 'inventory:drop',
  category: 'inventory',
  label: t('labels.vybrosit'),
  description: t('descriptions.vybrasyvaetPredmetIzInventaryaNaZemlyu'),



  defaultData: {
    itemName: '',
    count: null,
    dropAll: false,
  },

  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default inventoryDropDefinition;

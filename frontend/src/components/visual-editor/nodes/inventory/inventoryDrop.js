import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды inventory:drop
 * Выбрасывает предмет из инвентаря
 */
export const inventoryDropDefinition = new NodeDefinition({
  type: 'inventory:drop',
  category: 'inventory',
  label: i18n.t('labels.vybrosit'),
  description: i18n.t('descriptions.vybrasyvaetPredmetIzInventaryaNaZemlyu'),



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

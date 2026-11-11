import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды inventory:count_item
 * Подсчитывает общее количество предмета в инвентаре
 */
export const inventoryCountItemDefinition = new NodeDefinition({
  type: 'inventory:count_item',
  category: 'inventory',
  label: t('labels.podschitatPredmet'),
  description: t('descriptions.podschityvaetObshcheeKolichestvoUkazannogoPredmetaVo'),



  defaultData: {
    itemName: '',
  },

  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default inventoryCountItemDefinition;

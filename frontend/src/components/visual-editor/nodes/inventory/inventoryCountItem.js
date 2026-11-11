import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды inventory:count_item
 * Подсчитывает общее количество предмета в инвентаре
 */
export const inventoryCountItemDefinition = new NodeDefinition({
  type: 'inventory:count_item',
  category: 'inventory',
  label: i18n.t('labels.podschitatPredmet'),
  description: i18n.t('descriptions.podschityvaetObshcheeKolichestvoUkazannogoPredmetaVo'),



  defaultData: {
    itemName: '',
  },

  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default inventoryCountItemDefinition;

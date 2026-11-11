import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды inventory:equip
 * Экипирует предмет в указанный слот (рука, броня)
 */
export const inventoryEquipDefinition = new NodeDefinition({
  type: 'inventory:equip',
  category: 'inventory',
  label: i18n.t('labels.ekipirovat'),
  description: i18n.t('descriptions.ekipiruetPredmetVRukuIliSlot'),



  defaultData: {
    itemName: '',
    destination: 'hand',
  },

  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default inventoryEquipDefinition;

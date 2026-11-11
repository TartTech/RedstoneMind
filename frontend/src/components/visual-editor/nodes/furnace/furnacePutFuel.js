import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды furnace:put_fuel
 * Кладёт топливо в слот топлива печки
 */
export const furnacePutFuelDefinition = new NodeDefinition({
  type: 'furnace:put_fuel',
  category: 'furnace',
  label: i18n.t('labels.pechkaPolozhitToplivo'),
  description: i18n.t('descriptions.kladyotToplivoVSlotToplivaPechki'),



  defaultData: {
    itemName: '',
    count: null,
  },

  theme: {
    headerColor: '#dc2626',
    accentColor: '#ef4444',
  },
});

export default furnacePutFuelDefinition;

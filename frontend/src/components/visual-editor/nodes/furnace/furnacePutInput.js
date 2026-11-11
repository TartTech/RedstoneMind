import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды furnace:put_input
 * Кладёт предмет в слот плавки печки
 */
export const furnacePutInputDefinition = new NodeDefinition({
  type: 'furnace:put_input',
  category: 'furnace',
  label: i18n.t('labels.pechkaPolozhitDlyaPlavki'),
  description: i18n.t('descriptions.kladyotPredmetVSlotPlavkiPechki'),



  defaultData: {
    itemName: '',
    count: null,
  },

  theme: {
    headerColor: '#dc2626',
    accentColor: '#ef4444',
  },
});

export default furnacePutInputDefinition;

import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды furnace:take_output
 * Забирает готовый предмет из слота результата печки
 */
export const furnaceTakeOutputDefinition = new NodeDefinition({
  type: 'furnace:take_output',
  category: 'furnace',
  label: i18n.t('labels.pechkaZabratRezultat'),
  description: i18n.t('descriptions.zabiraetGotovyyPredmetIzSlotaRezultata'),



  defaultData: {},

  theme: {
    headerColor: '#dc2626',
    accentColor: '#ef4444',
  },
});

export default furnaceTakeOutputDefinition;

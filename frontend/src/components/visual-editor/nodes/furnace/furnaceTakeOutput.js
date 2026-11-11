import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды furnace:take_output
 * Забирает готовый предмет из слота результата печки
 */
export const furnaceTakeOutputDefinition = new NodeDefinition({
  type: 'furnace:take_output',
  category: 'furnace',
  label: t('labels.pechkaZabratRezultat'),
  description: t('descriptions.zabiraetGotovyyPredmetIzSlotaRezultata'),



  defaultData: {},

  theme: {
    headerColor: '#dc2626',
    accentColor: '#ef4444',
  },
});

export default furnaceTakeOutputDefinition;

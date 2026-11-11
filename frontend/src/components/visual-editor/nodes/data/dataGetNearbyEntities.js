import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды data:get_nearby_entities
 * Возвращает массив существ в радиусе от botа
 */
export const dataGetNearbyEntitiesDefinition = new NodeDefinition({
  type: 'data:get_nearby_entities',
  category: 'data',
  label: t('labels.sushchnostiRyadom'),
  description: t('descriptions.sushchestvaVRadiuseOtBota'),



  defaultData: {
    radius: 10,
  },

  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataGetNearbyEntitiesDefinition;

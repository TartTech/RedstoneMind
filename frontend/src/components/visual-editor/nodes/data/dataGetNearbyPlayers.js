import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды data:get_nearby_players
 * Возвращает массив игроков с расстоянием
 */
export const dataGetNearbyPlayersDefinition = new NodeDefinition({
  type: 'data:get_nearby_players',
  category: 'data',
  label: t('labels.playeriRyadom'),
  description: t('descriptions.playeriRyadomSBotom'),



  defaultData: {
    radius: 10,
  },

  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataGetNearbyPlayersDefinition;

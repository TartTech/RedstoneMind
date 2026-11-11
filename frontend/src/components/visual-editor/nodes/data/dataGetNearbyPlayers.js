import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды data:get_nearby_players
 * Возвращает массив игроков с расстоянием
 */
export const dataGetNearbyPlayersDefinition = new NodeDefinition({
  type: 'data:get_nearby_players',
  category: 'data',
  label: i18n.t('labels.playeriRyadom'),
  description: i18n.t('descriptions.playeriRyadomSBotom'),



  defaultData: {
    radius: 10,
  },

  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataGetNearbyPlayersDefinition;

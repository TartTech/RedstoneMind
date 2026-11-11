import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды data:get_server_players
 * Возвращает массив с именами всех игроков на сервере
 */
export const dataGetServerPlayersDefinition = new NodeDefinition({
  type: 'data:get_server_players',
  category: 'data',
  label: t('labels.playeriNaServere'),
  description: t('descriptions.spisokVsekhIgrokovNaServere'),



  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataGetServerPlayersDefinition;

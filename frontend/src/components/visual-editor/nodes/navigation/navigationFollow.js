import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды navigation:follow
 * Начинает следовать за игроком or сущностью
 */
export const navigationFollowDefinition = new NodeDefinition({
  type: 'navigation:follow',
  category: 'navigation',
  label: t('labels.sledovat'),
  description: t('descriptions.nachinaetSledovatZaIgrokomIliSushchnostyu'),



  defaultData: {
    target: '',
    range: 3,
  },

  theme: {
    headerColor: '#06b6d4',
    accentColor: '#22d3ee',
  },
});

export default navigationFollowDefinition;

import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды navigation:follow
 * Начинает следовать за игроком or сущностью
 */
export const navigationFollowDefinition = new NodeDefinition({
  type: 'navigation:follow',
  category: 'navigation',
  label: i18n.t('labels.sledovat'),
  description: i18n.t('descriptions.nachinaetSledovatZaIgrokomIliSushchnostyu'),



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

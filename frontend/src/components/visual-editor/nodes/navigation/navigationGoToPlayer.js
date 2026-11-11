import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды navigation:go_to_player
 * Перемещает botа к указанному игроку
 */
export const navigationGoToPlayerDefinition = new NodeDefinition({
  type: 'navigation:go_to_player',
  category: 'navigation',
  label: i18n.t('labels.idtiKIgroku'),
  description: i18n.t('descriptions.peremeshchaetBotaKUkazannomuIgroku'),



  defaultData: {
    playerName: '',
    range: 2,
  },

  theme: {
    headerColor: '#06b6d4',
    accentColor: '#22d3ee',
  },
});

export default navigationGoToPlayerDefinition;

import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды navigation:go_to_entity
 * Перемещает botа к указанной сущности
 */
export const navigationGoToEntityDefinition = new NodeDefinition({
  type: 'navigation:go_to_entity',
  category: 'navigation',
  label: i18n.t('labels.idtiKSushchnosti'),
  description: i18n.t('descriptions.peremeshchaetBotaKUkazannoySushchnostiMob'),



  defaultData: {
    range: 2,
  },

  theme: {
    headerColor: '#06b6d4',
    accentColor: '#22d3ee',
  },
});

export default navigationGoToEntityDefinition;

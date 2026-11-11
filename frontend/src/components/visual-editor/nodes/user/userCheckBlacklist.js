import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды user:check_blacklist
 * Проверяет, находится ли пользователь в черном списке
 */
export const userCheckBlacklistDefinition = new NodeDefinition({
  type: 'user:check_blacklist',
  category: 'user',
  label: i18n.t('labels.proveritChs'),
  description: i18n.t('descriptions.proveryaetNakhoditsyaLiPolzovatelVChernom'),



  theme: {
    headerColor: '#14b8a6',
    accentColor: '#2dd4bf',
  },
});

export default userCheckBlacklistDefinition;

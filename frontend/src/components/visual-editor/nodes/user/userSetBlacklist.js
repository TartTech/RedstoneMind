import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды user:set_blacklist
 * Добавляет or убирает пользователя из черного списка
 */
export const userSetBlacklistDefinition = new NodeDefinition({
  type: 'user:set_blacklist',
  category: 'user',
  label: i18n.t('labels.installChs'),
  description: i18n.t('descriptions.upravlyaetChernymSpiskomPolzovatelya'),



  defaultData: {
    blacklist_status: true,
  },

  theme: {
    headerColor: '#14b8a6',
    accentColor: '#2dd4bf',
  },
});

export default userSetBlacklistDefinition;

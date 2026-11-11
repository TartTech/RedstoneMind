import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды user:get_permissions
 * Возвращает массив прав пользователя
 */
export const userGetPermissionsDefinition = new NodeDefinition({
  type: 'user:get_permissions',
  category: 'user',
  label: i18n.t('labels.poluchitRazresheniya'),
  description: i18n.t('descriptions.vozvrashchaetPravaPolzovatelya'),



  theme: {
    headerColor: '#14b8a6',
    accentColor: '#2dd4bf',
  },
});

export default userGetPermissionsDefinition;

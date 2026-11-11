import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды user:get_groups
 * Возвращает массив названий групп, в которых состоит пользователь
 */
export const userGetGroupsDefinition = new NodeDefinition({
  type: 'user:get_groups',
  category: 'user',
  label: i18n.t('labels.poluchitGruppy'),
  description: i18n.t('descriptions.vozvrashchaetGruppyPolzovatelya'),



  theme: {
    headerColor: '#14b8a6',
    accentColor: '#2dd4bf',
  },
});

export default userGetGroupsDefinition;

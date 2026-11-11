import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды data:get_user_field
 * Получает различные data из объекта пользователя
 */
export const dataGetUserFieldDefinition = new NodeDefinition({
  type: 'data:get_user_field',
  category: 'data',
  label: t('labels.polePolzovatelya'),
  description: t('descriptions.yesnnyePolzovatelya'),



  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataGetUserFieldDefinition;

import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды data:get_variable
 * Получает значение переменной из проекта
 */
export const dataGetVariableDefinition = new NodeDefinition({
  type: 'data:get_variable',
  category: 'data',
  label: t('labels.poluchitPeremennuyu'),
  description: t('descriptions.poluchitZnacheniePeremennoy'),



  defaultData: {
    variableName: '',
  },

  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataGetVariableDefinition;

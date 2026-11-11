import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды data:get_variable
 * Получает значение переменной из проекта
 */
export const dataGetVariableDefinition = new NodeDefinition({
  type: 'data:get_variable',
  category: 'data',
  label: i18n.t('labels.poluchitPeremennuyu'),
  description: i18n.t('descriptions.poluchitZnacheniePeremennoy'),



  defaultData: {
    variableName: '',
  },

  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataGetVariableDefinition;

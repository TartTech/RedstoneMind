import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды action:bot_set_variable
 * Сохраняет значение в переменную графа
 */
export const actionBotSetVariableDefinition = new NodeDefinition({
  type: 'action:bot_set_variable',
  category: 'action',
  label: i18n.t('labels.installPeremennuyu'),
  description: i18n.t('descriptions.zapisyvaetZnachenieVPeremennuyu'),



  defaultData: {
    value: '',
  },

  theme: {
    headerColor: '#0ea5e9',
    accentColor: '#38bdf8',
  },
});

export default actionBotSetVariableDefinition;

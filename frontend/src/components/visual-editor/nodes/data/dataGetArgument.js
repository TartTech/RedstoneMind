import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды data:get_argument
 * Получает значение аргумента команды
 */
export const dataGetArgumentDefinition = new NodeDefinition({
  type: 'data:get_argument',
  category: 'data',
  label: i18n.t('labels.poluchitArgument'),
  description: i18n.t('descriptions.poluchitZnachenieArgumentaKomandy'),



  defaultData: {
    argumentName: '',
  },

  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataGetArgumentDefinition;

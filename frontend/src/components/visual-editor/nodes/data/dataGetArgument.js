import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды data:get_argument
 * Получает значение аргумента команды
 */
export const dataGetArgumentDefinition = new NodeDefinition({
  type: 'data:get_argument',
  category: 'data',
  label: t('labels.poluchitArgument'),
  description: t('descriptions.poluchitZnachenieArgumentaKomandy'),



  defaultData: {
    argumentName: '',
  },

  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataGetArgumentDefinition;

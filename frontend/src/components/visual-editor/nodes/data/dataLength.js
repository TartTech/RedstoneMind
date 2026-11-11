import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды data:length
 * Возвращает количество элементов в массиве or длину strings
 */
export const dataLengthDefinition = new NodeDefinition({
  type: 'data:length',
  category: 'data',
  label: t('labels.dlina'),
  description: t('descriptions.razmerMassivaIliDlinaStroki'),



  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataLengthDefinition;

import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды data:length
 * Возвращает количество элементов в массиве or длину strings
 */
export const dataLengthDefinition = new NodeDefinition({
  type: 'data:length',
  category: 'data',
  label: i18n.t('labels.dlina'),
  description: i18n.t('descriptions.razmerMassivaIliDlinaStroki'),



  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataLengthDefinition;

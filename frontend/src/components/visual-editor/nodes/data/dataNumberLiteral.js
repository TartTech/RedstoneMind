import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды data:number_literal
 * Простое числовое значение
 */
export const dataNumberLiteralDefinition = new NodeDefinition({
  type: 'data:number_literal',
  category: 'data',
  label: i18n.t('labels.number'),
  description: i18n.t('descriptions.prostoeChislovoeZnachenie'),



  defaultData: {
    value: 0,
  },

  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataNumberLiteralDefinition;

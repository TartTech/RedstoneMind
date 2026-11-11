import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды data:string_literal
 * Строковый литерал с поддержкой переменных
 */
export const stringLiteralDefinition = new NodeDefinition({
  type: 'data:string_literal',
  category: 'string',
  label: i18n.t('labels.string'),
  description: i18n.t('descriptions.stringSPodderzhkoyPeremennykhName'),



  defaultData: {
    value: '',
  },

  theme: {
    headerColor: '#db2777',
    accentColor: '#ec4899',
  },
});

export default stringLiteralDefinition;

import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды data:string_literal
 * Строковый литерал с поддержкой переменных
 */
export const stringLiteralDefinition = new NodeDefinition({
  type: 'data:string_literal',
  category: 'string',
  label: t('labels.string'),
  description: t('descriptions.stringSPodderzhkoyPeremennykhName'),



  defaultData: {
    value: '',
  },

  theme: {
    headerColor: '#db2777',
    accentColor: '#ec4899',
  },
});

export default stringLiteralDefinition;

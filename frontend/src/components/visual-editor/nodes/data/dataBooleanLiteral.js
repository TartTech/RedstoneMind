import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды data:boolean_literal
 * Value Истина/Ложь
 */
export const dataBooleanLiteralDefinition = new NodeDefinition({
  type: 'data:boolean_literal',
  category: 'data',
  label: 'Boolean',
  description: t('descriptions.bulevoZnachenieTruefalse'),



  defaultData: {
    value: false,
  },

  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataBooleanLiteralDefinition;

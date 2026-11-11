import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды string:split
 * Разделяет строку на массив по разделителю
 */
export const stringSplitDefinition = new NodeDefinition({
  type: 'string:split',
  category: 'string',
  label: t('labels.razdelit'),
  description: t('descriptions.razdelyaetStrokuNaMassivPoRazdelitelyu'),



  defaultData: {
    text: '',
    delimiter: ' ',
  },

  theme: {
    headerColor: '#db2777',
    accentColor: '#ec4899',
  },
});

export default stringSplitDefinition;

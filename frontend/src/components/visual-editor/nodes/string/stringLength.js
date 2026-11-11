import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды string:length
 * Возвращает длину strings
 */
export const stringLengthDefinition = new NodeDefinition({
  type: 'string:length',
  category: 'string',
  label: t('labels.dlina2'),
  description: t('descriptions.vozvrashchaetDlinuStroki'),



  defaultData: {
    text: '',
  },

  theme: {
    headerColor: '#db2777',
    accentColor: '#ec4899',
  },
});

export default stringLengthDefinition;

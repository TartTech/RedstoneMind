import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды string:length
 * Возвращает длину strings
 */
export const stringLengthDefinition = new NodeDefinition({
  type: 'string:length',
  category: 'string',
  label: i18n.t('labels.dlina2'),
  description: i18n.t('descriptions.vozvrashchaetDlinuStroki'),



  defaultData: {
    text: '',
  },

  theme: {
    headerColor: '#db2777',
    accentColor: '#ec4899',
  },
});

export default stringLengthDefinition;

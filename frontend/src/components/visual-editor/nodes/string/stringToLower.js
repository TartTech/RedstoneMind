import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды string:to_lower
 * Преобразует строку в нижний регистр
 */
export const stringToLowerDefinition = new NodeDefinition({
  type: 'string:to_lower',
  category: 'string',
  label: i18n.t('labels.vNizhniyRegistr'),
  description: i18n.t('descriptions.preobrazuetStrokuVNizhniyRegistrLowercase'),



  defaultData: {
    text: '',
  },

  theme: {
    headerColor: '#db2777',
    accentColor: '#ec4899',
  },
});

export default stringToLowerDefinition;

import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды string:ends_with
 * Проверяет заканчивается ли строка суффиксом
 */
export const stringEndsWithDefinition = new NodeDefinition({
  type: 'string:ends_with',
  category: 'string',
  label: i18n.t('labels.zakanchivaetsyaNa'),
  description: i18n.t('descriptions.proveryaetZakanchivaetsyaLiStrokaSuffiksom'),



  defaultData: {
    text: '',
    suffix: '',
  },

  theme: {
    headerColor: '#db2777',
    accentColor: '#ec4899',
  },
});

export default stringEndsWithDefinition;

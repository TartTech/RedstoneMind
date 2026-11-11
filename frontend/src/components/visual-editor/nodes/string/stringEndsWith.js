import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды string:ends_with
 * Проверяет заканчивается ли строка суффиксом
 */
export const stringEndsWithDefinition = new NodeDefinition({
  type: 'string:ends_with',
  category: 'string',
  label: t('labels.zakanchivaetsyaNa'),
  description: t('descriptions.proveryaetZakanchivaetsyaLiStrokaSuffiksom'),



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

import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды string:starts_with
 * Проверяет начинается ли строка с префикса
 */
export const stringStartsWithDefinition = new NodeDefinition({
  type: 'string:starts_with',
  category: 'string',
  label: t('labels.nachinaetsyaS'),
  description: t('descriptions.proveryaetNachinaetsyaLiStrokaSPrefiksa'),



  defaultData: {
    text: '',
    prefix: '',
  },

  theme: {
    headerColor: '#db2777',
    accentColor: '#ec4899',
  },
});

export default stringStartsWithDefinition;

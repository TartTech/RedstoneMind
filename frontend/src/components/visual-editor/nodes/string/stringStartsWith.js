import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды string:starts_with
 * Проверяет начинается ли строка с префикса
 */
export const stringStartsWithDefinition = new NodeDefinition({
  type: 'string:starts_with',
  category: 'string',
  label: i18n.t('labels.nachinaetsyaS'),
  description: i18n.t('descriptions.proveryaetNachinaetsyaLiStrokaSPrefiksa'),



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

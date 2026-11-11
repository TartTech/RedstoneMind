import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды string:matches
 * Проверяет совпадение strings с regex паттерном
 */
export const stringMatchesDefinition = new NodeDefinition({
  type: 'string:matches',
  category: 'string',
  label: i18n.t('labels.sovpadaet'),
  description: i18n.t('descriptions.proveryaetSovpadenieStrokiSRegexPatternom'),



  defaultData: {
    text: '',
    pattern: '',
  },

  theme: {
    headerColor: '#db2777',
    accentColor: '#ec4899',
  },
});

export default stringMatchesDefinition;

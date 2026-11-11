import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды string:matches
 * Проверяет совпадение strings с regex паттерном
 */
export const stringMatchesDefinition = new NodeDefinition({
  type: 'string:matches',
  category: 'string',
  label: t('labels.sovpadaet'),
  description: t('descriptions.proveryaetSovpadenieStrokiSRegexPatternom'),



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

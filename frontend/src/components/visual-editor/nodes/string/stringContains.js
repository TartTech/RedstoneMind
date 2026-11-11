import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды string:contains
 * Проверяет containsся ли подстрока в строке
 */
export const stringContainsDefinition = new NodeDefinition({
  type: 'string:contains',
  category: 'string',
  label: t('labels.soderzhit2'),
  description: t('descriptions.proveryaetSoderzhitsyaLiPodstrokaVStroke'),



  defaultData: {
    haystack: '',
    needle: '',
    case_sensitive: false,
  },

  theme: {
    headerColor: '#db2777',
    accentColor: '#ec4899',
  },
});

export default stringContainsDefinition;

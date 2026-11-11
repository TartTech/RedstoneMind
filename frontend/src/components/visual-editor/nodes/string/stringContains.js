import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды string:contains
 * Проверяет containsся ли подстрока в строке
 */
export const stringContainsDefinition = new NodeDefinition({
  type: 'string:contains',
  category: 'string',
  label: i18n.t('labels.soderzhit2'),
  description: i18n.t('descriptions.proveryaetSoderzhitsyaLiPodstrokaVStroke'),



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

import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды string:equals
 * Сравнивает две strings на равенство
 */
export const stringEqualsDefinition = new NodeDefinition({
  type: 'string:equals',
  category: 'string',
  label: i18n.t('labels.ravno'),
  description: i18n.t('descriptions.sravnivaetDveStrokiNaRavenstvo'),



  defaultData: {
    a: '',
    b: '',
  },

  theme: {
    headerColor: '#db2777',
    accentColor: '#ec4899',
  },
});

export default stringEqualsDefinition;

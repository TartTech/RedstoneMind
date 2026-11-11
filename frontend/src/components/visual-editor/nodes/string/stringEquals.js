import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды string:equals
 * Сравнивает две strings на равенство
 */
export const stringEqualsDefinition = new NodeDefinition({
  type: 'string:equals',
  category: 'string',
  label: t('labels.ravno'),
  description: t('descriptions.sravnivaetDveStrokiNaRavenstvo'),



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

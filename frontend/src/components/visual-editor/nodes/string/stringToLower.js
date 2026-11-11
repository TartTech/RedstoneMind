import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды string:to_lower
 * Преобразует строку в нижний регистр
 */
export const stringToLowerDefinition = new NodeDefinition({
  type: 'string:to_lower',
  category: 'string',
  label: t('labels.vNizhniyRegistr'),
  description: t('descriptions.preobrazuetStrokuVNizhniyRegistrLowercase'),



  defaultData: {
    text: '',
  },

  theme: {
    headerColor: '#db2777',
    accentColor: '#ec4899',
  },
});

export default stringToLowerDefinition;

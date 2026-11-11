import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды string:to_upper
 * Преобразует строку в верхний регистр
 */
export const stringToUpperDefinition = new NodeDefinition({
  type: 'string:to_upper',
  category: 'string',
  label: t('labels.vVerkhniyRegistr'),
  description: t('descriptions.preobrazuetStrokuVVerkhniyRegistrUppercase'),



  defaultData: {
    text: '',
  },

  theme: {
    headerColor: '#db2777',
    accentColor: '#ec4899',
  },
});

export default stringToUpperDefinition;

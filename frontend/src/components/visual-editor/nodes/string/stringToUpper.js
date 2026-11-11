import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды string:to_upper
 * Преобразует строку в верхний регистр
 */
export const stringToUpperDefinition = new NodeDefinition({
  type: 'string:to_upper',
  category: 'string',
  label: i18n.t('labels.vVerkhniyRegistr'),
  description: i18n.t('descriptions.preobrazuetStrokuVVerkhniyRegistrUppercase'),



  defaultData: {
    text: '',
  },

  theme: {
    headerColor: '#db2777',
    accentColor: '#ec4899',
  },
});

export default stringToUpperDefinition;

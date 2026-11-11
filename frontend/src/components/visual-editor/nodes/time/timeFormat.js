import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды time:format
 * Formтирует дату в строку
 */
export const timeFormatDefinition = new NodeDefinition({
  type: 'time:format',
  category: 'time',
  label: i18n.t('labels.formatirovatDatu'),
  description: i18n.t('descriptions.formatiruetDatuVStrokuYyyymmddHhmmss'),



  defaultData: {
    format: 'yyyy-MM-dd HH:mm:ss',
  },

  theme: {
    headerColor: '#ec4899',
    accentColor: '#f472b6',
  },
});

export default timeFormatDefinition;

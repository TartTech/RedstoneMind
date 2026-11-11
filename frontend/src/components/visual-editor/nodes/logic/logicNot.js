import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды logic:not
 * Инвертирует boolean значение
 */
export const logicNotDefinition = new NodeDefinition({
  type: 'logic:not',
  category: 'logic',
  label: i18n.t('labels.ne'),
  description: i18n.t('descriptions.invertiruetBooleanZnachenieNot'),



  defaultData: {
    value: '',
  },

  theme: {
    headerColor: '#dc2626',
    accentColor: '#ef4444',
  },
});

export default logicNotDefinition;

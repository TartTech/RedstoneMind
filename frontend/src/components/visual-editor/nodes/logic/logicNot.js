import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды logic:not
 * Инвертирует boolean значение
 */
export const logicNotDefinition = new NodeDefinition({
  type: 'logic:not',
  category: 'logic',
  label: t('labels.ne'),
  description: t('descriptions.invertiruetBooleanZnachenieNot'),



  defaultData: {
    value: '',
  },

  theme: {
    headerColor: '#dc2626',
    accentColor: '#ef4444',
  },
});

export default logicNotDefinition;

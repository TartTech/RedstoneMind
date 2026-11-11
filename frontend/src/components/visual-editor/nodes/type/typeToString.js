import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды type:to_string
 * Преобразует любое значение в строку
 */
export const typeToStringDefinition = new NodeDefinition({
  type: 'type:to_string',
  category: 'type',
  label: t('labels.vStroku'),
  description: t('descriptions.preobrazuetLyuboeZnachenieVStrokuTostring'),



  defaultData: {
    value: '',
  },

  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default typeToStringDefinition;

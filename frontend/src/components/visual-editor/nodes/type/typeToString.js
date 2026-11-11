import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды type:to_string
 * Преобразует любое значение в строку
 */
export const typeToStringDefinition = new NodeDefinition({
  type: 'type:to_string',
  category: 'type',
  label: i18n.t('labels.vStroku'),
  description: i18n.t('descriptions.preobrazuetLyuboeZnachenieVStrokuTostring'),



  defaultData: {
    value: '',
  },

  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default typeToStringDefinition;

import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды time:add
 * Добавляет к дате указанный промежуток времени
 */
export const timeAddDefinition = new NodeDefinition({
  type: 'time:add',
  category: 'time',
  label: i18n.t('labels.addVremya'),
  description: i18n.t('descriptions.dobavlyaetKDatePromezhutokVremeni'),



  theme: {
    headerColor: '#ec4899',
    accentColor: '#f472b6',
  },
});

export default timeAddDefinition;

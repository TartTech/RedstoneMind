import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды time:diff
 * Вычисляет разницу между двумя датами
 */
export const timeDiffDefinition = new NodeDefinition({
  type: 'time:diff',
  category: 'time',
  label: i18n.t('labels.raznitsaVremeni'),
  description: i18n.t('descriptions.raznitsaMezhduDatamiVMillisecondsakh'),



  theme: {
    headerColor: '#ec4899',
    accentColor: '#f472b6',
  },
});

export default timeDiffDefinition;

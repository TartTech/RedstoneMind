import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды time:diff
 * Вычисляет разницу между двумя датами
 */
export const timeDiffDefinition = new NodeDefinition({
  type: 'time:diff',
  category: 'time',
  label: t('labels.raznitsaVremeni'),
  description: t('descriptions.raznitsaMezhduDatamiVMillisecondsakh'),



  theme: {
    headerColor: '#ec4899',
    accentColor: '#f472b6',
  },
});

export default timeDiffDefinition;

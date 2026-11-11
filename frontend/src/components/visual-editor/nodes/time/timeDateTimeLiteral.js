import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды time:datetime_literal
 * Создает объект даты и времени из strings
 */
export const timeDateTimeLiteralDefinition = new NodeDefinition({
  type: 'time:datetime_literal',
  category: 'time',
  label: i18n.t('labels.dateIVremya'),
  description: i18n.t('descriptions.sozdaetObektDatyIVremeniEmpty'),



  theme: {
    headerColor: '#ec4899',
    accentColor: '#f472b6',
  },
});

export default timeDateTimeLiteralDefinition;

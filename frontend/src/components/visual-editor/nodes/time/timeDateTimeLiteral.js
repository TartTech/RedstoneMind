import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды time:datetime_literal
 * Создает объект даты и времени из strings
 */
export const timeDateTimeLiteralDefinition = new NodeDefinition({
  type: 'time:datetime_literal',
  category: 'time',
  label: t('labels.dateIVremya'),
  description: t('descriptions.sozdaetObektDatyIVremeniEmpty'),



  theme: {
    headerColor: '#ec4899',
    accentColor: '#f472b6',
  },
});

export default timeDateTimeLiteralDefinition;

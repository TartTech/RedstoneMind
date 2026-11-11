import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды debug:log
 * Выводит значение в консоль terminalа
 */
export const debugLogDefinition = new NodeDefinition({
  type: 'debug:log',
  category: 'debug',
  label: t('labels.debug'),
  description: t('descriptions.vyvoditZnachenieVKonsolServera'),



  defaultData: {
    value: '',
  },

  theme: {
    headerColor: '#6366f1',
    accentColor: '#818cf8',
  },
});

export default debugLogDefinition;

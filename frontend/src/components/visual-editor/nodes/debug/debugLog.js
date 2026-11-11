import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды debug:log
 * Выводит значение в консоль terminalа
 */
export const debugLogDefinition = new NodeDefinition({
  type: 'debug:log',
  category: 'debug',
  label: i18n.t('labels.debug'),
  description: i18n.t('descriptions.vyvoditZnachenieVKonsolServera'),



  defaultData: {
    value: '',
  },

  theme: {
    headerColor: '#6366f1',
    accentColor: '#818cf8',
  },
});

export default debugLogDefinition;

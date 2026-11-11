import { NodeDefinition } from '../../core/registry';
import StringConcatSettings from './StringConcatSettings';
import i18n from '@/i18n';

/**
 * Определение ноды string:concat
 * Объединение строк
 */
export const stringConcatDefinition = new NodeDefinition({
  type: 'string:concat',
  category: 'string',
  label: i18n.t('labels.obedinitStroki'),
  description: i18n.t('descriptions.obedinyaetNeskolkoStrokVOdnu'),



  SettingsComponent: StringConcatSettings,

  defaultData: {
    pinCount: 2,
  },

  theme: {
    headerColor: '#db2777',
    accentColor: '#ec4899',
  },
});

export default stringConcatDefinition;

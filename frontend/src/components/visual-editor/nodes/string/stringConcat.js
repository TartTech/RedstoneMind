import { NodeDefinition } from '../../core/registry';
import StringConcatSettings from './StringConcatSettings';

/**
 * Определение ноды string:concat
 * Объединение строк
 */
export const stringConcatDefinition = new NodeDefinition({
  type: 'string:concat',
  category: 'string',
  label: t('labels.obedinitStroki'),
  description: t('descriptions.obedinyaetNeskolkoStrokVOdnu'),



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

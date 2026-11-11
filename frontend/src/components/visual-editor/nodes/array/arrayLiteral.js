import { NodeDefinition } from '../../core/registry';
import ArrayLiteralSettings from './ArrayLiteralSettings';

/**
 * Определение ноды data:array_literal
 * Creation массива из элементов
 */
export const arrayLiteralDefinition = new NodeDefinition({
  type: 'data:array_literal',
  category: 'array',
  label: t('labels.array'),
  description: t('descriptions.sozdaetMassivIzElementov'),



  SettingsComponent: ArrayLiteralSettings,

  defaultData: {
    pinCount: 0,
  },

  theme: {
    headerColor: '#3b82f6',
    accentColor: '#60a5fa',
  },
});

export default arrayLiteralDefinition;

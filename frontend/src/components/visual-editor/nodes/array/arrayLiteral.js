import { NodeDefinition } from '../../core/registry';
import ArrayLiteralSettings from './ArrayLiteralSettings';
import i18n from '@/i18n';

/**
 * Определение ноды data:array_literal
 * Creation массива из элементов
 */
export const arrayLiteralDefinition = new NodeDefinition({
  type: 'data:array_literal',
  category: 'array',
  label: i18n.t('labels.array'),
  description: i18n.t('descriptions.sozdaetMassivIzElementov'),



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

import { NodeDefinition } from '../../core/registry';
import ObjectCreateSettings from './ObjectCreateSettings';
import i18n from '@/i18n';

/**
 * Определение ноды object:create
 * Creation объекта из пар ключ-значение
 */
export const objectCreateDefinition = new NodeDefinition({
  type: 'object:create',
  category: 'object',
  label: i18n.t('labels.createObekt2'),
  description: i18n.t('descriptions.sozdaetObektIzParKlyuchznachenie2'),



  SettingsComponent: ObjectCreateSettings,

  defaultData: {
    advanced: false,
    pinCount: 0,
    jsonValue: '{}',
  },

  theme: {
    headerColor: '#9333ea',
    accentColor: '#a855f7',
  },
});

export default objectCreateDefinition;

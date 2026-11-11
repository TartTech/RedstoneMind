import { NodeDefinition } from '../../core/registry';
import ObjectCreateSettings from './ObjectCreateSettings';

/**
 * Определение ноды object:create
 * Creation объекта из пар ключ-значение
 */
export const objectCreateDefinition = new NodeDefinition({
  type: 'object:create',
  category: 'object',
  label: t('labels.createObekt2'),
  description: t('descriptions.sozdaetObektIzParKlyuchznachenie2'),



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

import { NodeDefinition } from '../../core/registry';
import FlowSequenceSettings from './FlowSequenceSettings';

/**
 * Определение ноды flow:sequence
 * Последовательное выполнение нескольких веток
 */
export const flowSequenceDefinition = new NodeDefinition({
  type: 'flow:sequence',
  category: 'flow',
  label: t('labels.posledovatelnost'),
  description: t('descriptions.posledovatelnoVypolnyaetNeskolkoVetok'),



  SettingsComponent: FlowSequenceSettings,

  defaultData: {
    pinCount: 2,
  },

  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default flowSequenceDefinition;

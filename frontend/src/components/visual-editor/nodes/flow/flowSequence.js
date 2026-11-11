import { NodeDefinition } from '../../core/registry';
import FlowSequenceSettings from './FlowSequenceSettings';
import i18n from '@/i18n';

/**
 * Определение ноды flow:sequence
 * Последовательное выполнение нескольких веток
 */
export const flowSequenceDefinition = new NodeDefinition({
  type: 'flow:sequence',
  category: 'flow',
  label: i18n.t('labels.posledovatelnost'),
  description: i18n.t('descriptions.posledovatelnoVypolnyaetNeskolkoVetok'),



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

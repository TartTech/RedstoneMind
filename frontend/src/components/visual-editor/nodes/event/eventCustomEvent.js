import { NodeDefinition } from '../../core/registry';
import EventCustomSettings from './EventCustomSettings';
import i18n from '@/i18n';

export const eventCustomEventDefinition = new NodeDefinition({
  type: 'event:custom_event',
  category: 'event',
  label: i18n.t('labels.event'),
  description: i18n.t('descriptions.startovayaNodaPolzovatelskogoSobytiyaSDinamicheskimi'),



  SettingsComponent: EventCustomSettings,

  defaultData: { pins: [] },

  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventCustomEventDefinition;

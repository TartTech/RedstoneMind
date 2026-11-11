import { NodeDefinition } from '../../core/registry';
import EventCustomSettings from './EventCustomSettings';

export const eventCustomEventDefinition = new NodeDefinition({
  type: 'event:custom_event',
  category: 'event',
  label: t('labels.event'),
  description: t('descriptions.startovayaNodaPolzovatelskogoSobytiyaSDinamicheskimi'),



  SettingsComponent: EventCustomSettings,

  defaultData: { pins: [] },

  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventCustomEventDefinition;

import { NodeDefinition } from '../../core/registry';
import EventCallSettings from './EventCallSettings';
import i18n from '@/i18n';

export const eventCallEventDefinition = new NodeDefinition({
  type: 'event:call_event',
  category: 'flow',
  label: i18n.t('labels.vyzvatSobytie'),
  description: i18n.t('descriptions.vyzyvaetPolzovatelskoeSobytieIPeredayotParametry'),



  SettingsComponent: EventCallSettings,

  defaultData: { selectedEventId: null },

  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventCallEventDefinition;

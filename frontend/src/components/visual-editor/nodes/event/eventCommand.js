import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды event:command
 * Стартовая точка for графа команды
 */
export const eventCommandDefinition = new NodeDefinition({
  type: 'event:command',
  category: 'event',
  label: i18n.t('labels.priVypolneniiKomandy'),
  description: i18n.t('descriptions.startovayaTochkaDlyaGrafaKomandy'),



  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventCommandDefinition;

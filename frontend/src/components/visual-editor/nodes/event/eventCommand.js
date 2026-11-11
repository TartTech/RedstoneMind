import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды event:command
 * Стартовая точка for графа команды
 */
export const eventCommandDefinition = new NodeDefinition({
  type: 'event:command',
  category: 'event',
  label: t('labels.priVypolneniiKomandy'),
  description: t('descriptions.startovayaTochkaDlyaGrafaKomandy'),



  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventCommandDefinition;

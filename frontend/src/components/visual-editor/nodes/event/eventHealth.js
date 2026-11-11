import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды event:health
 * Срабатывает при изменении здоровья, голода or насыщения
 */
export const eventHealthDefinition = new NodeDefinition({
  type: 'event:health',
  category: 'event',
  label: t('labels.healthhungerIzmenilos'),
  description: t('descriptions.srabatyvaetPriIzmeneniiZdorovyaGolodaIli'),



  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventHealthDefinition;

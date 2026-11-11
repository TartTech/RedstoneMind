import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды event:health
 * Срабатывает при изменении здоровья, голода or насыщения
 */
export const eventHealthDefinition = new NodeDefinition({
  type: 'event:health',
  category: 'event',
  label: i18n.t('labels.healthhungerIzmenilos'),
  description: i18n.t('descriptions.srabatyvaetPriIzmeneniiZdorovyaGolodaIli'),



  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventHealthDefinition;

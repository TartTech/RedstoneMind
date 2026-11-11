import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды event:botDied
 * Срабатывает когда bot умирает
 */
export const eventBotDiedDefinition = new NodeDefinition({
  type: 'event:botDied',
  category: 'event',
  label: i18n.t('labels.botUmer'),
  description: i18n.t('descriptions.srabatyvaetKogdaBotUmiraet'),



  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventBotDiedDefinition;

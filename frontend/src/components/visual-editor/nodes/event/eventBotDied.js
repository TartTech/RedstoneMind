import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды event:botDied
 * Срабатывает когда bot умирает
 */
export const eventBotDiedDefinition = new NodeDefinition({
  type: 'event:botDied',
  category: 'event',
  label: t('labels.botUmer'),
  description: t('descriptions.srabatyvaetKogdaBotUmiraet'),



  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventBotDiedDefinition;

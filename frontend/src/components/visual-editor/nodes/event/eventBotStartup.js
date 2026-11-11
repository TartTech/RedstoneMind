import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды event:botStartup
 * Срабатывает один раз при запуске botа
 */
export const eventBotStartupDefinition = new NodeDefinition({
  type: 'event:botStartup',
  category: 'event',
  label: t('labels.priZapuskeBota'),
  description: t('descriptions.srabatyvaetOdinRazPriZapuskeBota'),



  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventBotStartupDefinition;

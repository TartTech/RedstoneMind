import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды event:botStartup
 * Срабатывает один раз при запуске botа
 */
export const eventBotStartupDefinition = new NodeDefinition({
  type: 'event:botStartup',
  category: 'event',
  label: i18n.t('labels.priZapuskeBota'),
  description: i18n.t('descriptions.srabatyvaetOdinRazPriZapuskeBota'),



  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventBotStartupDefinition;

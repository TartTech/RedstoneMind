import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды event:playerLeft
 * Срабатывает когда игрок покидает сервер
 */
export const eventPlayerLeftDefinition = new NodeDefinition({
  type: 'event:playerLeft',
  category: 'event',
  label: i18n.t('labels.playerVyshel'),
  description: i18n.t('descriptions.srabatyvaetKogdaIgrokPokidaetServer'),



  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventPlayerLeftDefinition;

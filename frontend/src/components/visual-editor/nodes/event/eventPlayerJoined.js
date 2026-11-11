import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды event:playerJoined
 * Срабатывает когда игрок заходит на сервер
 */
export const eventPlayerJoinedDefinition = new NodeDefinition({
  type: 'event:playerJoined',
  category: 'event',
  label: i18n.t('labels.playerZashel'),
  description: i18n.t('descriptions.srabatyvaetKogdaIgrokZakhoditNaServer'),



  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventPlayerJoinedDefinition;

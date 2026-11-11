import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды event:entityGone
 * Срабатывает когда сущность пропадает из зоны видимости
 */
export const eventEntityGoneDefinition = new NodeDefinition({
  type: 'event:entityGone',
  category: 'event',
  label: i18n.t('labels.entityIschezla'),
  description: i18n.t('descriptions.vyzyvaetsyaKogdaSushchnostPropadaetIzZony'),



  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventEntityGoneDefinition;

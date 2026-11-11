import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды event:entityGone
 * Срабатывает когда сущность пропадает из зоны видимости
 */
export const eventEntityGoneDefinition = new NodeDefinition({
  type: 'event:entityGone',
  category: 'event',
  label: t('labels.entityIschezla'),
  description: t('descriptions.vyzyvaetsyaKogdaSushchnostPropadaetIzZony'),



  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventEntityGoneDefinition;

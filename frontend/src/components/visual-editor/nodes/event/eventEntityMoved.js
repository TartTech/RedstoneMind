import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды event:entityMoved
 * Срабатывает когда сущность перемещается
 */
export const eventEntityMovedDefinition = new NodeDefinition({
  type: 'event:entityMoved',
  category: 'event',
  label: t('labels.entityPodvinulas'),
  description: t('descriptions.vyzyvaetsyaKogdaLyubayaSushchnostPeremeshchaetsya'),



  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventEntityMovedDefinition;

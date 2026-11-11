import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды event:entityMoved
 * Срабатывает когда сущность перемещается
 */
export const eventEntityMovedDefinition = new NodeDefinition({
  type: 'event:entityMoved',
  category: 'event',
  label: i18n.t('labels.entityPodvinulas'),
  description: i18n.t('descriptions.vyzyvaetsyaKogdaLyubayaSushchnostPeremeshchaetsya'),



  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventEntityMovedDefinition;

import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды action:bot_look_at
 * Поворачивает голову botа в сторону координат or сущности
 */
export const actionBotLookAtDefinition = new NodeDefinition({
  type: 'action:bot_look_at',
  category: 'action',
  label: i18n.t('labels.posmotretNa'),
  description: i18n.t('descriptions.povorachivaetGolovuBotaNaTsel'),



  defaultData: {
    add_y: 0,
  },

  theme: {
    headerColor: '#0ea5e9',
    accentColor: '#38bdf8',
  },
});

export default actionBotLookAtDefinition;

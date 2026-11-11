import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды bot:get_position
 * Возвращает текущую позицию botа в мире
 */
export const botGetPositionDefinition = new NodeDefinition({
  type: 'bot:get_position',
  category: 'bot',
  label: i18n.t('labels.poluchitPozitsiyu'),
  description: i18n.t('descriptions.vozvrashchaetTekushchuyuPozitsiyuBotaVMire'),



  theme: {
    headerColor: '#3b82f6',
    accentColor: '#60a5fa',
  },
});

export default botGetPositionDefinition;

import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды bot:get_position
 * Возвращает текущую позицию botа в мире
 */
export const botGetPositionDefinition = new NodeDefinition({
  type: 'bot:get_position',
  category: 'bot',
  label: t('labels.poluchitPozitsiyu'),
  description: t('descriptions.vozvrashchaetTekushchuyuPozitsiyuBotaVMire'),



  theme: {
    headerColor: '#3b82f6',
    accentColor: '#60a5fa',
  },
});

export default botGetPositionDefinition;

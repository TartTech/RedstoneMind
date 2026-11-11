import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды inventory:get_all
 * Возвращает весь инвентарь botа как массив слотов
 */
export const inventoryGetAllDefinition = new NodeDefinition({
  type: 'inventory:get_all',
  category: 'inventory',
  label: i18n.t('labels.vesInventar'),
  description: i18n.t('descriptions.vozvrashchaetVesInventarBotaKakMassiv'),



  defaultData: {},

  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default inventoryGetAllDefinition;

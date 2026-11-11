import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды inventory:get_all
 * Возвращает весь инвентарь botа как массив слотов
 */
export const inventoryGetAllDefinition = new NodeDefinition({
  type: 'inventory:get_all',
  category: 'inventory',
  label: t('labels.vesInventar'),
  description: t('descriptions.vozvrashchaetVesInventarBotaKakMassiv'),



  defaultData: {},

  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default inventoryGetAllDefinition;

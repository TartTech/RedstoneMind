import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды furnace:get_status
 * Получает текущий статус печки (топливо, прогресс, предметы)
 */
export const furnaceGetStatusDefinition = new NodeDefinition({
  type: 'furnace:get_status',
  category: 'furnace',
  label: i18n.t('labels.pechkaStatus'),
  description: i18n.t('descriptions.poluchaetTekushchiyStatusPechkiToplivoProgress'),



  defaultData: {},

  theme: {
    headerColor: '#dc2626',
    accentColor: '#ef4444',
  },
});

export default furnaceGetStatusDefinition;

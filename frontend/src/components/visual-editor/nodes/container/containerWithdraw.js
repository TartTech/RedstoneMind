import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды container:withdraw
 * Забирает предмет из открытого контейнера
 */
export const containerWithdrawDefinition = new NodeDefinition({
  type: 'container:withdraw',
  category: 'container',
  label: i18n.t('labels.konteynerZabrat'),
  description: i18n.t('descriptions.zabiraetPredmetIzKonteyneraVInventar'),



  defaultData: {
    itemName: '',
    count: null,
  },

  theme: {
    headerColor: '#d97706',
    accentColor: '#f59e0b',
  },
});

export default containerWithdrawDefinition;

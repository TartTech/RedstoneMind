import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды container:find_item
 * Ищет предмет в открытом контейнере
 */
export const containerFindItemDefinition = new NodeDefinition({
  type: 'container:find_item',
  category: 'container',
  label: i18n.t('labels.konteynerNaytiPredmet'),
  description: i18n.t('descriptions.ishchetPredmetVOtkrytomKonteynere'),



  defaultData: {
    itemName: '',
  },

  theme: {
    headerColor: '#d97706',
    accentColor: '#f59e0b',
  },
});

export default containerFindItemDefinition;

import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды container:find_item
 * Ищет предмет в открытом контейнере
 */
export const containerFindItemDefinition = new NodeDefinition({
  type: 'container:find_item',
  category: 'container',
  label: t('labels.konteynerNaytiPredmet'),
  description: t('descriptions.ishchetPredmetVOtkrytomKonteynere'),



  defaultData: {
    itemName: '',
  },

  theme: {
    headerColor: '#d97706',
    accentColor: '#f59e0b',
  },
});

export default containerFindItemDefinition;

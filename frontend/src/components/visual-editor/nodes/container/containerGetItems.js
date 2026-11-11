import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды container:get_items
 * Получает список items из открытого контейнера
 */
export const containerGetItemsDefinition = new NodeDefinition({
  type: 'container:get_items',
  category: 'container',
  label: t('labels.konteynerSoderzhimoe'),
  description: t('descriptions.poluchaetSpisokPredmetovIzOtkrytogoKonteynera'),



  defaultData: {},

  theme: {
    headerColor: '#d97706',
    accentColor: '#f59e0b',
  },
});

export default containerGetItemsDefinition;

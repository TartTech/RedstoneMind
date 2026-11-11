import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды container:get_items
 * Получает список items из открытого контейнера
 */
export const containerGetItemsDefinition = new NodeDefinition({
  type: 'container:get_items',
  category: 'container',
  label: i18n.t('labels.konteynerSoderzhimoe'),
  description: i18n.t('descriptions.poluchaetSpisokPredmetovIzOtkrytogoKonteynera'),



  defaultData: {},

  theme: {
    headerColor: '#d97706',
    accentColor: '#f59e0b',
  },
});

export default containerGetItemsDefinition;

import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды container:close
 * Закрывает открытый контейнер
 */
export const containerCloseDefinition = new NodeDefinition({
  type: 'container:close',
  category: 'container',
  label: i18n.t('labels.konteynerZakryt'),
  description: i18n.t('descriptions.zakryvaetTekushchiyOtkrytyyKonteyner'),



  defaultData: {},

  theme: {
    headerColor: '#d97706',
    accentColor: '#f59e0b',
  },
});

export default containerCloseDefinition;

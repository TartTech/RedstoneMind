import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды data:get_entity_field
 * Получает определенное поле из объекта сущности
 */
export const dataGetEntityFieldDefinition = new NodeDefinition({
  type: 'data:get_entity_field',
  category: 'data',
  label: i18n.t('labels.poleSushchnosti'),
  description: i18n.t('descriptions.poluchaetPolyaIzObektaSushchnosti'),



  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataGetEntityFieldDefinition;

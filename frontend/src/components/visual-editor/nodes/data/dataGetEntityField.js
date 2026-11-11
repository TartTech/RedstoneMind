import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды data:get_entity_field
 * Получает определенное поле из объекта сущности
 */
export const dataGetEntityFieldDefinition = new NodeDefinition({
  type: 'data:get_entity_field',
  category: 'data',
  label: t('labels.poleSushchnosti'),
  description: t('descriptions.poluchaetPolyaIzObektaSushchnosti'),



  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataGetEntityFieldDefinition;

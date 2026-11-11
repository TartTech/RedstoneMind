import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды data:entity_info
 * Извлекает data из объекта существа
 */
export const dataEntityInfoDefinition = new NodeDefinition({
  type: 'data:entity_info',
  category: 'data',
  label: t('labels.informationOSushchnosti'),
  description: t('descriptions.informationOSushchestve'),



  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataEntityInfoDefinition;

import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды data:entity_info
 * Извлекает data из объекта существа
 */
export const dataEntityInfoDefinition = new NodeDefinition({
  type: 'data:entity_info',
  category: 'data',
  label: i18n.t('labels.informationOSushchnosti'),
  description: i18n.t('descriptions.informationOSushchestve'),



  theme: {
    headerColor: '#10b981',
    accentColor: '#34d399',
  },
});

export default dataEntityInfoDefinition;

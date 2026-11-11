import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды furnace:close
 * Закрывает открытую печку
 */
export const furnaceCloseDefinition = new NodeDefinition({
  type: 'furnace:close',
  category: 'furnace',
  label: t('labels.pechkaZakryt'),
  description: t('descriptions.zakryvaetOtkrytuyuPechku'),



  defaultData: {},

  theme: {
    headerColor: '#dc2626',
    accentColor: '#ef4444',
  },
});

export default furnaceCloseDefinition;

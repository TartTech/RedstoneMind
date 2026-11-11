import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды navigation:stop
 * Останавливает текущее движение botа
 */
export const navigationStopDefinition = new NodeDefinition({
  type: 'navigation:stop',
  category: 'navigation',
  label: t('labels.stopsya'),
  description: t('descriptions.ostanavlivaetTekushcheeDvizheniesledovanieBota'),



  defaultData: {},

  theme: {
    headerColor: '#06b6d4',
    accentColor: '#22d3ee',
  },
});

export default navigationStopDefinition;

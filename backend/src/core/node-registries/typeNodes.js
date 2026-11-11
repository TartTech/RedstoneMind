const { GRAPH_TYPES } = require('../../core/constants/graphTypes');

const typeNodes = [
  {
    type: 'type:to_string',
    label: t('nodes:msg_7a6a7cd6'),
    category: t('nodes:msg_825c850f'),
    description: t('nodes:msg_637cc157'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/type/to_string').evaluate,
const { t } = require('../../i18n');
    computeInputs: (data) => [
      { id: 'value', name: t('nodes:msg_7b46d8cc'), type: 'Wildcard', required: false }
    ],
    computeOutputs: () => [
      { id: 'result', name: 'Result', type: 'String' }
    ],
    defaultData: {},
    theme: { headerColor: '#0891b2', accentColor: '#06b6d4' }
  }
];

module.exports = typeNodes;
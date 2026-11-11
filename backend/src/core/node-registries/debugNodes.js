const { GRAPH_TYPES } = require('../../core/constants/graphTypes');

const debugNodes = [
  {
    type: 'debug:log',
    label: t('nodes:msg_553ee5dd'),
    category: t('nodes:msg_4281acce'),
    description: t('nodes:msg_4f9306bf'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/debug/log').execute,
const { t } = require('../../i18n');
    computeInputs: (data) => [
      { id: 'exec', name: 'Exec', type: 'Exec' },
      { id: 'value', name: t('nodes:msg_7b46d8cc'), type: 'Wildcard', required: true }
    ],
    computeOutputs: () => [
      { id: 'exec', name: 'Exec', type: 'Exec' }
    ],
    defaultData: {},
    theme: { headerColor: '#64748b', accentColor: '#94a3b8' }
  }
];

module.exports = debugNodes;
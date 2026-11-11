const { GRAPH_TYPES } = require('../../core/constants/graphTypes');

const botNodes = [
  {
    type: 'bot:stop',
    label: t('nodes:msg_74a52e62'),
    category: t('nodes:msg_0ae1973f'),
    description: t('nodes:msg_18a4e928'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/bot/stop_bot').execute,
    computeInputs: () => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' }
    ],
    computeOutputs: () => [],
    defaultData: {},
    theme: { headerColor: '#dc2626', accentColor: '#ef4444' }
  },
  {
    type: 'bot:restart',
    label: t('nodes:msg_38f8c816'),
    category: t('nodes:msg_0ae1973f'),
    description: t('nodes:msg_0e2967c4'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/bot/restart_bot').execute,
    computeInputs: () => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' }
    ],
    computeOutputs: () => [],
    defaultData: {},
    theme: { headerColor: '#d97706', accentColor: '#f59e0b' }
  },
  {
    type: 'bot:get_position',
    label: t('nodes:msg_4746b31b'),
    category: t('nodes:msg_0ae1973f'),
    description: t('nodes:msg_7e5a1ade'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/bot/get_position').evaluate,
    computeInputs: () => [],
    computeOutputs: () => [
      { id: 'position', name: t('nodes:msg_3b5f2ce0'), type: 'Object' }
    ],
    defaultData: {},
    theme: { headerColor: '#059669', accentColor: '#10b981' }
  },
  {
    type: 'bot:get_name',
    label: t('nodes:msg_c0cbf1df'),
    category: t('nodes:msg_0ae1973f'),
    description: t('nodes:msg_243b628d'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/bot/get_name').evaluate,
const { t } = require('../../i18n');
    computeInputs: () => [],
    computeOutputs: () => [
      { id: 'name', name: t('nodes:msg_d38d6d92'), type: 'String' }
    ],
    defaultData: {},
    theme: { headerColor: '#3b82f6', accentColor: '#60a5fa' }
  }
];

module.exports = botNodes;
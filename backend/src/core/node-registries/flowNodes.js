const { GRAPH_TYPES } = require('../../core/constants/graphTypes');
const { t } = require('../../i18n');

const flowNodes = [
  {
    type: 'flow:branch',
    label: t('nodes:msg_d79be6dd'),
    category: t('nodes:msg_e696d1e1'),
    description: t('nodes:msg_5d66594b'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/flow/branch').execute,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec', required: true },
      { id: 'condition', name: t('nodes:msg_8d984dfc'), type: 'Boolean', required: true }
    ],
    computeOutputs: (data) => [
      { id: 'exec_true', name: 'True', type: 'Exec' },
      { id: 'exec_false', name: 'False', type: 'Exec' }
    ],
    defaultData: {},
    theme: { headerColor: '#10b981', accentColor: '#34d399' }
  },
  {
    type: 'flow:sequence',
    label: t('nodes:msg_22628fbb'),
    category: t('nodes:msg_e696d1e1'),
    description: t('nodes:msg_e7226162'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/flow/sequence').execute,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec', required: true }
    ],
    computeOutputs: (data) => [
      { id: 'exec_0', name: '0', type: 'Exec' },
      { id: 'exec_1', name: '1', type: 'Exec' }
    ],
    defaultData: {},
    theme: { headerColor: '#10b981', accentColor: '#34d399' }
  },
  {
    type: 'flow:for_each',
    label: t('nodes:msg_ff4c3e0c'),
    category: t('nodes:msg_e696d1e1'),
    description: t('nodes:msg_for_each_desc'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/flow/for_each').execute,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec', required: true },
      { id: 'array', name: t('nodes:msg_016c515a'), type: 'Array', required: true }
    ],
    computeOutputs: (data) => [
      { id: 'loop_body', name: t('nodes:msg_665729a7'), type: 'Exec' },
      { id: 'element', name: t('nodes:msg_101a1cd2'), type: 'Any' },
      { id: 'index', name: t('nodes:msg_84cf3af1'), type: 'Number' },
      { id: 'completed', name: t('nodes:msg_0083ce05'), type: 'Exec' }
    ],
    defaultData: {},
    theme: { headerColor: '#10b981', accentColor: '#34d399' }
  },
  {
    type: 'flow:while',
    label: t('nodes:msg_98ec0881'),
    category: t('nodes:msg_e696d1e1'),
    description: t('nodes:msg_while_desc'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/flow/while').execute,
    evaluator: require('../../core/nodes/flow/while').evaluate,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec', required: true },
      { id: 'condition', name: t('nodes:msg_8d984dfc'), type: 'Boolean', required: true }
    ],
    computeOutputs: (data) => [
      { id: 'loop_body', name: t('nodes:msg_665729a7'), type: 'Exec' },
      { id: 'iteration', name: t('nodes:msg_0f7c7610'), type: 'Number' },
      { id: 'completed', name: t('nodes:msg_0083ce05'), type: 'Exec' }
    ],
    defaultData: {},
    theme: { headerColor: '#10b981', accentColor: '#34d399' }
  },
  {
    type: 'flow:break',
    label: t('nodes:msg_0c6e75a3'),
    category: t('nodes:msg_e696d1e1'),
    description: t('nodes:perm_6cc567ec'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/flow/break').execute,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec', required: true }
    ],
    computeOutputs: (data) => [],
    defaultData: {},
    theme: { headerColor: '#10b981', accentColor: '#34d399' }
  },
  {
    type: 'flow:delay',
    label: t('nodes:msg_70c59538'),
    category: t('nodes:msg_e696d1e1'),
    description: t('nodes:msg_fa6fa38f'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/flow/delay').execute,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec', required: true },
      { id: 'delay', name: t('nodes:msg_970e0590'), type: 'Number', required: false, inlineField: true, placeholder: '1000' }
    ],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_c4530912'), type: 'Exec' }
    ],
    defaultData: { delay: 1000 },
    theme: { headerColor: '#10b981', accentColor: '#34d399' }
  },
  {
    type: 'flow:switch',
    label: '🔀 Switch',
    category: t('nodes:msg_e696d1e1'),
    description: t('nodes:msg_32e33bfa'),
    graphType: GRAPH_TYPES.ALL,
    dynamicPins: true,
    executor: require('../../core/nodes/flow/switch').execute,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec', required: true },
      { id: 'value', name: t('nodes:msg_7b46d8cc'), type: 'Wildcard', required: true }
    ],
    computeOutputs: (data) => [
      { id: 'default', name: 'Default', type: 'Exec' }
    ],
    defaultData: {},
    theme: { headerColor: '#10b981', accentColor: '#34d399' }
  },
  {
    type: 'flow:timer',
    label: t('nodes:msg_26f01a14'),
    category: t('nodes:msg_e696d1e1'),
    description: t('nodes:msg_263150fe'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/flow/timer').execute,
    evaluator: require('../../core/nodes/flow/timer').evaluate,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec', required: true },
      { id: 'interval', name: t('nodes:msg_f6b59750'), type: 'Number', required: false, inlineField: true, placeholder: '1' },
      { id: 'max_ticks', name: t('nodes:msg_d64acb26'), type: 'Number', required: false, inlineField: true, placeholder: '0' }
    ],
    computeOutputs: (data) => [
      { id: 'loop_body', name: t('nodes:msg_665729a7'), type: 'Exec' },
      { id: 'tick', name: t('nodes:msg_74adcc96'), type: 'Number' },
      { id: 'completed', name: t('nodes:msg_0083ce05'), type: 'Exec' }
    ],
    defaultData: { interval: 1, max_ticks: 0 },
    theme: { headerColor: '#10b981', accentColor: '#34d399' }
  },
];

module.exports = flowNodes;

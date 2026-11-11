const { GRAPH_TYPES } = require('../../core/constants/graphTypes');

const furnaceNodes = [
  {
    type: 'furnace:open',
    label: t('nodes:msg_f00db0db'),
    category: t('nodes:msg_3df82c0a'),
    description: t('nodes:msg_c2fea9d5'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/furnace/open').execute,
    evaluator: require('../../core/nodes/furnace/open').evaluate,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'x', name: 'X', type: 'Number', required: false, inlineField: true, placeholder: '0' },
      { id: 'y', name: 'Y', type: 'Number', required: false, inlineField: true, placeholder: '64' },
      { id: 'z', name: 'Z', type: 'Number', required: false, inlineField: true, placeholder: '0' }
    ],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_813f09d7'), type: 'Exec' },
      { id: 'exec_failed', name: t('nodes:error_c6fd3c6a'), type: 'Exec' },
      { id: 'furnace', name: t('nodes:msg_3df82c0a'), type: 'Object' },
      { id: 'success', name: t('nodes:msg_b4341414'), type: 'Boolean' }
    ],
    defaultData: { x: 0, y: 64, z: 0 },
    theme: { headerColor: '#ef4444', accentColor: '#f87171' }
  },
  {
    type: 'furnace:close',
    label: t('nodes:msg_b80044da'),
    category: t('nodes:msg_3df82c0a'),
    description: t('nodes:msg_94ff8126'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/furnace/close').execute,
    computeInputs: () => [{ id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' }],
    computeOutputs: () => [{ id: 'exec', name: t('nodes:msg_c4530912'), type: 'Exec' }],
    defaultData: {},
    theme: { headerColor: '#ef4444', accentColor: '#f87171' }
  },
  {
    type: 'furnace:put_input',
    label: t('nodes:msg_90ba6dcc'),
    category: t('nodes:msg_3df82c0a'),
    description: t('nodes:msg_32cb72e4'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/furnace/put_input').execute,
    evaluator: require('../../core/nodes/furnace/put_input').evaluate,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'itemName', name: t('nodes:msg_444a3bce'), type: 'String', required: true, inlineField: true, placeholder: 'iron_ore...' },
      { id: 'count', name: t('nodes:msg_302e2bd6'), type: 'Number', required: false, inlineField: true, placeholder: t('nodes:msg_984bf149') }
    ],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_9d71ae42'), type: 'Exec' },
      { id: 'exec_failed', name: t('nodes:error_c6fd3c6a'), type: 'Exec' },
      { id: 'success', name: t('nodes:msg_b4341414'), type: 'Boolean' }
    ],
    defaultData: { itemName: '', count: null },
    theme: { headerColor: '#ef4444', accentColor: '#f87171' }
  },
  {
    type: 'furnace:put_fuel',
    label: t('nodes:msg_3f8c001e'),
    category: t('nodes:msg_3df82c0a'),
    description: t('nodes:msg_df30cd5d'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/furnace/put_fuel').execute,
    evaluator: require('../../core/nodes/furnace/put_fuel').evaluate,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'itemName', name: t('nodes:msg_6a401865'), type: 'String', required: true, inlineField: true, placeholder: 'coal...' },
      { id: 'count', name: t('nodes:msg_302e2bd6'), type: 'Number', required: false, inlineField: true, placeholder: t('nodes:msg_984bf149') }
    ],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_9d71ae42'), type: 'Exec' },
      { id: 'exec_failed', name: t('nodes:error_c6fd3c6a'), type: 'Exec' },
      { id: 'success', name: t('nodes:msg_b4341414'), type: 'Boolean' }
    ],
    defaultData: { itemName: '', count: null },
    theme: { headerColor: '#ef4444', accentColor: '#f87171' }
  },
  {
    type: 'furnace:take_output',
    label: t('nodes:msg_1e115c28'),
    category: t('nodes:msg_3df82c0a'),
    description: t('nodes:msg_7fa8e8a3'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/furnace/take_output').execute,
    evaluator: require('../../core/nodes/furnace/take_output').evaluate,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' }
    ],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_586645f1'), type: 'Exec' },
      { id: 'exec_failed', name: t('nodes:error_7ba55fdb'), type: 'Exec' },
      { id: 'item', name: t('nodes:msg_444a3bce'), type: 'Object' },
      { id: 'count', name: t('nodes:msg_302e2bd6'), type: 'Number' },
      { id: 'success', name: t('nodes:msg_b4341414'), type: 'Boolean' }
    ],
    defaultData: {},
    theme: { headerColor: '#ef4444', accentColor: '#f87171' }
  },
  {
    type: 'furnace:get_status',
    label: t('nodes:msg_cc3cbd65'),
    category: t('nodes:msg_3df82c0a'),
    description: t('nodes:msg_66093c58'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/furnace/get_status').evaluate,
const { t } = require('../../i18n');
    computeInputs: () => [],
    computeOutputs: () => [
      { id: 'inputItem', name: t('nodes:msg_5bd7411d'), type: 'Object' },
      { id: 'fuelItem', name: t('nodes:msg_6a401865'), type: 'Object' },
      { id: 'outputItem', name: t('nodes:msg_01332819'), type: 'Object' },
      { id: 'fuel', name: t('nodes:msg_f34f8fbb'), type: 'Number' },
      { id: 'progress', name: t('nodes:msg_9fff17c6'), type: 'Number' },
      { id: 'isBurning', name: t('nodes:msg_d0a00c8a'), type: 'Boolean' }
    ],
    defaultData: {},
    theme: { headerColor: '#ef4444', accentColor: '#f87171' }
  }
];

module.exports = furnaceNodes;
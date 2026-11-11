const { GRAPH_TYPES } = require('../../core/constants/graphTypes');

const containerNodes = [
  {
    type: 'container:open',
    label: t('nodes:msg_f271c783'),
    category: t('nodes:msg_8b7f2bca'),
    description: t('nodes:msg_6c1b6673'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/container/open').execute,
    evaluator: require('../../core/nodes/container/open').evaluate,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'x', name: 'X', type: 'Number', required: false, inlineField: true, placeholder: '0' },
      { id: 'y', name: 'Y', type: 'Number', required: false, inlineField: true, placeholder: '64' },
      { id: 'z', name: 'Z', type: 'Number', required: false, inlineField: true, placeholder: '0' }
    ],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_d5b5865e'), type: 'Exec' },
      { id: 'exec_failed', name: t('nodes:error_c6fd3c6a'), type: 'Exec' },
      { id: 'container', name: t('nodes:msg_df7a6b70'), type: 'Object' },
      { id: 'success', name: t('nodes:msg_b4341414'), type: 'Boolean' }
    ],
    defaultData: { x: 0, y: 64, z: 0 },
    theme: { headerColor: '#d97706', accentColor: '#f59e0b' }
  },
  {
    type: 'container:close',
    label: t('nodes:msg_e760f1e3'),
    category: t('nodes:msg_8b7f2bca'),
    description: t('nodes:msg_87370df5'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/container/close').execute,
    computeInputs: () => [{ id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' }],
    computeOutputs: () => [{ id: 'exec', name: t('nodes:msg_3da1d7eb'), type: 'Exec' }],
    defaultData: {},
    theme: { headerColor: '#d97706', accentColor: '#f59e0b' }
  },
  {
    type: 'container:deposit',
    label: t('nodes:msg_87969765'),
    category: t('nodes:msg_8b7f2bca'),
    description: t('nodes:msg_8d3e092e'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/container/deposit').execute,
    evaluator: require('../../core/nodes/container/deposit').evaluate,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'itemName', name: t('nodes:msg_444a3bce'), type: 'String', required: true, inlineField: true, placeholder: 'diamond...' },
      { id: 'count', name: t('nodes:msg_302e2bd6'), type: 'Number', required: false, inlineField: true, placeholder: t('nodes:msg_984bf149') }
    ],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_34e1413d'), type: 'Exec' },
      { id: 'exec_failed', name: t('nodes:error_c6fd3c6a'), type: 'Exec' },
      { id: 'deposited', name: t('nodes:msg_9d71ae42'), type: 'Number' },
      { id: 'success', name: t('nodes:msg_b4341414'), type: 'Boolean' }
    ],
    defaultData: { itemName: '', count: null },
    theme: { headerColor: '#d97706', accentColor: '#f59e0b' }
  },
  {
    type: 'container:withdraw',
    label: t('nodes:msg_000f3e9e'),
    category: t('nodes:msg_8b7f2bca'),
    description: t('nodes:msg_03e5d790'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/container/withdraw').execute,
    evaluator: require('../../core/nodes/container/withdraw').evaluate,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'itemName', name: t('nodes:msg_444a3bce'), type: 'String', required: true, inlineField: true, placeholder: 'diamond...' },
      { id: 'count', name: t('nodes:msg_302e2bd6'), type: 'Number', required: false, inlineField: true, placeholder: t('nodes:msg_984bf149') }
    ],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_34e1413d'), type: 'Exec' },
      { id: 'exec_failed', name: t('nodes:error_c6fd3c6a'), type: 'Exec' },
      { id: 'withdrawn', name: t('nodes:msg_586645f1'), type: 'Number' },
      { id: 'success', name: t('nodes:msg_b4341414'), type: 'Boolean' }
    ],
    defaultData: { itemName: '', count: null },
    theme: { headerColor: '#d97706', accentColor: '#f59e0b' }
  },
  {
    type: 'container:deposit_all',
    label: t('nodes:msg_ee70c04b'),
    category: t('nodes:msg_8b7f2bca'),
    description: t('nodes:msg_6cd88c0a'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/container/deposit_all').execute,
    evaluator: require('../../core/nodes/container/deposit_all').evaluate,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'itemName', name: t('nodes:msg_444a3bce'), type: 'String', required: false, inlineField: true, placeholder: t('nodes:msg_984bf149') },
      { id: 'keepOne', name: t('nodes:msg_9857a240'), type: 'Boolean', required: false, inlineField: true }
    ],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_34e1413d'), type: 'Exec' },
      { id: 'deposited', name: t('nodes:msg_9d71ae42'), type: 'Number' }
    ],
    defaultData: { itemName: '', keepOne: false },
    theme: { headerColor: '#d97706', accentColor: '#f59e0b' }
  },
  {
    type: 'container:get_items',
    label: t('nodes:msg_11e7dd9c'),
    category: t('nodes:msg_8b7f2bca'),
    description: t('nodes:msg_eee2878c'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/container/get_items').evaluate,
    computeInputs: (data) => [
      { id: 'container', name: t('nodes:msg_df7a6b70'), type: 'Object', required: false }
    ],
    computeOutputs: (data) => [
      { id: 'items', name: t('nodes:msg_49063cec'), type: 'Array' },
      { id: 'count', name: t('nodes:msg_ea1bccac'), type: 'Number' }
    ],
    defaultData: {},
    theme: { headerColor: '#d97706', accentColor: '#f59e0b' }
  },
  {
    type: 'container:find_item',
    label: t('nodes:msg_b5edfea3'),
    category: t('nodes:msg_8b7f2bca'),
    description: t('nodes:msg_fd38402d'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/container/find_item').evaluate,
const { t } = require('../../i18n');
    computeInputs: (data) => [
      { id: 'itemName', name: t('nodes:msg_444a3bce'), type: 'String', required: true, inlineField: true, placeholder: 'diamond...' }
    ],
    computeOutputs: (data) => [
      { id: 'item', name: t('nodes:msg_444a3bce'), type: 'Object' },
      { id: 'slot', name: t('nodes:msg_38b55f06'), type: 'Number' },
      { id: 'count', name: t('nodes:msg_302e2bd6'), type: 'Number' },
      { id: 'found', name: t('nodes:msg_eb2b0556'), type: 'Boolean' }
    ],
    defaultData: { itemName: '' },
    theme: { headerColor: '#d97706', accentColor: '#f59e0b' }
  }
];

module.exports = containerNodes;
const { GRAPH_TYPES } = require('../../core/constants/graphTypes');
const { t } = require('../../i18n');

const arraysNodes = [
  {
    type: 'array:get_random_element',
    label: t('nodes:msg_9bb89d0e'),
    category: t('nodes:msg_016c515a'),
    graphType: GRAPH_TYPES.ALL,
    description: t('nodes:msg_5e1900c6'),
    evaluator: require('../../core/nodes/arrays/get_random_element').evaluate,
    computeInputs: () => [
      { id: 'array', name: t('nodes:msg_016c515a'), type: 'Array', required: true }
    ],
    computeOutputs: () => [
      { id: 'element', name: t('nodes:msg_101a1cd2'), type: 'Any' },
      { id: 'index', name: t('nodes:msg_84cf3af1'), type: 'Number' }
    ],
    defaultData: {}
  },
  {
    type: 'array:contains',
    label: t('nodes:msg_0f3db19c'),
    category: t('nodes:msg_016c515a'),
    graphType: GRAPH_TYPES.ALL,
    description: t('nodes:msg_0fcce352'),
    evaluator: require('../../core/nodes/arrays/contains').evaluate,
    computeInputs: () => [
      { id: 'array', name: t('nodes:msg_016c515a'), type: 'Array', required: true },
      { id: 'element', name: t('nodes:msg_101a1cd2'), type: 'Wildcard', required: true, inlineField: true }
    ],
    computeOutputs: () => [
      { id: 'result', name: t('nodes:msg_bcccb922'), type: 'Boolean' },
      { id: 'index', name: t('nodes:msg_84cf3af1'), type: 'Number' }
    ],
    defaultData: { element: null }
  },
  {
    type: 'array:get_by_index',
    label: t('nodes:msg_f557c7e4'),
    category: t('nodes:msg_016c515a'),
    graphType: GRAPH_TYPES.ALL,
    description: t('nodes:msg_9734ba9e'),
    evaluator: require('../../core/nodes/arrays/get_by_index').evaluate,
    computeInputs: (data) => [
      { id: 'array', name: t('nodes:msg_016c515a'), type: 'Array', required: true },
      { id: 'index', name: t('nodes:msg_84cf3af1'), type: 'Number', required: true, inlineField: true, placeholder: '0' }
    ],
    computeOutputs: () => [
      { id: 'element', name: t('nodes:msg_101a1cd2'), type: 'Any' }
    ],
    defaultData: { index: 0 }
  },
  {
    type: 'array:get_next',
    label: t('nodes:msg_4a3bfba0'),
    category: t('nodes:msg_016c515a'),
    graphType: GRAPH_TYPES.ALL,
    description: t('nodes:msg_f59e7f10'),
    evaluator: require('../../core/nodes/arrays/get_next').evaluate,
    computeInputs: (data) => [
      { id: 'array', name: t('nodes:msg_016c515a'), type: 'Array', required: true },
      { id: 'current_index', name: t('nodes:msg_55223148'), type: 'Number', required: true, inlineField: true, placeholder: '0' }
    ],
    computeOutputs: () => [
      { id: 'next_element', name: t('nodes:msg_e25c4079'), type: 'Any' },
      { id: 'next_index', name: t('nodes:msg_a35b0f3c'), type: 'Number' },
      { id: 'has_next', name: t('nodes:msg_5ccc8f65'), type: 'Boolean' }
    ],
    defaultData: { current_index: 0 }
  },
  {
    type: 'array:add_element',
    label: t('nodes:msg_e8c60076'),
    category: t('nodes:msg_016c515a'),
    graphType: GRAPH_TYPES.ALL,
    description: t('nodes:msg_f3410e6b'),
    evaluator: require('../../core/nodes/arrays/add_element').evaluate,
    computeInputs: () => [
      { id: 'array', name: t('nodes:msg_016c515a'), type: 'Array', required: true },
      { id: 'element', name: t('nodes:msg_101a1cd2'), type: 'Wildcard', required: true, inlineField: true }
    ],
    computeOutputs: () => [
      { id: 'result', name: t('nodes:msg_23c49210'), type: 'Array' }
    ],
    defaultData: { element: null }
  },
  {
    type: 'array:remove_by_index',
    label: t('nodes:msg_aeaad9a4'),
    category: t('nodes:msg_016c515a'),
    graphType: GRAPH_TYPES.ALL,
    description: t('nodes:msg_e4ec5485'),
    evaluator: require('../../core/nodes/arrays/remove_by_index').evaluate,
    computeInputs: (data) => [
      { id: 'array', name: t('nodes:msg_016c515a'), type: 'Array', required: true },
      { id: 'index', name: t('nodes:msg_84cf3af1'), type: 'Number', required: true, inlineField: true, placeholder: '0' }
    ],
    computeOutputs: () => [
      { id: 'result', name: t('nodes:msg_23c49210'), type: 'Array' }
    ],
    defaultData: { index: 0 }
  },
  {
    type: 'array:find_index',
    label: t('nodes:msg_6994268b'),
    category: t('nodes:msg_016c515a'),
    graphType: GRAPH_TYPES.ALL,
    description: t('nodes:msg_8afd0424'),
    evaluator: require('../../core/nodes/arrays/find_index').evaluate,
    computeInputs: () => [
      { id: 'array', name: t('nodes:msg_016c515a'), type: 'Array', required: true },
      { id: 'element', name: t('nodes:msg_101a1cd2'), type: 'Wildcard', required: true, inlineField: true }
    ],
    computeOutputs: () => [
      { id: 'index', name: t('nodes:msg_84cf3af1'), type: 'Number' }
    ],
    defaultData: { element: null }
  },
  {
    type: 'array:join',
    label: t('nodes:msg_2159c336'),
    category: t('nodes:msg_016c515a'),
    graphType: GRAPH_TYPES.ALL,
    description: t('nodes:msg_75ab2a3d'),
    evaluator: require('../../core/nodes/arrays/join').evaluate,
    computeInputs: (data) => [
      { id: 'array', name: t('nodes:msg_016c515a'), type: 'Array', required: false },
      { id: 'separator', name: t('nodes:msg_f669cada'), type: 'String', required: false, inlineField: true, placeholder: ',' }
    ],
    computeOutputs: () => [
      { id: 'result', name: 'Result', type: 'String' }
    ],
    defaultData: { separator: ',' }
  },
  {
    type: 'array:shuffle',
    label: t('nodes:msg_b7be196e'),
    category: t('nodes:msg_016c515a'),
    graphType: GRAPH_TYPES.ALL,
    description: t('nodes:msg_0351d736'),
    evaluator: require('../../core/nodes/arrays/shuffle').evaluate,
    computeInputs: () => [
      { id: 'array', name: t('nodes:msg_016c515a'), type: 'Array', required: true }
    ],
    computeOutputs: () => [
      { id: 'shuffled', name: t('nodes:msg_eb1a6f4d'), type: 'Array' }
    ],
    defaultData: {}
  }
];

module.exports = arraysNodes;
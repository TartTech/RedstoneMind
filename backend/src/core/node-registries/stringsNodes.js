const { GRAPH_TYPES } = require('../../core/constants/graphTypes');
const { t } = require('../../i18n');

const stringsNodes = [
  {
    type: 'string:contains',
    label: t('nodes:msg_e63edd4e'),
    category: t('nodes:msg_4c06f405'),
    description: t('nodes:msg_25f68ea9'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/strings/contains').evaluate,
    computeInputs: (data) => [
      { id: 'haystack', name: t('nodes:msg_68a64514'), type: 'String', required: true, inlineField: true, placeholder: '' },
      { id: 'needle', name: t('nodes:msg_2053bd52'), type: 'String', required: true, inlineField: true, placeholder: '' },
      { id: 'case_sensitive', name: t('nodes:msg_8487f246'), type: 'Boolean', required: false, inlineField: true }
    ],
    computeOutputs: () => [
      { id: 'result', name: t('nodes:msg_a3671d5c'), type: 'Boolean' }
    ],
    defaultData: { haystack: '', needle: '', case_sensitive: false }
  },
  {
    type: 'string:matches',
    label: t('nodes:msg_ffdd674a'),
    category: t('nodes:msg_4c06f405'),
    description: t('nodes:msg_10355826'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/strings/matches').evaluate,
    computeInputs: (data) => [
      { id: 'string', name: t('nodes:msg_68a64514'), type: 'String', required: true, inlineField: true, placeholder: '' },
      { id: 'regex', name: 'RegEx', type: 'String', required: true, inlineField: true, placeholder: '' }
    ],
    computeOutputs: () => [
      { id: 'result', name: t('nodes:msg_db1f49e2'), type: 'Boolean' }
    ],
    defaultData: { string: '', regex: '' }
  },
  {
    type: 'string:equals',
    label: t('nodes:msg_c67fe7a3'),
    category: t('nodes:msg_4c06f405'),
    description: t('nodes:msg_8dfec5d1'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/strings/equals').evaluate,
    computeInputs: (data) => [
      { id: 'a', name: 'A', type: 'String', required: true, inlineField: true, placeholder: '' },
      { id: 'b', name: 'B', type: 'String', required: true, inlineField: true, placeholder: '' },
      { id: 'case_sensitive', name: t('nodes:msg_8487f246'), type: 'Boolean', required: false, inlineField: true }
    ],
    computeOutputs: () => [
      { id: 'result', name: t('nodes:msg_28ea558d'), type: 'Boolean' }
    ],
    defaultData: { a: '', b: '', case_sensitive: false }
  },
  {
    type: 'string:starts_with',
    label: t('nodes:msg_a5ef1636'),
    category: t('nodes:msg_4c06f405'),
    description: t('nodes:msg_619400af'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/strings/starts_with').evaluate,
    computeInputs: (data) => [
      { id: 'string', name: t('nodes:msg_68a64514'), type: 'String', required: true, inlineField: true, placeholder: '' },
      { id: 'prefix', name: t('nodes:msg_3e8df77e'), type: 'String', required: true, inlineField: true, placeholder: '' },
      { id: 'case_sensitive', name: t('nodes:msg_8487f246'), type: 'Boolean', required: false, inlineField: true }
    ],
    computeOutputs: () => [
      { id: 'result', name: t('nodes:msg_64b2ab72'), type: 'Boolean' }
    ],
    defaultData: { string: '', prefix: '', case_sensitive: false }
  },
  {
    type: 'string:ends_with',
    label: t('nodes:msg_3883c059'),
    category: t('nodes:msg_4c06f405'),
    description: t('nodes:msg_faf93eff'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/strings/ends_with').evaluate,
    computeInputs: (data) => [
      { id: 'string', name: t('nodes:msg_68a64514'), type: 'String', required: true, inlineField: true, placeholder: '' },
      { id: 'suffix', name: t('nodes:msg_45e1de67'), type: 'String', required: true, inlineField: true, placeholder: '' },
      { id: 'case_sensitive', name: t('nodes:msg_8487f246'), type: 'Boolean', required: false, inlineField: true }
    ],
    computeOutputs: () => [
      { id: 'result', name: t('nodes:msg_52cc9d6b'), type: 'Boolean' }
    ],
    defaultData: { string: '', suffix: '', case_sensitive: false }
  },
  {
    type: 'string:length',
    label: t('nodes:msg_bf07256f'),
    category: t('nodes:msg_4c06f405'),
    description: t('nodes:msg_a6f881f6'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/strings/length').evaluate,
    computeInputs: (data) => [
      { id: 'string', name: t('nodes:msg_68a64514'), type: 'String', required: true, inlineField: true, placeholder: '' }
    ],
    computeOutputs: () => [
      { id: 'length', name: t('nodes:msg_86fbf51c'), type: 'Number' }
    ],
    defaultData: { string: '' }
  },
  {
    type: 'string:split',
    label: t('nodes:msg_e69e8e79'),
    category: t('nodes:msg_4c06f405'),
    description: t('nodes:msg_e0af16e4'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/strings/split').evaluate,
    computeInputs: (data) => [
      { id: 'string', name: t('nodes:msg_68a64514'), type: 'String', required: true, inlineField: true, placeholder: '' },
      { id: 'separator', name: t('nodes:msg_f669cada'), type: 'String', required: true, inlineField: true, placeholder: ',' }
    ],
    computeOutputs: () => [
      { id: 'array', name: t('nodes:msg_016c515a'), type: 'Array' }
    ],
    defaultData: { string: '', separator: ',' }
  },
  {
    type: 'string:concat',
    label: t('nodes:msg_632821e3'),
    category: t('nodes:msg_4c06f405'),
    description: t('nodes:msg_1cf33b75'),
    graphType: GRAPH_TYPES.ALL,
    dynamicPins: true,
    evaluator: require('../../core/nodes/strings/concat').evaluate,
    computeInputs: (data) => [],
    computeOutputs: () => [
      { id: 'result', name: t('nodes:msg_01332819'), type: 'String' }
    ],
    defaultData: {}
  },
  {
    type: 'string:to_upper',
    label: t('nodes:msg_6e86f50c'),
    category: t('nodes:msg_4c06f405'),
    description: t('nodes:msg_9ee865c5'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/strings/to_upper').evaluate,
    computeInputs: (data) => [
      { id: 'text', name: t('nodes:msg_8c45d9cf'), type: 'String', required: false, inlineField: true, placeholder: '' }
    ],
    computeOutputs: () => [
      { id: 'result', name: 'Result', type: 'String' }
    ],
    defaultData: { text: '' }
  },
  {
    type: 'string:to_lower',
    label: t('nodes:msg_652abddd'),
    category: t('nodes:msg_4c06f405'),
    description: t('nodes:msg_c788b53e'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/strings/to_lower').evaluate,
    computeInputs: (data) => [
      { id: 'text', name: t('nodes:msg_8c45d9cf'), type: 'String', required: false, inlineField: true, placeholder: '' }
    ],
    computeOutputs: () => [
      { id: 'result', name: 'Result', type: 'String' }
    ],
    defaultData: { text: '' }
  }
];

module.exports = stringsNodes;

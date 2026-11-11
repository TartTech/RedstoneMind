const { GRAPH_TYPES } = require('../../core/constants/graphTypes');

const navigationNodes = [
  {
    type: 'navigation:go_to',
    label: t('nodes:msg_4ba80fbc'),
    category: t('nodes:msg_ca76de31'),
    description: t('nodes:msg_d2ecb434'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/navigation/go_to').execute,
    evaluator: require('../../core/nodes/navigation/go_to').evaluate,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'x', name: 'X', type: 'Number', required: false, inlineField: true, placeholder: '0' },
      { id: 'y', name: 'Y', type: 'Number', required: false, inlineField: true, placeholder: '64' },
      { id: 'z', name: 'Z', type: 'Number', required: false, inlineField: true, placeholder: '0' },
      { id: 'range', name: t('nodes:msg_136b24ff'), type: 'Number', required: false, inlineField: true, placeholder: '1' }
    ],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_2e7c20d0'), type: 'Exec' },
      { id: 'exec_failed', name: t('nodes:error_b1fb87eb'), type: 'Exec' },
      { id: 'success', name: t('nodes:msg_b4341414'), type: 'Boolean' }
    ],
    defaultData: { x: 0, y: 64, z: 0, range: 1 },
    theme: { headerColor: '#3b82f6', accentColor: '#60a5fa' }
  },
  {
    type: 'navigation:go_to_player',
    label: t('nodes:msg_5b71af87'),
    category: t('nodes:msg_ca76de31'),
    description: t('nodes:msg_2f1277b3'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/navigation/go_to_player').execute,
    evaluator: require('../../core/nodes/navigation/go_to_player').evaluate,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'playerName', name: t('nodes:msg_324974af'), type: 'String', required: true, inlineField: true, placeholder: 'Steve' },
      { id: 'range', name: t('nodes:msg_136b24ff'), type: 'Number', required: false, inlineField: true, placeholder: '3' }
    ],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_2e7c20d0'), type: 'Exec' },
      { id: 'exec_failed', name: t('nodes:error_b1fb87eb'), type: 'Exec' },
      { id: 'success', name: t('nodes:msg_b4341414'), type: 'Boolean' },
      { id: 'playerPosition', name: t('nodes:msg_f7c9720f'), type: 'Object' }
    ],
    defaultData: { playerName: '', range: 3 },
    theme: { headerColor: '#3b82f6', accentColor: '#60a5fa' }
  },
  {
    type: 'navigation:go_to_entity',
    label: t('nodes:msg_81a99690'),
    category: t('nodes:msg_ca76de31'),
    description: t('nodes:msg_e8b2c750'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/navigation/go_to_entity').execute,
    evaluator: require('../../core/nodes/navigation/go_to_entity').evaluate,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'entity', name: t('nodes:msg_de2925f0'), type: 'Object', required: true, inlineField: false },
      { id: 'range', name: t('nodes:msg_136b24ff'), type: 'Number', required: false, inlineField: true, placeholder: '3' }
    ],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_2e7c20d0'), type: 'Exec' },
      { id: 'exec_failed', name: t('nodes:error_b1fb87eb'), type: 'Exec' },
      { id: 'success', name: t('nodes:msg_b4341414'), type: 'Boolean' }
    ],
    defaultData: { range: 3 },
    theme: { headerColor: '#3b82f6', accentColor: '#60a5fa' }
  },
  {
    type: 'navigation:follow',
    label: t('nodes:msg_bc4bf62b'),
    category: t('nodes:msg_ca76de31'),
    description: t('nodes:msg_4ab13f08'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/navigation/follow').execute,
    evaluator: require('../../core/nodes/navigation/follow').evaluate,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'target', name: t('nodes:msg_55ea7d29'), type: 'String', required: true, inlineField: true, placeholder: 'Steve' },
      { id: 'range', name: t('nodes:msg_0cf3e2c9'), type: 'Number', required: false, inlineField: true, placeholder: '5' }
    ],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_48755df3'), type: 'Exec' },
      { id: 'following', name: t('nodes:msg_fb0cf45a'), type: 'Boolean' }
    ],
    defaultData: { target: '', range: 5 },
    theme: { headerColor: '#3b82f6', accentColor: '#60a5fa' }
  },
  {
    type: 'navigation:stop',
    label: t('nodes:msg_13ed7bb7'),
    category: t('nodes:msg_ca76de31'),
    description: t('nodes:msg_74852b6a'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/navigation/stop').execute,
    evaluator: require('../../core/nodes/navigation/stop').evaluate,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' }
    ],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:success_c665d401'), type: 'Exec' }
    ],
    defaultData: {},
    theme: { headerColor: '#3b82f6', accentColor: '#60a5fa' }
  },
  {
    type: 'navigation:step',
    label: t('nodes:msg_c29d6c55'),
    category: t('nodes:msg_ca76de31'),
    description: t('nodes:msg_198c3c57'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/navigation/step').execute,
    evaluator: require('../../core/nodes/navigation/step').evaluate,
const { t } = require('../../i18n');
    computeInputs: () => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      {
        id: 'direction',
        name: t('nodes:msg_e4de6223'),
        type: 'String',
        required: false,
        inlineField: true,
        inlineFieldType: 'select',
        defaultValue: 'forward',
        inlineFieldOptions: [
          { value: 'forward', label: t('nodes:msg_4682763e') },
          { value: 'back', label: t('nodes:msg_2b0b0225') },
          { value: 'left', label: t('nodes:msg_1af1a604') },
          { value: 'right', label: t('nodes:msg_c3163ced') },
        ],
      },
      { id: 'distance', name: t('nodes:msg_aafeec5c'), type: 'Number', required: false, inlineField: true, placeholder: '1' },
    ],
    computeOutputs: () => [
      { id: 'exec', name: t('nodes:msg_2e7c20d0'), type: 'Exec' },
      { id: 'exec_failed', name: t('nodes:error_b1fb87eb'), type: 'Exec' },
      { id: 'x', name: 'X', type: 'Number' },
      { id: 'y', name: 'Y', type: 'Number' },
      { id: 'z', name: 'Z', type: 'Number' },
      { id: 'success', name: t('nodes:msg_b4341414'), type: 'Boolean' },
    ],
    defaultData: { direction: 'forward', distance: 1 },
    theme: { headerColor: '#3b82f6', accentColor: '#60a5fa' },
  }
];

module.exports = navigationNodes;
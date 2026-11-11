const { GRAPH_TYPES } = require('../../core/constants/graphTypes');

const objectsNodes = [
  {
    type: 'object:create',
    label: t('nodes:msg_58e36241'),
    category: t('nodes:msg_4c243872'),
    description: t('nodes:msg_188e9da9'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/objects/create').evaluate,
    computeInputs: () => [],
    computeOutputs: () => [
      { id: 'object', name: t('nodes:msg_4c243872'), type: 'Object' }
    ],
    defaultData: {},
    theme: { headerColor: '#8b5cf6', accentColor: '#a78bfa' }
  },
  {
    type: 'object:get',
    label: t('nodes:msg_4384df04'),
    category: t('nodes:msg_4c243872'),
    description: t('nodes:msg_901b36d5'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/objects/get').evaluate,
    computeInputs: (data) => [
      { id: 'object', name: t('nodes:msg_4c243872'), type: 'Object', required: true },
      { id: 'key', name: t('nodes:msg_62527274'), type: 'String', required: true, inlineField: true, placeholder: 'key...' }
    ],
    computeOutputs: () => [
      { id: 'value', name: t('nodes:msg_7b46d8cc'), type: 'Any' }
    ],
    defaultData: { key: '' },
    theme: { headerColor: '#8b5cf6', accentColor: '#a78bfa' }
  },
  {
    type: 'object:set',
    label: t('nodes:msg_2fbdd15d'),
    category: t('nodes:msg_4c243872'),
    description: t('nodes:msg_9ad99f23'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/objects/set').evaluate,
    computeInputs: (data) => [
      { id: 'object', name: t('nodes:msg_4c243872'), type: 'Object', required: true },
      { id: 'key', name: t('nodes:msg_62527274'), type: 'String', required: true, inlineField: true, placeholder: 'key...' },
      { id: 'value', name: t('nodes:msg_7b46d8cc'), type: 'Any', required: true }
    ],
    computeOutputs: () => [
      { id: 'new_object', name: t('nodes:msg_ab2d6350'), type: 'Object' }
    ],
    defaultData: { key: '' },
    theme: { headerColor: '#8b5cf6', accentColor: '#a78bfa' }
  },
  {
    type: 'object:delete',
    label: t('nodes:msg_1d245402'),
    category: t('nodes:msg_4c243872'),
    description: t('nodes:msg_b00ebd8c'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/objects/delete').evaluate,
    computeInputs: (data) => [
      { id: 'object', name: t('nodes:msg_4c243872'), type: 'Object', required: true },
      { id: 'key', name: t('nodes:msg_62527274'), type: 'String', required: true, inlineField: true, placeholder: 'key...' }
    ],
    computeOutputs: () => [
      { id: 'new_object', name: t('nodes:msg_ab2d6350'), type: 'Object' }
    ],
    defaultData: { key: '' },
    theme: { headerColor: '#8b5cf6', accentColor: '#a78bfa' }
  },
  {
    type: 'object:has_key',
    label: t('nodes:msg_5c3af5c5'),
    category: t('nodes:msg_4c243872'),
    description: t('nodes:msg_6fc83c64'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/objects/has_key').evaluate,
const { t } = require('../../i18n');
    computeInputs: (data) => [
      { id: 'object', name: t('nodes:msg_4c243872'), type: 'Object', required: true },
      { id: 'key', name: t('nodes:msg_62527274'), type: 'String', required: true, inlineField: true, placeholder: 'key...' }
    ],
    computeOutputs: () => [
      { id: 'result', name: t('nodes:msg_bcccb922'), type: 'Boolean' },
      { id: 'value', name: t('nodes:msg_7b46d8cc'), type: 'Any' }
    ],
    defaultData: { key: '' },
    theme: { headerColor: '#8b5cf6', accentColor: '#a78bfa' }
  }
];

module.exports = objectsNodes;
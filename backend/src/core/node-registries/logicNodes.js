const { GRAPH_TYPES } = require('../../core/constants/graphTypes');
const { t } = require('../../i18n');

const logicNodes = [
  {
    type: 'logic:operation',
    label: t('nodes:msg_cd0a3de6'),
    category: t('nodes:msg_710db0c0'),
    description: t('nodes:msg_f52045a3'),
    graphType: GRAPH_TYPES.ALL,
    dynamicPins: true,
    evaluator: require('../../core/nodes/logic/operation').evaluate,
    computeInputs: (data) => [
      { id: 'a', name: 'A', type: 'Boolean', required: true, inlineField: true },
      { id: 'b', name: 'B', type: 'Boolean', required: true, inlineField: true }
    ],
    computeOutputs: () => [
      { id: 'result', name: t('nodes:msg_01332819'), type: 'Boolean' }
    ],
    defaultData: {}
  },
  {
    type: 'logic:compare',
    label: t('nodes:msg_04c05778'),
    category: t('nodes:msg_710db0c0'),
    description: t('nodes:msg_e64b93c6'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/logic/compare').evaluate,
    computeInputs: (data) => [
      { id: 'a', name: 'A', type: 'Wildcard', required: false, inlineField: true },
      { id: 'b', name: 'B', type: 'Wildcard', required: false, inlineField: true }
    ],
    computeOutputs: () => [
      { id: 'result', name: t('nodes:msg_01332819'), type: 'Boolean' }
    ],
    defaultData: {}
  },
  {
    type: 'logic:not',
    label: t('nodes:msg_115a6c5d'),
    category: t('nodes:msg_710db0c0'),
    description: t('nodes:msg_557e400d'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/logic/not').evaluate,
    computeInputs: (data) => [
      { id: 'value', name: t('nodes:msg_7b46d8cc'), type: 'Boolean', required: false, inlineField: true }
    ],
    computeOutputs: () => [
      { id: 'result', name: t('nodes:msg_01332819'), type: 'Boolean' }
    ],
    defaultData: { value: false }
  }
];

module.exports = logicNodes;

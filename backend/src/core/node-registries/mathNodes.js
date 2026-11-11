const { GRAPH_TYPES } = require('../../core/constants/graphTypes');

const mathNodes = [
  {
    type: 'math:operation',
    label: t('nodes:msg_2e8b5c54'),
    category: t('nodes:msg_32ae3aeb'),
    description: t('nodes:msg_133f4caa'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/math/operation').evaluate,
    computeInputs: (data) => [
      { id: 'a', name: 'A', type: 'Number', required: true, inlineField: true, placeholder: '0' },
      { id: 'b', name: 'B', type: 'Number', required: true, inlineField: true, placeholder: '0' }
    ],
    computeOutputs: () => [
      { id: 'result', name: t('nodes:msg_01332819'), type: 'Number' }
    ],
    defaultData: { a: 0, b: 0 }
  },
  {
    type: 'math:random_number',
    label: t('nodes:msg_564e164c'),
    category: t('nodes:msg_32ae3aeb'),
    graphType: GRAPH_TYPES.ALL,
    description: t('nodes:msg_3a6ea93f'),
    evaluator: require('../../core/nodes/math/random_number').evaluate,
const { t } = require('../../i18n');
    computeInputs: (data) => [
      { id: 'min', name: t('nodes:msg_7928c27e'), type: 'Number', required: false, inlineField: true, placeholder: '0' },
      { id: 'max', name: t('nodes:msg_3e4038c4'), type: 'Number', required: false, inlineField: true, placeholder: '100' }
    ],
    computeOutputs: () => [
      { id: 'result', name: t('nodes:msg_01332819'), type: 'Number' }
    ],
    defaultData: { min: 0, max: 100 }
  }
];

module.exports = mathNodes;

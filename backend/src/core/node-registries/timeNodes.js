const { GRAPH_TYPES } = require('../constants/graphTypes');

const timeNodes = [
  {
    type: 'time:datetime_literal',
    label: t('nodes:msg_c85a796f'),
    category: t('nodes:msg_3e729b34'),
    description: t('nodes:msg_53d93351'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../nodes/data/datetime_literal').evaluate,
    computeInputs: (data) => [
      { id: 'date', name: t('nodes:msg_867b763a'), type: 'String', required: false, inlineField: true, placeholder: '2024-01-01 12:00' }
    ],
    computeOutputs: (data) => [
      { id: 'value', name: t('nodes:msg_8cdd8bb7'), type: 'DateTime' }
    ],
    defaultData: { date: '' },
    theme: { headerColor: '#d97706', accentColor: '#f59e0b' }
  },
  {
    type: 'time:now',
    label: t('nodes:msg_372f5e3e'),
    category: t('nodes:msg_3e729b34'),
    description: t('nodes:msg_a895ec9d'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../nodes/time/now').evaluate,
    computeInputs: () => [],
    computeOutputs: () => [
      { id: 'now', name: t('nodes:msg_2c2777ef'), type: 'DateTime' }
    ],
    defaultData: {},
    theme: { headerColor: '#d97706', accentColor: '#f59e0b' }
  },
  {
    type: 'time:format',
    label: t('nodes:msg_38cce9ad'),
    category: t('nodes:msg_3e729b34'),
    description: t('nodes:msg_50227a38'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../nodes/time/format').evaluate,
    computeInputs: (data) => [
      { id: 'date', name: t('nodes:msg_8cdd8bb7'), type: 'DateTime', required: true, inlineField: true, placeholder: '' },
      { id: 'format', name: t('nodes:msg_f8331b9a'), type: 'String', required: false, inlineField: true, placeholder: 'yyyy-MM-dd HH:mm:ss' }
    ],
    computeOutputs: (data) => [
      { id: 'formatted', name: t('nodes:msg_68a64514'), type: 'String' }
    ],
    defaultData: { format: 'yyyy-MM-dd HH:mm:ss' },
    theme: { headerColor: '#d97706', accentColor: '#f59e0b' }
  },
  {
    type: 'time:add',
    label: t('nodes:msg_1e47e91f'),
    category: t('nodes:msg_3e729b34'),
    description: 'Добавляет к дате указанный промежуток времени. Пример объекта продолжительности: { "seconds": 5, "minutes": 1 }',
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../nodes/time/add').evaluate,
    computeInputs: (data) => [
      { id: 'date', name: t('nodes:msg_8cdd8bb7'), type: 'DateTime', required: true, inlineField: true, placeholder: '' },
      { id: 'duration', name: t('nodes:msg_d6bf564f'), type: 'Object', required: true, inlineField: true, placeholder: '{ seconds: 5 }' }
    ],
    computeOutputs: (data) => [
      { id: 'result', name: t('nodes:msg_18252c5f'), type: 'DateTime' }
    ],
    defaultData: { duration: null },
    theme: { headerColor: '#d97706', accentColor: '#f59e0b' }
  },
  {
    type: 'time:diff',
    label: t('nodes:msg_db95a6e0'),
    category: t('nodes:msg_3e729b34'),
    description: t('nodes:msg_ceccd049'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../nodes/time/diff').evaluate,
    computeInputs: (data) => [
      { id: 'date_left', name: t('nodes:msg_50e059f7'), type: 'DateTime', required: true, inlineField: true, placeholder: '' },
      { id: 'date_right', name: t('nodes:msg_0530d8fa'), type: 'DateTime', required: true, inlineField: true, placeholder: '' }
    ],
    computeOutputs: (data) => [
      { id: 'diff', name: t('nodes:msg_1c919bbd'), type: 'Number' }
    ],
    defaultData: {},
    theme: { headerColor: '#d97706', accentColor: '#f59e0b' }
  },
  {
    type: 'time:compare',
    label: t('nodes:msg_9300a0c6'),
    category: t('nodes:msg_3e729b34'),
    description: t('nodes:msg_2563cb7d'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../nodes/time/compare').evaluate,
const { t } = require('../../i18n');
    computeInputs: (data) => [
      { id: 'date_left', name: t('nodes:msg_50e059f7'), type: 'DateTime', required: true, inlineField: true, placeholder: '' },
      { id: 'date_right', name: t('nodes:msg_0530d8fa'), type: 'DateTime', required: true, inlineField: true, placeholder: '' },
      { id: 'operation', name: t('nodes:msg_b480476b'), type: 'String', required: false, inlineField: true, placeholder: 'before|after|equal' }
    ],
    computeOutputs: (data) => [
      { id: 'result', name: t('nodes:msg_01332819'), type: 'Boolean' }
    ],
    defaultData: { operation: '' },
    theme: { headerColor: '#d97706', accentColor: '#f59e0b' }
  }
];

module.exports = timeNodes;
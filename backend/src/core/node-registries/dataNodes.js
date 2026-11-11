const { GRAPH_TYPES } = require('../../core/constants/graphTypes');
const { t } = require('../../i18n');

const dataNodes = [
  {
    type: 'data:get_argument',
    label: t('nodes:msg_87cfd295'),
    category: t('nodes:msg_145f378b'),
    description: t('nodes:msg_db1e8f1d'),
    graphType: GRAPH_TYPES.COMMAND,
    evaluator: require('../../core/nodes/data/get_argument').evaluate,
    computeInputs: (data) => [],
    computeOutputs: (data) => [
      { id: 'value', name: t('nodes:msg_7b46d8cc'), type: 'Any' },
      { id: 'exists', name: t('nodes:msg_9cfb54f7'), type: 'Boolean' }
    ],
    defaultData: { argumentName: '' }
  },
  {
    type: 'data:get_variable',
    label: t('nodes:msg_4b91e117'),
    category: t('nodes:msg_145f378b'),
    description: t('nodes:msg_09d35d22'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/data/get_variable').evaluate,
    computeInputs: (data) => [],
    computeOutputs: (data) => [
      { id: 'value', name: t('nodes:msg_7b46d8cc'), type: 'Wildcard' }
    ],
    defaultData: {}
  },
  {
    type: 'data:get_entity_field',
    label: t('nodes:msg_3bfded82'),
    category: t('nodes:msg_145f378b'),
    description: 'Получает определенное поле из объекта сущности (например, "position.x", "username").',
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/data/get_entity_field').evaluate,
    computeInputs: (data) => [
      { id: 'entity', name: t('nodes:msg_de2925f0'), type: 'Object', required: true }
    ],
    computeOutputs: (data) => [
      { id: 'username', name: t('nodes:msg_3fea2b66'), type: 'String' },
      { id: 'type', name: t('nodes:msg_345805b8'), type: 'String' },
      { id: 'position', name: t('nodes:msg_3b5f2ce0'), type: 'Object' },
      { id: 'isValid', name: t('nodes:msg_1f6afced'), type: 'Boolean' }
    ],
    defaultData: {}
  },
  {
    type: 'data:string_literal',
    label: t('nodes:msg_daec864e'),
    category: t('nodes:msg_145f378b'),
    description: t('nodes:msg_bd90fde8'),
    graphType: GRAPH_TYPES.ALL,
    dynamicPins: true,
    evaluator: require('../../core/nodes/data/string_literal').evaluate,
    computeInputs: (data) => [],
    computeOutputs: (data) => [
      { id: 'value', name: t('nodes:msg_7b46d8cc'), type: 'String' }
    ],
    defaultData: {}
  },
  {
    type: 'data:number_literal',
    label: t('nodes:msg_791d171f'),
    category: t('nodes:msg_145f378b'),
    description: t('nodes:msg_599bdd89'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/data/number_literal').evaluate,
    computeInputs: (data) => [
      { id: 'value', name: t('nodes:msg_7b46d8cc'), type: 'Number', required: true, inlineField: true, placeholder: '0' }
    ],
    computeOutputs: (data) => [
      { id: 'value', name: t('nodes:msg_7b46d8cc'), type: 'Number' }
    ],
    defaultData: { value: 0 }
  },
  {
    type: 'data:boolean_literal',
    label: t('nodes:msg_eb10dcb1'),
    category: t('nodes:msg_145f378b'),
    description: t('nodes:msg_503d20b5'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/data/boolean_literal').evaluate,
    computeInputs: (data) => [
      { id: 'value', name: t('nodes:msg_7b46d8cc'), type: 'Boolean', required: true, inlineField: true, placeholder: 'true' }
    ],
    computeOutputs: (data) => [
      { id: 'value', name: t('nodes:msg_7b46d8cc'), type: 'Boolean' }
    ],
    defaultData: { value: true }
  },
  {
    type: 'data:make_object',
    label: t('nodes:msg_cb38bb80'),
    category: t('nodes:msg_145f378b'),
    description: t('nodes:msg_8b5ec5ad'),
    graphType: GRAPH_TYPES.ALL,
    dynamicPins: true,
    evaluator: require('../../core/nodes/data/make_object').evaluate,
    computeInputs: (data) => [],
    computeOutputs: (data) => [
      { id: 'value', name: t('nodes:msg_4c243872'), type: 'Object' }
    ],
    defaultData: {}
  },
  {
    type: 'data:cast',
    label: t('nodes:msg_22bbcd45'),
    category: t('nodes:msg_145f378b'),
    description: t('nodes:msg_bf8fa9b2'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/data/cast').evaluate,
    computeInputs: (data) => [
      { id: 'value', name: t('nodes:msg_7b46d8cc'), type: 'Wildcard', required: true }
    ],
    computeOutputs: (data) => [
      { id: 'result', name: t('nodes:msg_01332819'), type: 'Wildcard' }
    ],
    defaultData: { targetType: 'String' }
  },
  {
    type: 'data:type_check',
    label: t('nodes:msg_b169ea51'),
    category: t('nodes:msg_145f378b'),
    description: t('nodes:msg_a64f7210'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/data/type_check').evaluate,
    computeInputs: (data) => [
      { id: 'value', name: t('nodes:msg_7b46d8cc'), type: 'Wildcard', required: true }
    ],
    computeOutputs: (data) => [
      { id: 'result', name: t('nodes:msg_db1f49e2'), type: 'Boolean', description: t('nodes:msg_614cfe63') },
      { id: 'type_name', name: t('nodes:msg_2d3935d7'), type: 'String', description: t('nodes:msg_033369d6') }
    ],
    defaultData: { checkType: 'String' }
  },
  {
    type: 'data:get_server_players',
    label: t('nodes:msg_37988516'),
    category: t('nodes:msg_145f378b'),
    graphType: GRAPH_TYPES.ALL,
    description: t('nodes:msg_882a4d71'),
    evaluator: require('../../core/nodes/data/get_server_players').evaluate,
    computeInputs: (data) => [],
    computeOutputs: (data) => [
      { id: 'players', name: t('nodes:msg_785b1b98'), type: 'Array' }
    ],
    defaultData: {}
  },
  {
    type: 'data:get_nearby_entities',
    label: t('nodes:msg_c8aa75ef'),
    category: t('nodes:msg_145f378b'),
    description: t('nodes:msg_0b1ef320'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/data/get_nearby_entities').evaluate,
    computeInputs: (data) => [
      { id: 'radius', name: t('nodes:msg_136b24ff'), type: 'Number', required: false, inlineField: true, placeholder: '10' }
    ],
    computeOutputs: (data) => [
      { id: 'entities', name: t('nodes:msg_dcfb6366'), type: 'Array' }
    ],
    defaultData: { radius: 10 }
  },
  {
    type: 'data:get_nearby_players',
    label: t('nodes:msg_c36ed494'),
    category: t('nodes:msg_145f378b'),
    description: t('nodes:msg_1a9f3a3f'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/data/get_nearby_players').evaluate,
    computeInputs: (data) => [
      { id: 'radius', name: t('nodes:msg_136b24ff'), type: 'Number', required: false, inlineField: true, placeholder: '10' }
    ],
    computeOutputs: (data) => [
      { id: 'players', name: t('nodes:msg_785b1b98'), type: 'Array' }
    ],
    defaultData: { radius: 10 }
  },
  {
    type: 'data:entity_info',
    label: t('nodes:msg_c2098e32'),
    category: t('nodes:msg_145f378b'),
    description: t('nodes:msg_05a91624'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/data/entity_info').evaluate,
    computeInputs: (data) => [
      { id: 'entity', name: t('nodes:msg_a8e03467'), type: 'Object', required: true }
    ],
    computeOutputs: (data) => [
      { id: 'type', name: t('nodes:msg_345805b8'), type: 'String' },
      { id: 'username', name: t('nodes:msg_d38d6d92'), type: 'String' },
      { id: 'distance', name: t('nodes:msg_c543302a'), type: 'Number' },
      { id: 'position', name: t('nodes:msg_3b5f2ce0'), type: 'Object' },
      { id: 'id', name: 'ID', type: 'Number' },
      { id: 'isPlayer', name: t('nodes:msg_39146193'), type: 'Boolean' }
    ],
    defaultData: {}
  },
  {
    type: 'data:get_user_field',
    label: t('nodes:msg_ba55fd8b'),
    category: t('nodes:msg_145f378b'),
    description: t('nodes:msg_547402a2'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/data/get_user_field').evaluate,
    computeInputs: (data) => [
      { id: 'user', name: t('nodes:msg_f154d6cc'), type: 'User', required: true }
    ],
    computeOutputs: (data) => [
      { id: 'username', name: t('nodes:msg_3fea2b66'), type: 'String' },
      { id: 'groups', name: t('nodes:msg_ebc417c9'), type: 'Array' },
      { id: 'permissions', name: t('nodes:msg_18c92238'), type: 'Array' },
      { id: 'isBlacklisted', name: t('nodes:msg_7a0fee1b'), type: 'Boolean' }
    ],
    defaultData: {}
  },
  {
    type: 'data:length',
    label: t('nodes:msg_0537be2b'),
    category: t('nodes:msg_016c515a'),
    graphType: GRAPH_TYPES.ALL,
    description: t('nodes:msg_bc838523'),
    evaluator: require('../../core/nodes/data/length').evaluate,
    computeInputs: (data) => [
      { id: 'data', name: t('nodes:msg_c3524396'), type: 'Any', required: true }
    ],
    computeOutputs: (data) => [
      { id: 'length', name: t('nodes:msg_86fbf51c'), type: 'Number' }
    ],
    defaultData: {}
  },
  {
    type: 'data:array_literal',
    label: t('nodes:msg_fd6bef83'),
    category: t('nodes:msg_016c515a'),
    description: t('nodes:msg_6d25e235'),
    graphType: GRAPH_TYPES.ALL,
    dynamicPins: true,
    evaluator: require('../../core/nodes/data/array_literal').evaluate,
    computeInputs: (data) => [],
    computeOutputs: (data) => [
      { id: 'value', name: t('nodes:msg_016c515a'), type: 'Array' }
    ],
    defaultData: {}
  },
  {
    type: 'data:store_read',
    label: t('nodes:msg_b2a3adf1'),
    category: t('nodes:msg_145f378b'),
    description: t('nodes:msg_9ea697d4'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/data/store_read').evaluate,
    computeInputs: (data) => [
      { id: 'plugin_name', name: t('nodes:msg_e0273c19'), type: 'String', required: true, inlineField: true, placeholder: 'my-plugin' },
      { id: 'key', name: t('nodes:msg_62527274'), type: 'String', required: true, inlineField: true, placeholder: 'myKey' }
    ],
    computeOutputs: (data) => [
      { id: 'value', name: t('nodes:msg_7b46d8cc'), type: 'Wildcard' }
    ],
    defaultData: { plugin_name: '', key: '' }
  },
  {
    type: 'data:store_write',
    label: t('nodes:msg_d772e7e7'),
    category: t('nodes:msg_145f378b'),
    description: t('nodes:msg_b5cd6585'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/data/store_write').execute,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec', required: true },
      { id: 'plugin_name', name: t('nodes:msg_e0273c19'), type: 'String', required: true, inlineField: true, placeholder: 'my-plugin' },
      { id: 'key', name: t('nodes:msg_62527274'), type: 'String', required: true, inlineField: true, placeholder: 'myKey' },
      { id: 'value', name: t('nodes:msg_7b46d8cc'), type: 'Wildcard', required: true }
    ],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_c4530912'), type: 'Exec' }
    ],
    defaultData: { plugin_name: '', key: '' }
  }
];

module.exports = dataNodes;

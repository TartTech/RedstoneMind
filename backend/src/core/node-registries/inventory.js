const { GRAPH_TYPES } = require('../../core/constants/graphTypes');

function registerNodes(registry) {
  registry.registerNodeType({
    type: 'inventory:get_all',
    label: t('nodes:msg_4b6f273c'),
    category: t('nodes:msg_1d4aa36d'),
    description: t('nodes:msg_70eef690'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/inventory/get_all').evaluate,
    computeInputs: () => [],
    computeOutputs: () => [
      { id: 'items', name: t('nodes:msg_49063cec'), type: 'Array' },
      { id: 'count', name: t('nodes:msg_ea1bccac'), type: 'Number' }
    ],
    defaultData: {},
    theme: { headerColor: '#f59e0b', accentColor: '#fbbf24' }
  });

  registry.registerNodeType({
    type: 'inventory:find_item',
    label: t('nodes:msg_04194507'),
    category: t('nodes:msg_1d4aa36d'),
    description: t('nodes:msg_14b3867d'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/inventory/find_item').evaluate,
    computeInputs: (data) => [
      { id: 'itemName', name: t('nodes:msg_f4183e1f'), type: 'String', required: true, inlineField: true, placeholder: 'diamond...' }
    ],
    computeOutputs: () => [
      { id: 'item', name: t('nodes:msg_444a3bce'), type: 'Object' },
      { id: 'found', name: t('nodes:msg_eb2b0556'), type: 'Boolean' },
      { id: 'slot', name: t('nodes:msg_38b55f06'), type: 'Number' }
    ],
    defaultData: { itemName: '' },
    theme: { headerColor: '#f59e0b', accentColor: '#fbbf24' }
  });

  registry.registerNodeType({
    type: 'inventory:count_item',
    label: t('nodes:msg_e978aaf3'),
    category: t('nodes:msg_1d4aa36d'),
    description: t('nodes:msg_9d730137'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/inventory/count_item').evaluate,
    computeInputs: (data) => [
      { id: 'itemName', name: t('nodes:msg_f4183e1f'), type: 'String', required: true, inlineField: true, placeholder: 'diamond...' }
    ],
    computeOutputs: () => [
      { id: 'count', name: t('nodes:msg_cb8bfd4d'), type: 'Number' }
    ],
    defaultData: { itemName: '' },
    theme: { headerColor: '#f59e0b', accentColor: '#fbbf24' }
  });

  registry.registerNodeType({
    type: 'inventory:has_item',
    label: t('nodes:msg_26258b79'),
    category: t('nodes:msg_1d4aa36d'),
    description: t('nodes:msg_07cf93b7'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/inventory/has_item').evaluate,
    computeInputs: (data) => [
      { id: 'itemName', name: t('nodes:msg_f4183e1f'), type: 'String', required: true, inlineField: true, placeholder: 'diamond...' },
      { id: 'minCount', name: t('nodes:msg_1227f4c7'), type: 'Number', required: false, inlineField: true, placeholder: '1' }
    ],
    computeOutputs: () => [
      { id: 'hasItem', name: t('nodes:msg_36ce463b'), type: 'Boolean' },
      { id: 'actualCount', name: t('nodes:msg_f8f8be50'), type: 'Number' }
    ],
    defaultData: { itemName: '', minCount: 1 },
    theme: { headerColor: '#f59e0b', accentColor: '#fbbf24' }
  });

  registry.registerNodeType({
    type: 'inventory:get_slot',
    label: t('nodes:msg_1d665b55'),
    category: t('nodes:msg_1d4aa36d'),
    description: t('nodes:msg_dea05ef6'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/inventory/get_slot').evaluate,
    computeInputs: (data) => [
      { id: 'slotNumber', name: t('nodes:msg_1fb7c923'), type: 'Number', required: true, inlineField: true, placeholder: '0' }
    ],
    computeOutputs: () => [
      { id: 'item', name: t('nodes:msg_444a3bce'), type: 'Object' },
      { id: 'isEmpty', name: t('nodes:msg_33ea3a31'), type: 'Boolean' }
    ],
    defaultData: { slotNumber: 0 },
    theme: { headerColor: '#f59e0b', accentColor: '#fbbf24' }
  });

  registry.registerNodeType({
    type: 'inventory:get_held_item',
    label: t('nodes:msg_dd80bacd'),
    category: t('nodes:msg_1d4aa36d'),
    description: t('nodes:msg_1483421e'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/inventory/get_held_item').evaluate,
    computeInputs: (data) => [
      { id: 'hand', name: t('nodes:msg_b37d0eb1'), type: 'String', required: false, inlineField: true, placeholder: 'mainhand' }
    ],
    computeOutputs: () => [
      { id: 'item', name: t('nodes:msg_444a3bce'), type: 'Object' },
      { id: 'name', name: t('nodes:msg_d38d6d92'), type: 'String' },
      { id: 'count', name: t('nodes:msg_cb8bfd4d'), type: 'Number' },
      { id: 'hasItem', name: t('nodes:msg_7832740f'), type: 'Boolean' }
    ],
    defaultData: { hand: 'mainhand' },
    theme: { headerColor: '#f59e0b', accentColor: '#fbbf24' }
  });

  registry.registerNodeType({
    type: 'inventory:equip',
    label: t('nodes:msg_9514e03b'),
    category: t('nodes:msg_1d4aa36d'),
    description: t('nodes:msg_dbdd80ea'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/inventory/equip').execute,
    evaluator: require('../../core/nodes/inventory/equip').evaluate,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'itemName', name: t('nodes:msg_444a3bce'), type: 'String', required: true, inlineField: true, placeholder: 'diamond_sword...' },
      { id: 'destination', name: t('nodes:msg_b60bd4b1'), type: 'String', required: false, inlineField: true, placeholder: 'hand' }
    ],
    computeOutputs: () => [
      { id: 'exec', name: t('nodes:success_c665d401'), type: 'Exec' },
      { id: 'success', name: t('nodes:msg_b4341414'), type: 'Boolean' }
    ],
    defaultData: { itemName: '', destination: 'hand' },
    theme: { headerColor: '#f59e0b', accentColor: '#fbbf24' }
  });

  registry.registerNodeType({
    type: 'inventory:drop',
    label: t('nodes:msg_b131089c'),
    category: t('nodes:msg_1d4aa36d'),
    description: t('nodes:msg_3234c592'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/inventory/drop').execute,
    evaluator: require('../../core/nodes/inventory/drop').evaluate,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'itemName', name: t('nodes:msg_444a3bce'), type: 'String', required: true, inlineField: true, placeholder: 'dirt...' },
      { id: 'count', name: t('nodes:msg_cb8bfd4d'), type: 'Number', required: false, inlineField: true, placeholder: t('nodes:msg_08a34eba') },
      { id: 'dropAll', name: t('nodes:msg_4d6f8b90'), type: 'Boolean', required: false, inlineField: true }
    ],
    computeOutputs: () => [
      { id: 'exec', name: t('nodes:success_c665d401'), type: 'Exec' },
      { id: 'dropped', name: t('nodes:msg_f6372c3b'), type: 'Number' }
    ],
    defaultData: { itemName: '', count: null, dropAll: false },
    theme: { headerColor: '#f59e0b', accentColor: '#fbbf24' }
  });

  registry.registerNodeType({
    type: 'inventory:select_slot',
    label: t('nodes:msg_a72ab3fd'),
    category: t('nodes:msg_1d4aa36d'),
    description: t('nodes:msg_1ae455c2'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/inventory/select_slot').execute,
    evaluator: require('../../core/nodes/inventory/select_slot').evaluate,
const { t } = require('../../i18n');
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'slot', name: t('nodes:msg_38b55f06'), type: 'Number', required: true, inlineField: true, placeholder: '0-8' }
    ],
    computeOutputs: () => [
      { id: 'exec', name: t('nodes:success_c665d401'), type: 'Exec' },
      { id: 'item', name: t('nodes:msg_444a3bce'), type: 'Object' }
    ],
    defaultData: { slot: 0 },
    theme: { headerColor: '#f59e0b', accentColor: '#fbbf24' }
  });
}

module.exports = { registerNodes };
const { GRAPH_TYPES } = require('../../core/constants/graphTypes');
const { t } = require('../../i18n');

const eventsNodes = [
  {
    type: 'event:command',
    label: t('nodes:msg_7735968b'),
    category: t('nodes:msg_227f8538'),
    description: t('nodes:msg_dbe75d77'),
    graphType: GRAPH_TYPES.ALL,
    computeInputs: () => [],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'command_name', name: t('nodes:msg_7b4954b8'), type: 'String' },
      { id: 'user', name: t('nodes:msg_f154d6cc'), type: 'User' },
      { id: 'args', name: t('nodes:msg_a90f6bbb'), type: 'Object' },
      { id: 'chat_type', name: t('nodes:msg_09248290'), type: 'String' },
      { id: 'success', name: t('nodes:success_0954b11a'), type: 'Boolean', description: t('nodes:msg_90b89813') }
    ],
    defaultData: {},
    theme: { headerColor: '#8b5cf6', accentColor: '#a78bfa' }
  },
  {
    type: 'event:chat',
    label: t('nodes:msg_afca24b8'),
    category: t('nodes:msg_227f8538'),
    description: t('nodes:msg_0709f480'),
    graphType: GRAPH_TYPES.EVENT,
    computeInputs: () => [],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'username', name: t('nodes:msg_a1c5a899'), type: 'String' },
      { id: 'message', name: t('nodes:msg_37157665'), type: 'String' },
      { id: 'chatType', name: t('nodes:msg_09248290'), type: 'String' }
    ],
    defaultData: {},
    theme: { headerColor: '#8b5cf6', accentColor: '#a78bfa' }
  },
  {
    type: 'event:raw_message',
    label: t('nodes:msg_cf5f3187'),
    category: t('nodes:msg_227f8538'),
    description: t('nodes:msg_3a80ec01'),
    graphType: GRAPH_TYPES.EVENT,
    computeInputs: () => [],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'rawText', name: t('nodes:msg_2dcae0b0'), type: 'String' }
    ],
    defaultData: {},
    theme: { headerColor: '#8b5cf6', accentColor: '#a78bfa' }
  },
  {
    type: 'event:playerJoined',
    label: t('nodes:msg_e51ca6b1'),
    category: t('nodes:msg_227f8538'),
    description: t('nodes:msg_4c79ede3'),
    graphType: GRAPH_TYPES.EVENT,
    computeInputs: () => [],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'user', name: t('nodes:msg_f154d6cc'), type: 'User' }
    ],
    defaultData: {},
    theme: { headerColor: '#8b5cf6', accentColor: '#a78bfa' }
  },
  {
    type: 'event:playerLeft',
    label: t('nodes:msg_55079554'),
    category: t('nodes:msg_227f8538'),
    description: t('nodes:msg_dbf92d72'),
    graphType: GRAPH_TYPES.EVENT,
    computeInputs: () => [],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'user', name: t('nodes:msg_f154d6cc'), type: 'User' }
    ],
    defaultData: {},
    theme: { headerColor: '#8b5cf6', accentColor: '#a78bfa' }
  },
  {
    type: 'event:entitySpawn',
    label: t('nodes:msg_9fa60147'),
    category: t('nodes:msg_227f8538'),
    description: t('nodes:msg_cdcd9465'),
    graphType: GRAPH_TYPES.EVENT,
    computeInputs: () => [],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'entity', name: t('nodes:msg_de2925f0'), type: 'Object' }
    ],
    defaultData: {},
    theme: { headerColor: '#8b5cf6', accentColor: '#a78bfa' }
  },
  {
    type: 'event:entityMoved',
    label: t('nodes:msg_941fb793'),
    category: t('nodes:msg_227f8538'),
    description: t('nodes:msg_63aae082'),
    graphType: GRAPH_TYPES.EVENT,
    computeInputs: () => [],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'entity', name: t('nodes:msg_de2925f0'), type: 'Object' }
    ],
    defaultData: {},
    theme: { headerColor: '#8b5cf6', accentColor: '#a78bfa' }
  },
  {
    type: 'event:entityGone',
    label: t('nodes:msg_30438958'),
    category: t('nodes:msg_227f8538'),
    description: t('nodes:msg_2a104e10'),
    graphType: GRAPH_TYPES.EVENT,
    computeInputs: () => [],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'entity', name: t('nodes:msg_de2925f0'), type: 'Object' }
    ],
    defaultData: {},
    theme: { headerColor: '#8b5cf6', accentColor: '#a78bfa' }
  },
  {
    type: 'event:botDied',
    label: t('nodes:msg_4d5ee2e3'),
    category: t('nodes:msg_227f8538'),
    description: t('nodes:msg_a191d258'),
    graphType: GRAPH_TYPES.EVENT,
    computeInputs: () => [],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' }
    ],
    defaultData: {},
    theme: { headerColor: '#8b5cf6', accentColor: '#a78bfa' }
  },
  {
    type: 'event:botStartup',
    label: t('nodes:msg_dddb1770'),
    category: t('nodes:msg_227f8538'),
    description: t('nodes:msg_31cb1c68'),
    graphType: GRAPH_TYPES.EVENT,
    computeInputs: () => [],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' }
    ],
    defaultData: {},
    theme: { headerColor: '#8b5cf6', accentColor: '#a78bfa' }
  },
  {
    type: 'event:health',
    label: t('nodes:msg_686be96e'),
    category: t('nodes:msg_227f8538'),
    description: t('nodes:msg_094d49e4'),
    graphType: GRAPH_TYPES.EVENT,
    computeInputs: () => [],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'health', name: t('nodes:msg_bc5d8e01'), type: 'Number' },
      { id: 'food', name: t('nodes:msg_4adbdce4'), type: 'Number' },
      { id: 'saturation', name: t('nodes:msg_f948ff0a'), type: 'Number' }
    ],
    defaultData: {},
    theme: { headerColor: '#8b5cf6', accentColor: '#a78bfa' }
  },
  {
    type: 'event:websocket_call',
    label: t('nodes:msg_3cb35a06'),
    category: t('nodes:msg_227f8538'),
    description: t('nodes:msg_b2745e68'),
    graphType: GRAPH_TYPES.EVENT,
    computeInputs: () => [],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'graphName', name: t('nodes:msg_f37c4059'), type: 'String' },
      { id: 'data', name: t('nodes:msg_145f378b'), type: 'Object' },
      { id: 'socketId', name: 'Socket ID', type: 'String' },
      { id: 'keyPrefix', name: t('nodes:msg_8046451a'), type: 'String' }
    ],
    defaultData: {},
    theme: { headerColor: '#8b5cf6', accentColor: '#a78bfa' }
  },
  {
    type: 'event:custom_event',
    label: t('nodes:msg_8b601a01'),
    category: t('nodes:msg_227f8538'),
    description: t('nodes:msg_c553df09'),
    graphType: GRAPH_TYPES.EVENT,
    computeInputs: () => [],
    computeOutputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      ...(data.pins || []).map((pin) => ({ id: pin.id, name: pin.name, type: pin.type }))
    ],
    evaluator: require('../../core/nodes/event/custom_event').evaluate,
    defaultData: { pins: [] },
    theme: { headerColor: '#8b5cf6', accentColor: '#a78bfa' }
  },
  {
    type: 'event:call_event',
    label: t('nodes:msg_4f4de8bd'),
    category: t('auth:msg_6fdd7d3a'),
    description: t('nodes:msg_a761e26f'),
    graphType: GRAPH_TYPES.ALL,
    computeInputs: (data, context) => {
      const pins = [{ id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' }];
      if (data.selectedEventId != null) {
        const selectedNode = (context.nodes || []).find(n => n.id === data.selectedEventId);
        if (selectedNode && selectedNode.type === 'event:custom_event') {
          (selectedNode.data.pins || [])
            .filter(pin => pin.type !== 'Exec')
            .forEach(pin => pins.push({ id: pin.id, name: pin.name, type: pin.type }));
        }
      }
      return pins;
    },
    computeOutputs: () => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' }
    ],
    executor: require('../../core/nodes/event/call_event').executor,
    defaultData: { selectedEventId: null },
    theme: { headerColor: '#8b5cf6', accentColor: '#a78bfa' }
  }
];

const { evaluateEventPin } = require('../nodes/event/evaluateEvent');
for (const node of eventsNodes) {
  if (node.type !== 'event:call_event' && !node.evaluator) {
    node.evaluator = (nodeInstance, pinId, context) => evaluateEventPin(nodeInstance, pinId, context);
  }
}

module.exports = eventsNodes;

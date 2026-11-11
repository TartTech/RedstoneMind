const { GRAPH_TYPES } = require('../../core/constants/graphTypes');
const { t } = require('../../i18n');

const actionNodes = [
  {
    type: 'action:send_message',
    label: t('nodes:msg_3494d0d2'),
    category: t('nodes:msg_fb3df31b'),
    description: t('nodes:msg_1fc0bbe0'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/actions/send_message').execute,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'chat_type', name: t('nodes:msg_09248290'), type: 'String', required: true, inlineField: true, placeholder: 'global' },
      { id: 'message', name: t('nodes:msg_37157665'), type: 'String', required: true, inlineField: true, placeholder: t('nodes:msg_5797a339') },
      { id: 'recipient', name: t('nodes:msg_5629f6c3'), type: 'String', required: false, inlineField: true, placeholder: t('nodes:msg_41c27f83') }
    ],
    computeOutputs: () => [
      { id: 'exec', name: t('nodes:success_c665d401'), type: 'Exec' }
    ],
    defaultData: { chat_type: 'global', message: '', recipient: '' },
    theme: { headerColor: '#d97706', accentColor: '#f59e0b' }
  },
  {
    type: 'action:send_log',
    label: t('nodes:msg_d0aea4e2'),
    category: t('nodes:msg_fb3df31b'),
    description: t('nodes:msg_a3c13312'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/actions/send_log').execute,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'message', name: t('nodes:msg_37157665'), type: 'String', required: true, inlineField: true, placeholder: t('nodes:msg_8318f5b3') }
    ],
    computeOutputs: () => [
      { id: 'exec', name: t('nodes:success_c665d401'), type: 'Exec' }
    ],
    defaultData: { message: '' },
    theme: { headerColor: '#d97706', accentColor: '#f59e0b' }
  },
  {
    type: 'action:send_websocket_response',
    label: t('nodes:msg_147e7201'),
    category: 'WebSocket API',
    description: t('nodes:msg_ccc76091'),
    graphType: GRAPH_TYPES.EVENT,
    executor: require('../../core/nodes/actions/send_websocket_response').execute,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'data', name: t('nodes:msg_145f378b'), type: 'Wildcard', required: true }
    ],
    computeOutputs: () => [
      { id: 'exec', name: t('nodes:success_c665d401'), type: 'Exec' }
    ],
    defaultData: { data: null },
    theme: { headerColor: '#d97706', accentColor: '#f59e0b' }
  },
  {
    type: 'action:bot_look_at',
    label: t('nodes:msg_ba76a388'),
    category: t('nodes:msg_fb3df31b'),
    description: t('nodes:msg_e0fbcbcf'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/actions/bot_look_at').execute,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'target', name: t('nodes:msg_bfe610f3'), type: 'Object', required: true },
      { id: 'add_y', name: t('nodes:msg_d84a2ba0'), type: 'Number', required: false, inlineField: true, placeholder: '0' }
    ],
    computeOutputs: () => [
      { id: 'exec', name: t('nodes:success_c665d401'), type: 'Exec' }
    ],
    defaultData: { target: null, add_y: 0 },
    theme: { headerColor: '#d97706', accentColor: '#f59e0b' }
  },
  {
    type: 'action:bot_set_variable',
    label: t('nodes:msg_51a59a96'),
    category: t('nodes:msg_fb3df31b'),
    description: t('nodes:msg_c5bf57b3'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/actions/bot_set_variable').execute,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'name', name: t('nodes:msg_d38d6d92'), type: 'String', required: true, inlineField: true, placeholder: 'myVariable' },
      { id: 'value', name: t('nodes:msg_7b46d8cc'), type: 'Wildcard', required: true },
      { id: 'persist', name: t('nodes:msg_74d8fce4'), type: 'Boolean', required: false, inlineField: true }
    ],
    computeOutputs: () => [
      { id: 'exec', name: t('nodes:success_c665d401'), type: 'Exec' }
    ],
    defaultData: { name: '', value: null, persist: false },
    theme: { headerColor: '#d97706', accentColor: '#f59e0b' }
  },
  {
    type: 'action:http_request',
    label: t('nodes:msg_a5b83ca6'),
    category: t('nodes:msg_fb3df31b'),
    description: t('nodes:msg_0c838a3d'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/actions/http_request').execute,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'url', name: 'URL', type: 'String', required: true, inlineField: true, placeholder: 'https://api.example.com' },
      { id: 'method', name: t('nodes:msg_c8f1e855'), type: 'String', required: false, inlineField: true, placeholder: 'GET' },
      { id: 'queryParams', name: 'Query Params', type: 'Object', required: false },
      { id: 'headers', name: 'Headers', type: 'Object', required: false },
      { id: 'body', name: t('nodes:msg_d477d262'), type: 'Wildcard', required: false },
      { id: 'timeout', name: t('nodes:msg_5b0b1349'), type: 'Number', required: false, inlineField: true, placeholder: '5000' }
    ],
    computeOutputs: () => [
      { id: 'exec', name: t('nodes:msg_20f3e2f3'), type: 'Exec' },
      { id: 'exec_error', name: t('nodes:error_c6fd3c6a'), type: 'Exec' },
      { id: 'status', name: t('nodes:msg_7203f7a4'), type: 'Number' },
      { id: 'response', name: t('nodes:msg_0e7145d7'), type: 'Wildcard' },
      { id: 'response_headers', name: t('nodes:msg_0472724c'), type: 'Object' },
      { id: 'success', name: t('nodes:success_0954b11a'), type: 'Boolean' },
      { id: 'error', name: t('nodes:error_c6fd3c6a'), type: 'String' }
    ],
    defaultData: { url: '', method: 'GET', queryParams: null, headers: null, body: null, timeout: 5000 },
    theme: { headerColor: '#d97706', accentColor: '#f59e0b' }
  },
  {
    type: 'action:create_command',
    label: t('nodes:msg_235c750c'),
    category: t('nodes:msg_fb3df31b'),
    description: t('nodes:msg_c4261b77'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/actions/create_command').execute,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'name', name: t('nodes:msg_7b4954b8'), type: 'String', required: true, inlineField: true, placeholder: 'mycommand' },
      { id: 'description', name: t('nodes:msg_38ca0af8'), type: 'String', required: false, inlineField: true, placeholder: t('nodes:msg_a3fa9093') },
      { id: 'aliases', name: t('nodes:msg_054439b9'), type: 'Array', required: false },
      { id: 'cooldown', name: t('nodes:msg_8596143f'), type: 'Number', required: false, inlineField: true, placeholder: '0' },
      { id: 'allowedChatTypes', name: t('nodes:msg_4663aae8'), type: 'Array', required: false },
      { id: 'permissionName', name: t('nodes:msg_f3433e9a'), type: 'String', required: false, inlineField: true, placeholder: 'everyone' },
      { id: 'temporary', name: t('nodes:msg_3f70378e'), type: 'Boolean', required: false, inlineField: true }
    ],
    computeOutputs: () => [
      { id: 'exec', name: t('nodes:success_c665d401'), type: 'Exec' },
      { id: 'commandId', name: t('nodes:msg_3e7d94e4'), type: 'Number' },
      { id: 'success', name: t('nodes:success_0954b11a'), type: 'Boolean' }
    ],
    defaultData: { name: '', description: '', aliases: [], cooldown: 0, allowedChatTypes: [], permissionName: '', temporary: false },
    theme: { headerColor: '#d97706', accentColor: '#f59e0b' }
  },
  {
    type: 'action:update_command',
    label: t('nodes:msg_2ef82b5a'),
    category: t('nodes:msg_fb3df31b'),
    description: t('nodes:msg_7629d771'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/actions/update_command').execute,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'commandName', name: t('nodes:msg_7b4954b8'), type: 'String', required: true, inlineField: true, placeholder: 'mycommand' },
      { id: 'newName', name: t('nodes:msg_8b1a334c'), type: 'String', required: false, inlineField: true, placeholder: 'newcommand' },
      { id: 'description', name: t('nodes:msg_38ca0af8'), type: 'String', required: false, inlineField: true, placeholder: t('nodes:msg_a7a3ff7f') },
      { id: 'aliases', name: t('nodes:msg_054439b9'), type: 'Array', required: false },
      { id: 'cooldown', name: t('nodes:msg_8596143f'), type: 'Number', required: false, inlineField: true, placeholder: '0' },
      { id: 'allowedChatTypes', name: t('nodes:msg_4663aae8'), type: 'Array', required: false },
      { id: 'permissionName', name: t('nodes:msg_f3433e9a'), type: 'String', required: false, inlineField: true, placeholder: 'everyone' }
    ],
    computeOutputs: () => [
      { id: 'exec', name: t('nodes:success_c665d401'), type: 'Exec' },
      { id: 'success', name: t('nodes:success_0954b11a'), type: 'Boolean' }
    ],
    defaultData: { commandName: '', newName: '', description: '', aliases: [], cooldown: 0, allowedChatTypes: [], permissionName: '' },
    theme: { headerColor: '#d97706', accentColor: '#f59e0b' }
  },
  {
    type: 'action:delete_command',
    label: t('nodes:msg_dbddcc63'),
    category: t('nodes:msg_fb3df31b'),
    description: t('nodes:msg_f46876d5'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/actions/delete_command').execute,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec' },
      { id: 'commandName', name: t('nodes:msg_7b4954b8'), type: 'String', required: true, inlineField: true, placeholder: 'mycommand' }
    ],
    computeOutputs: () => [
      { id: 'exec', name: t('nodes:success_c665d401'), type: 'Exec' },
      { id: 'success', name: t('nodes:success_0954b11a'), type: 'Boolean' }
    ],
    defaultData: { commandName: '' },
    theme: { headerColor: '#d97706', accentColor: '#f59e0b' }
  }
];

module.exports = actionNodes;

const { GRAPH_TYPES } = require('../../core/constants/graphTypes');

const usersNodes = [
  {
    type: 'user:check_blacklist',
    label: t('nodes:msg_ef866259'),
    category: t('nodes:msg_b8c4e70d'),
    description: t('nodes:msg_a1532ebb'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/users/check_blacklist').evaluate,
    computeInputs: (data) => [
      { id: 'user', name: t('nodes:msg_f154d6cc'), type: 'User', required: true }
    ],
    computeOutputs: () => [
      { id: 'is_blacklisted', name: t('nodes:msg_b8d8646d'), type: 'Boolean' }
    ],
    defaultData: {},
    theme: { headerColor: '#7c3aed', accentColor: '#8b5cf6' }
  },
  {
    type: 'user:set_blacklist',
    label: t('nodes:msg_1545672c'),
    category: t('nodes:msg_b8c4e70d'),
    description: t('nodes:msg_5f600150'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/users/set_blacklist').execute,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec', required: true },
      { id: 'user', name: t('nodes:msg_f154d6cc'), type: 'User', required: true },
      { id: 'blacklist_status', name: t('nodes:msg_bd56fb86'), type: 'Boolean', required: true, inlineField: true }
    ],
    computeOutputs: () => [
      { id: 'exec', name: t('nodes:msg_c4530912'), type: 'Exec' },
      { id: 'updated_user', name: t('nodes:success_afb92af2'), type: 'User' }
    ],
    defaultData: { blacklist_status: false },
    theme: { headerColor: '#7c3aed', accentColor: '#8b5cf6' }
  },
  {
    type: 'user:get_groups',
    label: t('nodes:msg_c029d785'),
    category: t('nodes:msg_b8c4e70d'),
    description: t('nodes:msg_bd49bfc3'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/users/get_groups').evaluate,
    computeInputs: (data) => [
      { id: 'user', name: t('nodes:msg_f154d6cc'), type: 'User', required: true }
    ],
    computeOutputs: () => [
      { id: 'groups', name: t('nodes:msg_ebc417c9'), type: 'Array' }
    ],
    defaultData: {},
    theme: { headerColor: '#7c3aed', accentColor: '#8b5cf6' }
  },
  {
    type: 'user:get_permissions',
    label: t('nodes:msg_53d61107'),
    category: t('nodes:msg_b8c4e70d'),
    description: t('nodes:msg_fbb53dc8'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/users/get_permissions').evaluate,
    computeInputs: (data) => [
      { id: 'user', name: t('nodes:msg_f154d6cc'), type: 'User', required: true }
    ],
    computeOutputs: () => [
      { id: 'permissions', name: t('nodes:msg_18c92238'), type: 'Array' }
    ],
    defaultData: {},
    theme: { headerColor: '#7c3aed', accentColor: '#8b5cf6' }
  },
  {
    type: 'user:check_permission',
    label: t('nodes:msg_8c6d4b1d'),
    category: t('nodes:msg_b8c4e70d'),
    description: t('nodes:msg_7d8be0e1'),
    graphType: GRAPH_TYPES.ALL,
    evaluator: require('../../core/nodes/users/check_permission').evaluate,
    computeInputs: (data) => [
      { id: 'user', name: t('nodes:msg_f154d6cc'), type: 'User', required: true },
      { id: 'permission', name: t('nodes:msg_696c14d5'), type: 'String', required: true, inlineField: true, placeholder: 'admin.*' }
    ],
    computeOutputs: () => [
      { id: 'has_permission', name: t('nodes:msg_dc8081e7'), type: 'Boolean' }
    ],
    defaultData: { permission: '' },
    theme: { headerColor: '#7c3aed', accentColor: '#8b5cf6' }
  },
  {
    type: 'user:add_to_group',
    label: t('nodes:msg_b8054671'),
    category: t('nodes:msg_b8c4e70d'),
    description: t('nodes:msg_6f13dad5'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/users/add_to_group').execute,
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec', required: true },
      { id: 'user', name: t('nodes:msg_f154d6cc'), type: 'User', required: true },
      { id: 'group', name: t('nodes:msg_99d9901b'), type: 'String', required: true, inlineField: true, placeholder: 'Admin' }
    ],
    computeOutputs: () => [
      { id: 'exec', name: t('nodes:msg_c4530912'), type: 'Exec' }
    ],
    defaultData: { group: '' },
    theme: { headerColor: '#7c3aed', accentColor: '#8b5cf6' }
  },
  {
    type: 'user:remove_from_group',
    label: t('nodes:msg_86565de3'),
    category: t('nodes:msg_b8c4e70d'),
    description: t('nodes:msg_dc480aad'),
    graphType: GRAPH_TYPES.ALL,
    executor: require('../../core/nodes/users/remove_from_group').execute,
const { t } = require('../../i18n');
    computeInputs: (data) => [
      { id: 'exec', name: t('nodes:msg_bdf82a2a'), type: 'Exec', required: true },
      { id: 'user', name: t('nodes:msg_f154d6cc'), type: 'User', required: true },
      { id: 'group', name: t('nodes:msg_99d9901b'), type: 'String', required: true, inlineField: true, placeholder: 'Admin' }
    ],
    computeOutputs: () => [
      { id: 'exec', name: t('nodes:msg_c4530912'), type: 'Exec' }
    ],
    defaultData: { group: '' },
    theme: { headerColor: '#7c3aed', accentColor: '#8b5cf6' }
  }
];

module.exports = usersNodes;
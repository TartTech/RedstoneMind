import { NodeDefinition } from '../../core/registry';

export const botRestartDefinition = new NodeDefinition({
  type: 'bot:restart',
  category: 'bot',
  label: t('labels.restartBota'),
  description: t('descriptions.ostanavlivaetBotaIZapuskaetEgoSnova'),
  computeInputs: () => [
    { id: 'exec', name: t('vypolnit'), type: 'Exec' },
  ],
  computeOutputs: () => [],
  theme: {
    headerColor: '#d97706',
    accentColor: '#f59e0b',
  },
});

export default botRestartDefinition;

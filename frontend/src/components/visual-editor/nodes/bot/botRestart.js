import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

export const botRestartDefinition = new NodeDefinition({
  type: 'bot:restart',
  category: 'bot',
  label: i18n.t('labels.restartBota'),
  description: i18n.t('descriptions.ostanavlivaetBotaIZapuskaetEgoSnova'),
  computeInputs: () => [
    { id: 'exec', name: i18n.t('vypolnit'), type: 'Exec' },
  ],
  computeOutputs: () => [],
  theme: {
    headerColor: '#d97706',
    accentColor: '#f59e0b',
  },
});

export default botRestartDefinition;

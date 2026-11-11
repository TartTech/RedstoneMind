import { NodeDefinition } from '../../core/registry';

export const botStopDefinition = new NodeDefinition({
  type: 'bot:stop',
  category: 'bot',
  label: t('labels.vyklyuchitBota'),
  description: t('descriptions.ostanavlivaetBota'),



  theme: {
    headerColor: '#dc2626',
    accentColor: '#ef4444',
  },
});

export default botStopDefinition;

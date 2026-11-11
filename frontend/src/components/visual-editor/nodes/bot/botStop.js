import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

export const botStopDefinition = new NodeDefinition({
  type: 'bot:stop',
  category: 'bot',
  label: i18n.t('labels.vyklyuchitBota'),
  description: i18n.t('descriptions.ostanavlivaetBota'),



  theme: {
    headerColor: '#dc2626',
    accentColor: '#ef4444',
  },
});

export default botStopDefinition;

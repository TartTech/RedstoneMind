import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

export const botGetNameDefinition = new NodeDefinition({
  type: 'bot:get_name',
  category: 'bot',
  label: i18n.t('labels.imyaBota'),
  description: i18n.t('descriptions.vozvrashchaetImyaUsernameBota'),



  theme: {
    headerColor: '#3b82f6',
    accentColor: '#60a5fa',
  },
});

export default botGetNameDefinition;

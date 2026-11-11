import { NodeDefinition } from '../../core/registry';

export const botGetNameDefinition = new NodeDefinition({
  type: 'bot:get_name',
  category: 'bot',
  label: t('labels.imyaBota'),
  description: t('descriptions.vozvrashchaetImyaUsernameBota'),



  theme: {
    headerColor: '#3b82f6',
    accentColor: '#60a5fa',
  },
});

export default botGetNameDefinition;

import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

export const arrayShuffleDefinition = new NodeDefinition({
  type: 'array:shuffle',
  category: 'array',
  label: i18n.t('labels.peremeshatMassiv'),
  description: i18n.t('descriptions.vozvrashchaetNovyyMassivSElementamiV'),



  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default arrayShuffleDefinition;

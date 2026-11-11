import { NodeDefinition } from '../../core/registry';

export const arrayShuffleDefinition = new NodeDefinition({
  type: 'array:shuffle',
  category: 'array',
  label: t('labels.peremeshatMassiv'),
  description: t('descriptions.vozvrashchaetNovyyMassivSElementamiV'),



  theme: {
    headerColor: '#f59e0b',
    accentColor: '#fbbf24',
  },
});

export default arrayShuffleDefinition;

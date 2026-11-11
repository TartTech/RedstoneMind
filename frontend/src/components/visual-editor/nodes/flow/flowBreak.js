import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды flow:break
 * Немедленно прерывает выполнение цикла
 */
export const flowBreakDefinition = new NodeDefinition({
  type: 'flow:break',
  category: 'flow',
  label: t('labels.vyytiIzTsikla'),
  description: t('descriptions.nemedlennoPreryvaetVypolnenieTsiklaForEach'),



  theme: {
    headerColor: '#3b82f6',
    accentColor: '#60a5fa',
  },
});

export default flowBreakDefinition;

import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды flow:break
 * Немедленно прерывает выполнение цикла
 */
export const flowBreakDefinition = new NodeDefinition({
  type: 'flow:break',
  category: 'flow',
  label: i18n.t('labels.vyytiIzTsikla'),
  description: i18n.t('descriptions.nemedlennoPreryvaetVypolnenieTsiklaForEach'),



  theme: {
    headerColor: '#3b82f6',
    accentColor: '#60a5fa',
  },
});

export default flowBreakDefinition;

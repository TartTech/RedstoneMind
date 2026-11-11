import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды flow:for_each
 * Выполняет тело цикла for каждого элемента массива
 */
export const flowForEachDefinition = new NodeDefinition({
  type: 'flow:for_each',
  category: 'flow',
  label: i18n.t('labels.pereborMassivaTsikl'),
  description: i18n.t('descriptions.vypolnyaetTeloTsiklaDlyaKazhdogoElementa'),



  theme: {
    headerColor: '#3b82f6',
    accentColor: '#60a5fa',
  },
});

export default flowForEachDefinition;

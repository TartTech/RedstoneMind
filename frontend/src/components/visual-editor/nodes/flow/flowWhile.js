import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды flow:while
 * Выполняет тело цикла пока условие истинно
 */
export const flowWhileDefinition = new NodeDefinition({
  type: 'flow:while',
  category: 'flow',
  label: i18n.t('labels.loopWhile'),
  description: i18n.t('descriptions.vypolnyaetTeloTsiklaPokaUslovieIstinno'),



  theme: {
    headerColor: '#3b82f6',
    accentColor: '#60a5fa',
  },
});

export default flowWhileDefinition;

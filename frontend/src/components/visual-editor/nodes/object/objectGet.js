import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды object:get
 * Получает значение по ключу из объекта
 */
export const objectGetDefinition = new NodeDefinition({
  type: 'object:get',
  category: 'object',
  label: i18n.t('labels.poluchitZnachenie'),
  description: i18n.t('descriptions.poluchaetZnacheniePoKlyuchuIzObekta'),



  defaultData: {
    key: '',
  },

  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default objectGetDefinition;

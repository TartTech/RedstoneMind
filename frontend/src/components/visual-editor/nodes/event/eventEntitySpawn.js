import { NodeDefinition } from '../../core/registry';
import i18n from '@/i18n';

/**
 * Определение ноды event:entitySpawn
 * Срабатывает когда сущность поis в зоне видимости
 */
export const eventEntitySpawnDefinition = new NodeDefinition({
  type: 'event:entitySpawn',
  category: 'event',
  label: i18n.t('labels.entityPoyavilas'),
  description: i18n.t('descriptions.vyzyvaetsyaKogdaNovayaSushchnostPoyavlyaetsyaV'),



  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventEntitySpawnDefinition;

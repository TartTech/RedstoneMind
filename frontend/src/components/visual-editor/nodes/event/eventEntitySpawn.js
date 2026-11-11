import { NodeDefinition } from '../../core/registry';

/**
 * Определение ноды event:entitySpawn
 * Срабатывает когда сущность поis в зоне видимости
 */
export const eventEntitySpawnDefinition = new NodeDefinition({
  type: 'event:entitySpawn',
  category: 'event',
  label: t('labels.entityPoyavilas'),
  description: t('descriptions.vyzyvaetsyaKogdaNovayaSushchnostPoyavlyaetsyaV'),



  theme: {
    headerColor: '#8b5cf6',
    accentColor: '#a78bfa',
  },
});

export default eventEntitySpawnDefinition;

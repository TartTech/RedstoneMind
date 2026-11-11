const normalizeValue = (value) => String(value || '').trim().toLowerCase();

const CATEGORY_DEFINITIONS = [
  {
    id: 'all',
    values: [t('allPlugins'), 'All plugins', 'All'],
    translationKey: 'categories.allPlugins',
    defaultLabel: t('labels.allPlugins'),
    iconName: 'LayoutGrid',
    color: 'from-blue-500 to-purple-500',
  },
  {
    id: 'core',
    values: [t('yadro'), 'Core'],
    translationKey: 'categories.core',
    defaultLabel: t('labels.yadro'),
    iconName: 'ShieldCheck',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'clan',
    values: [t('klan'), 'Clan'],
    translationKey: 'categories.clan',
    defaultLabel: t('labels.klan'),
    iconName: 'Users',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'chat',
    values: [t('chat'), 'Chat'],
    translationKey: 'categories.chat',
    defaultLabel: t('labels.chat'),
    iconName: 'MessageSquare',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'automation',
    values: [t('avtomatizatsiya'), 'Automation'],
    translationKey: 'categories.automation',
    defaultLabel: t('labels.avtomatizatsiya'),
    iconName: 'Bot',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'security',
    values: [t('bezopasnost'), 'Security'],
    translationKey: 'categories.security',
    defaultLabel: t('labels.bezopasnost'),
    iconName: 'ShieldBan',
    color: 'from-red-500 to-rose-500',
  },
  {
    id: 'commands',
    values: [t('komandy'), 'Commands'],
    translationKey: 'categories.commands',
    defaultLabel: t('labels.komandy'),
    iconName: 'TerminalSquare',
    color: 'from-gray-500 to-gray-700',
  },
  {
    id: 'utilities',
    values: [t('utility'), 'Utilities'],
    translationKey: 'categories.utilities',
    defaultLabel: t('labels.utility'),
    iconName: 'Wrench',
    color: 'from-yellow-500 to-amber-500',
  },
  {
    id: 'permissions',
    values: [t('prava'), 'Permissions'],
    translationKey: 'categories.permissions',
    defaultLabel: t('labels.prava'),
    iconName: 'KeyRound',
    color: 'from-indigo-500 to-purple-500',
  },
];

const SOURCE_TYPE_DEFINITIONS = {
  GITHUB: { translationKey: 'sources.github', defaultLabel: 'GitHub' },
  LOCAL: { translationKey: 'sources.local', defaultLabel: t('labels.lokalnyy') },
  LOCAL_IDE: { translationKey: 'sources.localIde', defaultLabel: t('labels.lokalnyyIde') },
};

const categoryById = new Map(CATEGORY_DEFINITIONS.map((definition) => [definition.id, definition]));
const categoryByValue = new Map(
  CATEGORY_DEFINITIONS.flatMap((definition) =>
    definition.values.map((value) => [normalizeValue(value), definition])
  )
);

export const PLUGIN_BROWSER_CATEGORIES = CATEGORY_DEFINITIONS;

export const getPluginCategoryDefinition = (categoryOrId) => {
  if (!categoryOrId) return null;
  return categoryById.get(categoryOrId) || categoryByValue.get(normalizeValue(categoryOrId)) || null;
};

export const getPluginCategoryId = (category) => getPluginCategoryDefinition(category)?.id || null;

export const translatePluginCategory = (category, t) => {
  const definition = getPluginCategoryDefinition(category);
  if (!definition) {
    return category;
  }

  return t(definition.translationKey, {
    defaultValue: definition.defaultLabel,
  });
};

export const pluginMatchesCategory = (categories = [], selectedCategoryId = 'all') => {
  if (!selectedCategoryId || selectedCategoryId === 'all') {
    return true;
  }

  return categories.some((category) => getPluginCategoryId(category) === selectedCategoryId);
};

export const normalizeGithubRepoUrl = (repoUrl) => {
  if (!repoUrl || typeof repoUrl !== 'string') return null;
  let trimmed = repoUrl.trim();
  if (!trimmed) return null;

  trimmed = trimmed.replace(/^git\+/i, '');

  const sshMatch = trimmed.match(/^git@github\.com:([^/]+)\/([^/]+?)(?:\.git)?$/i);
  if (sshMatch) {
    return `https://github.com/${sshMatch[1].toLowerCase()}/${sshMatch[2].toLowerCase()}`;
  }

  if (/^github\.com\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    const hostname = parsed.hostname.toLowerCase();
    if (hostname !== 'github.com' && hostname !== 'www.github.com') return null;
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    const owner = parts[0].toLowerCase();
    const repo = parts[1].replace(/\.git$/i, '').toLowerCase();
    return `https://github.com/${owner}/${repo}`;
  } catch {
    return null;
  }
};

export const translatePluginSourceType = (sourceType, t) => {
  const definition = SOURCE_TYPE_DEFINITIONS[sourceType];
  if (!definition) {
    return sourceType;
  }

  return t(definition.translationKey, {
    defaultValue: definition.defaultLabel,
  });
};

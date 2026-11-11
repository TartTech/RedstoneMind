const path = require('path');
const fse = require('fs-extra');
const os = require('os');
const AdmZip = require('adm-zip');
const semver = require('semver');
const PluginHooks = require('./PluginHooks');
const {
    tryParseGithubRepoUrl,
    normalizeGithubRepoUrl,
    tryNormalizeGithubRepoUrl,
    getGithubRepoName,
    fetchGithubRepoInfo,
    downloadGithubArchive,
    fetchGithubPackageVersion,
    fetchLatestGithubVersionTag,
} = require('./utils/github');
const { installDependencies } = require('./utils/npmInstall');
const { assertSafeZip, assertArchiveLimits } = require('./utils/zipSafe');
const TtlCache = require('./utils/ttlCache');
const { pluginDependencySatisfied, diffSettings, listDeclaredPermissions, ensureDeclaredPermissions } = require('./utils/pluginManifest');
const { isFloatingLatest } = require('./utils/pluginCatalog');
const { t } = require('../i18n');

const DATA_DIR = path.join(os.homedir(), '.redstonemind');
const PLUGINS_BASE_DIR = path.join(DATA_DIR, 'storage', 'plugins');

function isPathInside(parent, child) {
    const rel = path.relative(parent, child);
    return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

function sanitizePluginDirName(name) {
    const cleaned = String(name || '').replace(/[^a-zA-Z0-9_.-]/g, '_').replace(/^\.+/, '');
    return cleaned || 'plugin';
}

function httpError(message, statusCode) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

async function readExportedSettings(pluginDir) {
    const settingsPath = path.join(pluginDir, 'redstonemind-settings.json');
    if (!await fse.pathExists(settingsPath)) return null;
    const raw = await fse.readFile(settingsPath, 'utf8');
    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch {
        throw httpError(t('plugins:msg_1ddc6782'), 400);
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw httpError(t('plugins:validation_70d4c565'), 400);
    }
    await fse.remove(settingsPath);
    return JSON.stringify(parsed);
}

async function findPluginRoot(rootDir) {
    if (await fse.pathExists(path.join(rootDir, 'package.json'))) {
        return rootDir;
    }

    const entries = await fse.readdir(rootDir, { withFileTypes: true });
    const matches = [];
    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (entry.name === '__MACOSX' || entry.name === 'node_modules' || entry.name === '.git') continue;
        const candidate = path.join(rootDir, entry.name);
        if (await fse.pathExists(path.join(candidate, 'package.json'))) {
            matches.push(candidate);
        }
    }

    if (matches.length === 1) return matches[0];
    return null;
}

async function appendPluginFiles(archive, directory, relativeDir = '') {
    const entries = await fse.readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.name === 'node_modules' || entry.name === '.git') continue;
        if (!relativeDir && entry.name === 'redstonemind-settings.json') continue;
        const absolutePath = path.join(directory, entry.name);
        const entryName = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
        if (entry.isSymbolicLink()) continue;
        if (entry.isDirectory()) {
            await appendPluginFiles(archive, absolutePath, entryName);
            continue;
        }
        if (entry.isFile()) {
            archive.file(absolutePath, { name: entryName });
        }
    }
}

const TELEMETRY_ENABLED = process.env.REDSTONEMIND_TELEMETRY !== 'false';
const STATS_SERVER_URL = process.env.STATS_SERVER_URL || 'http://212.22.78.42:3000';

const LATEST_TAG_TTL_MS = 30 * 60 * 1000;
const LATEST_VERSION_TTL_MS = 30 * 60 * 1000;

function reportPluginDownload(pluginName) {
    if (!TELEMETRY_ENABLED) return;

    fetch(`${STATS_SERVER_URL}/api/plugins/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plugin_name: pluginName }),
    })
        .then((res) => {
            if (!res.ok) {
                console.error(t('plugins:log_a08fc9b6', { pluginName: pluginName, res: res.statusText }));
            }
        })
        .catch((error) => {
            const { isConnectTimeout } = require('./utils/networkError');
            if (isConnectTimeout(error)) return;
            console.error(t('plugins:error_3b69c7ef', { pluginName: pluginName, error: error.message }));
        });
}

async function safeRemove(targetPath) {
    if (!targetPath) return;
    try {
        if (await fse.pathExists(targetPath)) {
            await fse.remove(targetPath);
        }
    } catch (error) {
        console.warn(t('plugins:error_bfeb53da', { targetPath: targetPath, error: error.message }));
    }
}

class PluginManager {
    constructor({ botManager, prisma } = {}) {
        if (!prisma) {
            throw new Error('PluginManager requires a prisma client.');
        }
        this.botManager = botManager;
        this.prisma = prisma;
        this.latestTagCache = new TtlCache({ ttlMs: LATEST_TAG_TTL_MS, cleanupIntervalMs: 5 * 60 * 1000, maxSize: 500 });
        this.latestVersionCache = new TtlCache({ ttlMs: LATEST_VERSION_TTL_MS, cleanupIntervalMs: 5 * 60 * 1000, maxSize: 500 });
        this.ensureBaseDirExists();
    }

    async ensureBaseDirExists() {
        await fse.mkdir(PLUGINS_BASE_DIR, { recursive: true }).catch(console.error);
    }

    async checkPluginDependencies(botId, packageJson) {
        const result = { isValid: true, missing: [], warnings: [] };
        const pluginDeps = packageJson.botpanel?.dependencies || {};
        if (Object.keys(pluginDeps).length === 0) return result;

        const installedPlugins = await this.prisma.installedPlugin.findMany({
            where: { botId },
            select: { name: true, version: true },
        });
        const installedMap = new Map(installedPlugins.map((p) => [p.name, p.version]));

        for (const [depName, depVersion] of Object.entries(pluginDeps)) {
            if (!installedMap.has(depName)) {
                result.missing.push(t('plugins:msg_b8b97175', { depName: depName, depVersion: depVersion }));
                result.isValid = false;
                continue;
            }
            const installedVersion = installedMap.get(depName);
            if (!pluginDependencySatisfied(installedVersion, depVersion)) {
                result.missing.push(t('plugins:success_bdd5782f', { depName: depName, installedVersion: installedVersion, depVersion: depVersion }));
                result.isValid = false;
            }
        }

        return result;
    }

    async _installDependencies(pluginPath, hooks = {}) {
        try {
            await installDependencies(pluginPath, {
                sendLog: (msg) => console.log(`[PluginManager] ${msg}`),
                onWait: hooks.onWait,
            });
        } catch (error) {
            console.error(t('plugins:error_71430b6a', { pluginPath: pluginPath }), error);
            throw new Error(t('plugins:error_4aec358f'));
        }
    }

    async _logDependencyWarnings(botId, packageJson) {
        const depCheck = await this.checkPluginDependencies(botId, packageJson);
        if (!depCheck.isValid) {
            const missingList = depCheck.missing.join(', ');
            console.warn(t('plugins:log_4f3c79ea', { packageJson: packageJson.name, missingList: missingList }));
            console.warn(t('plugins:error_6245b61a'));
        }
        depCheck.warnings.forEach((w) => console.warn(`[PluginManager] ${w}`));
    }

    async installFromLocalPath(botId, directoryPath, settingsJson = null) {
        if (typeof directoryPath !== 'string' || !directoryPath.trim()) {
            throw new Error(t('plugins:msg_aea1f623'));
        }

        let realSource;
        try {
            realSource = await fse.realpath(directoryPath);
        } catch (e) {
            throw new Error(t('plugins:msg_f91320c0'));
        }

        const stat = await fse.stat(realSource);
        if (!stat.isDirectory()) {
            throw new Error(t('plugins:msg_519b1ebc'));
        }

        const packageJsonPath = path.join(realSource, 'package.json');
        if (!await fse.pathExists(packageJsonPath)) {
            throw new Error(t('plugins:msg_b771e474'));
        }
        const packageJson = JSON.parse(await fse.readFile(packageJsonPath, 'utf-8'));
        if (!packageJson.name || !packageJson.version) {
            throw new Error(t('plugins:validation_9cefa9ff'));
        }

        await this._logDependencyWarnings(botId, packageJson);

        const botPluginsDir = path.join(PLUGINS_BASE_DIR, `bot_${botId}`);
        await fse.mkdir(botPluginsDir, { recursive: true });
        const realBase = await fse.realpath(PLUGINS_BASE_DIR);

        let managedPath;
        if (isPathInside(realBase, realSource)) {
            managedPath = realSource;
        } else {
            managedPath = path.join(botPluginsDir, sanitizePluginDirName(packageJson.name));
            if (await fse.pathExists(managedPath)) {
                await fse.remove(managedPath);
            }
            await fse.copy(realSource, managedPath, {
                filter: (src) => {
                    const base = path.basename(src);
                    return base !== 'node_modules' && base !== '.git' && base !== 'redstonemind-settings.json';
                },
            });
        }

        const preexisting = await this.prisma.installedPlugin
            .findUnique({ where: { botId_name: { botId, name: packageJson.name } } })
            .catch(() => null);
        const wasNew = !preexisting;

        const newPlugin = await this.registerPlugin(botId, managedPath, 'LOCAL', `local:${packageJson.name}`);
        if (settingsJson != null) {
            await this.prisma.installedPlugin.update({
                where: { id: newPlugin.id },
                data: { settings: settingsJson },
            });
            newPlugin.settings = settingsJson;
        }

        try {
            reportPluginDownload(packageJson.name);
        } catch (e) {
            console.error(t('plugins:error_2eb90939'), e?.message);
        }

        try {
            await this._installDependencies(managedPath);
            await this.loadPluginGraphs(botId, newPlugin.id, managedPath);

            if (this.botManager) {
                await this.botManager.reloadPlugins(botId);
            }
        } catch (error) {
            if (wasNew) {
                await this.prisma.installedPlugin.delete({ where: { id: newPlugin.id } }).catch(() => {});
                if (managedPath !== realSource && managedPath.startsWith(PLUGINS_BASE_DIR)) {
                    await safeRemove(managedPath);
                }
            }
            throw error;
        }

        return newPlugin;
    }

    async getInstalledPluginDirectory(botId, pluginId) {
        const plugin = await this.prisma.installedPlugin.findUnique({ where: { id: Number(pluginId) } });
        if (!plugin || plugin.botId !== Number(botId)) {
            throw httpError(t('api:msg_07a06551'), 404);
        }

        let realPath;
        try {
            realPath = await fse.realpath(plugin.path);
        } catch {
            throw httpError(t('plugins:msg_5419060b'), 404);
        }

        const stat = await fse.stat(realPath);
        if (!stat.isDirectory()) {
            throw httpError(t('plugins:msg_5419060b'), 404);
        }

        const botDir = path.join(PLUGINS_BASE_DIR, `bot_${Number(botId)}`);
        const realBotDir = await fse.realpath(botDir);
        if (!isPathInside(realBotDir, realPath)) {
            throw httpError(t('plugins:msg_5b562d64'), 400);
        }

        return {
            plugin,
            directory: realPath,
            filename: `${sanitizePluginDirName(plugin.name)}.zip`,
        };
    }

    async writePluginZip(directory, outputStream, settingsJson = null) {
        const archiver = require('archiver');
        const archive = archiver('zip', { zlib: { level: 9 } });
        const failed = new Promise((_, reject) => {
            archive.on('error', reject);
        });
        archive.pipe(outputStream);
        await appendPluginFiles(archive, directory);
        if (settingsJson != null) {
            archive.append(settingsJson, { name: 'redstonemind-settings.json' });
        }
        await Promise.race([archive.finalize(), failed]);
    }

    async installFromZipBuffer(botId, buffer) {
        if (!Buffer.isBuffer(buffer) || buffer.length < 4 || buffer[0] !== 0x50 || buffer[1] !== 0x4b) {
            throw httpError(t('plugins:msg_df807b6c'), 400);
        }

        let zip;
        try {
            zip = new AdmZip(buffer);
        } catch {
            throw httpError(t('plugins:error_c12477b2'), 400);
        }

        try {
            assertArchiveLimits(zip);
        } catch (error) {
            if (!error.statusCode) error.statusCode = 400;
            throw error;
        }

        const tempDir = await fse.mkdtemp(path.join(os.tmpdir(), 'redstonemind-plugin-zip-'));
        try {
            assertSafeZip(zip, tempDir);
            zip.extractAllTo(tempDir, true);
            const pluginDir = await findPluginRoot(tempDir);
            if (!pluginDir) {
                throw httpError(t('plugins:msg_ff2194c1'), 400);
            }
            const settingsJson = await readExportedSettings(pluginDir);
            return await this.installFromLocalPath(botId, pluginDir, settingsJson);
        } catch (error) {
            if (!error.statusCode && /Небезопасный путь/.test(error.message || '')) {
                error.statusCode = 400;
            }
            throw error;
        } finally {
            await safeRemove(tempDir);
        }
    }

    async _downloadAndExtract(repoUrl, ref, destinationDir) {
        const response = await downloadGithubArchive(repoUrl, ref);
        const buffer = await response.arrayBuffer();
        const zip = new AdmZip(Buffer.from(buffer));
        const zipEntries = zip.getEntries();
        if (zipEntries.length === 0) {
            throw new Error(t('plugins:msg_b56342c5'));
        }
        const rootFolderName = zipEntries[0].entryName.split('/')[0];
        await fse.mkdir(destinationDir, { recursive: true });
        assertSafeZip(zip, destinationDir);
        zip.extractAllTo(destinationDir, true);
        const extractedPath = path.join(destinationDir, rootFolderName);
        if (!await fse.pathExists(extractedPath)) {
            throw new Error(t('plugins:msg_c6b30cd1'));
        }
        return extractedPath;
    }

    async _resolveSourceRef({ tag, repoUrl }) {
        if (tag) {
            return { sourceRefType: 'tag', sourceRef: tag, repoInfo: null };
        }
        const repoInfo = await fetchGithubRepoInfo(repoUrl);
        if (repoInfo?.default_branch) {
            return { sourceRefType: 'branch', sourceRef: repoInfo.default_branch, repoInfo };
        }
        return { sourceRefType: 'branch', sourceRef: 'main', repoInfo: null };
    }

    async _downloadToTemp(repoUrl, ref, tag, repoInfo) {
        const tempDir = await fse.mkdtemp(path.join(os.tmpdir(), 'redstonemind-plugin-'));
        try {
            try {
                const extracted = await this._downloadAndExtract(repoUrl, ref, tempDir);
                return { extracted, tempDir, sourceRef: ref };
            } catch (err) {
                if (!tag && !repoInfo && ref !== 'master') {
                    console.log(`[PluginManager] Ветка '${ref}t('plugins:msg_891eacac')master'...`);
                    const extracted = await this._downloadAndExtract(repoUrl, 'master', tempDir);
                    return { extracted, tempDir, sourceRef: 'master' };
                }
                throw err;
            }
        } catch (err) {
            await safeRemove(tempDir);
            throw err;
        }
    }

    async installFromGithub(botId, repoUrl, prismaClient = null, isUpdate = false, tag = null) {
        const prisma = prismaClient || this.prisma;
        const normalizedRepoUrl = normalizeGithubRepoUrl(repoUrl);
        const ownerRepo = tryParseGithubRepoUrl(normalizedRepoUrl);
        if (!ownerRepo) {
            throw new Error('Invalid GitHub repository URL.');
        }

        if (!isUpdate) {
            const existing = await prisma.installedPlugin.findFirst({ where: { botId, sourceUri: normalizedRepoUrl } });
            if (existing) throw new Error(t('plugins:success_28a50da1', { normalizedRepoUrl: normalizedRepoUrl }));
        }

        const botPluginsDir = path.join(PLUGINS_BASE_DIR, `bot_${botId}`);
        await fse.mkdir(botPluginsDir, { recursive: true });

        const { sourceRefType, sourceRef: initialRef, repoInfo } = await this._resolveSourceRef({ tag, repoUrl: normalizedRepoUrl });

        let extractedPath;
        let tempDir;
        let resolvedSourceRef = initialRef;
        try {
            const downloaded = await this._downloadToTemp(normalizedRepoUrl, initialRef, tag, repoInfo);
            extractedPath = downloaded.extracted;
            tempDir = downloaded.tempDir;
            resolvedSourceRef = downloaded.sourceRef;
        } catch (err) {
            const message = err?.message || String(err);
            if (/fetch|AbortError|timed out/i.test(message)) {
                throw new Error(t('plugins:error_b2468dcf'));
            }
            throw new Error(t('plugins:error_da81c8fe', { message: message }));
        }

        const localPath = path.join(botPluginsDir, ownerRepo.repo);
        let registeredPluginId = null;

        try {
            const packageJsonPath = path.join(extractedPath, 'package.json');
            if (!await fse.pathExists(packageJsonPath)) {
                throw new Error(t('plugins:msg_e0418ea7'));
            }
            const packageJson = JSON.parse(await fse.readFile(packageJsonPath, 'utf-8'));
            if (!packageJson.name || !packageJson.version) {
                throw new Error(t('plugins:validation_9cefa9ff'));
            }

            await this._logDependencyWarnings(botId, packageJson);

            if (await fse.pathExists(localPath)) {
                await fse.remove(localPath);
            }
            await fse.move(extractedPath, localPath, { overwrite: true });

            await this._installDependencies(localPath);

            const newPlugin = await this.registerPlugin(botId, localPath, 'GITHUB', normalizedRepoUrl, prisma, {
                sourceRefType,
                sourceRef: resolvedSourceRef,
            });
            registeredPluginId = newPlugin.id;

            reportPluginDownload(packageJson.name);

            await this.loadPluginGraphs(botId, newPlugin.id, localPath);

            if (this.botManager) {
                await this.botManager.reloadPlugins(botId);
            }

            return newPlugin;
        } catch (error) {
            if (!isUpdate && registeredPluginId !== null) {
                await prisma.installedPlugin
                    .delete({ where: { id: registeredPluginId } })
                    .catch(() => {});
            }
            await safeRemove(localPath);
            throw error;
        } finally {
            await safeRemove(tempDir);
        }
    }

    async registerPlugin(botId, directoryPath, sourceType, sourceUri, prismaClient = null, extraData = {}) {
        const prisma = prismaClient || this.prisma;
        const packageJsonPath = path.join(directoryPath, 'package.json');
        let packageJson;
        try {
            packageJson = JSON.parse(await fse.readFile(packageJsonPath, 'utf-8'));
        } catch (e) {
            throw new Error(t('plugins:error_f20836b9', { directoryPath: directoryPath }));
        }

        if (!packageJson.name || !packageJson.version) {
            throw new Error(t('plugins:validation_7f46b85f'));
        }

        const pluginData = {
            botId,
            name: packageJson.name,
            version: packageJson.version,
            description: packageJson.description || '',
            path: directoryPath,
            sourceType,
            sourceUri: sourceUri || directoryPath,
            manifest: JSON.stringify(packageJson.botpanel || {}),
            ...extraData,
        };

        const saved = await prisma.installedPlugin.upsert({
            where: { botId_name: { botId, name: packageJson.name } },
            update: pluginData,
            create: pluginData,
        });
        await ensureDeclaredPermissions(prisma, botId, packageJson.name, packageJson.botpanel || {});
        return saved;
    }

    _clearPluginRequireCache(pluginPath) {
        if (!pluginPath) return;
        const normalized = path.resolve(pluginPath);
        const prefix = normalized + path.sep;
        for (const key of Object.keys(require.cache)) {
            if (key === normalized || key.startsWith(prefix)) {
                delete require.cache[key];
            }
        }
    }

    async reviewManifest(botId, packageJson, previousManifest = null) {
        const manifest = packageJson?.botpanel || {};
        const dependencies = await this.checkPluginDependencies(botId, packageJson);
        const declared = listDeclaredPermissions(manifest);
        const existing = await this.prisma.permission.findMany({
            where: { botId: Number(botId) },
            select: { name: true },
        });
        const existingNames = new Set(existing.map((item) => item.name));
        const permissions = declared.map((item) => ({
            ...item,
            exists: existingNames.has(item.name),
        }));
        const settings = diffSettings(previousManifest?.settings || {}, manifest.settings || {});
        return { dependencies, permissions, settings };
    }

    async _unloadInBotProcess(botId, pluginName) {
        const processManager = this.botManager?.processManager;
        if (!processManager?.isRunning?.(botId)) return;
        const { v4: uuidv4 } = require('uuid');
        const requestId = uuidv4();
        const pending = processManager.waitForPluginUnload(requestId);
        const sent = processManager.sendMessage(botId, {
            type: 'plugins:unload',
            pluginName,
            requestId,
        });
        if (!sent) return;
        await pending;
    }

    async deletePlugin(pluginId) {
        const plugin = await this.prisma.installedPlugin.findUnique({ where: { id: pluginId } });
        if (!plugin) throw new Error(t('api:msg_07a06551'));

        const pluginOwnerId = `plugin:${plugin.name}`;
        console.log(t('plugins:success_72ad1c57', { plugin: plugin.name, plugin1: plugin.id }));

        try {
            await this._unloadInBotProcess(plugin.botId, plugin.name);
        } catch (error) {
            console.error(t('plugins:error_3f8dc09d', { plugin: plugin.name }), error);
        }

        try {
            await this.prisma.$transaction(async (tx) => {
                await tx.command.deleteMany({ where: { botId: plugin.botId, pluginOwnerId: plugin.id } });
                await tx.eventGraph.deleteMany({ where: { botId: plugin.botId, pluginOwnerId: plugin.id } });
                await tx.permission.deleteMany({ where: { botId: plugin.botId, owner: pluginOwnerId } });
                await tx.group.deleteMany({ where: { botId: plugin.botId, owner: pluginOwnerId } });
                await tx.installedPlugin.delete({ where: { id: pluginId } });
            });
        } catch (dbError) {
            console.error(t('plugins:error_57883dc7', { plugin: plugin.name }), dbError);
            throw new Error(t('plugins:error_569b579f'));
        }

        if (plugin.path && plugin.path.startsWith(PLUGINS_BASE_DIR)) {
            await safeRemove(plugin.path);
        }
    }

    async _resolveLatestTagWithCache(repoUrl) {
        if (!repoUrl) return null;
        const cached = this.latestTagCache.get(repoUrl);
        if (cached !== null) return cached.value;
        const fetched = await fetchLatestGithubVersionTag(repoUrl);
        this.latestTagCache.set(repoUrl, { value: fetched });
        return fetched;
    }

    async _resolveLatestVersionWithCache(repoUrl, ref) {
        if (!repoUrl) return null;
        const cacheKey = `${repoUrl}::${ref || 'default'}`;
        const cached = this.latestVersionCache.get(cacheKey);
        if (cached !== null) return cached.value;
        const fetched = await fetchGithubPackageVersion(repoUrl, ref);
        this.latestVersionCache.set(cacheKey, { value: fetched });
        return fetched;
    }

    async checkForUpdates(botId, catalog) {
        const githubPlugins = await this.prisma.installedPlugin.findMany({
            where: { botId, sourceType: 'GITHUB' },
        });
        const updatesAvailable = [];
        const catalogMapByRepo = new Map();
        const catalogMapByName = new Map();
        const catalogMapByRepoName = new Map();

        for (const item of catalog) {
            const normalizedRepoUrl = tryNormalizeGithubRepoUrl(item.repoUrl);
            if (normalizedRepoUrl) {
                catalogMapByRepo.set(normalizedRepoUrl, item);
                const repoName = getGithubRepoName(normalizedRepoUrl);
                if (repoName && !catalogMapByRepoName.has(repoName)) {
                    catalogMapByRepoName.set(repoName, item);
                }
            }
            if (item?.name) {
                catalogMapByName.set(String(item.name).toLowerCase(), item);
            }
        }

        for (const plugin of githubPlugins) {
            try {
                const normalizedSourceUri = tryNormalizeGithubRepoUrl(plugin.sourceUri);
                const repoName = getGithubRepoName(normalizedSourceUri || plugin.sourceUri);
                const catalogInfo =
                    (normalizedSourceUri ? catalogMapByRepo.get(normalizedSourceUri) : null) ||
                    catalogMapByName.get(String(plugin.name).toLowerCase()) ||
                    (repoName ? catalogMapByRepoName.get(repoName) : null);

                const targetRepoUrl = catalogInfo?.repoUrl || normalizedSourceUri || tryNormalizeGithubRepoUrl(plugin.sourceUri) || plugin.sourceUri;
                let latestTagRaw =
                    catalogInfo?.latestTag ||
                    catalogInfo?.recommendedVersion ||
                    catalogInfo?.version ||
                    catalogInfo?.latestVersion ||
                    catalogInfo?.tag;

                if (!latestTagRaw || isFloatingLatest(latestTagRaw)) {
                    latestTagRaw = await this._resolveLatestTagWithCache(targetRepoUrl);
                }

                let latestVersionRaw = latestTagRaw;
                if (!latestVersionRaw && targetRepoUrl) {
                    latestVersionRaw = await this._resolveLatestVersionWithCache(
                        targetRepoUrl,
                        plugin.sourceRefType === 'branch' ? plugin.sourceRef : null
                    );
                }

                if (!latestVersionRaw) continue;

                const localSemver = semver.coerce(plugin.version);
                const remoteSemver = semver.coerce(latestVersionRaw);
                if (!localSemver || !remoteSemver) continue;

                if (semver.gt(remoteSemver.version, localSemver.version)) {
                    updatesAvailable.push({
                        id: plugin.id,
                        name: plugin.name,
                        sourceUri: plugin.sourceUri,
                        currentVersion: localSemver.version,
                        recommendedVersion: remoteSemver.version,
                        latestTag: catalogInfo?.latestTag || latestTagRaw || null,
                        targetRepoUrl,
                    });
                }
            } catch (error) {
                console.error(t('plugins:error_15fa8c07', { plugin: plugin.name }), error.message);
            }
        }
        return updatesAvailable;
    }

    async updatePlugin(pluginId, targetTag = null, targetRepoUrl = null) {
        const plugin = await this.prisma.installedPlugin.findUnique({ where: { id: pluginId } });
        if (!plugin || plugin.sourceType !== 'GITHUB') {
            throw new Error(t('plugins:msg_13597949'));
        }

        const repoUrl = targetRepoUrl || plugin.sourceUri;
        const botId = plugin.botId;
        const oldVersion = plugin.version;
        const oldPath = plugin.path;

        const backupData = {
            name: plugin.name,
            settings: plugin.settings,
            isEnabled: plugin.isEnabled,
        };

        let backupPath = null;
        if (oldPath && await fse.pathExists(oldPath)) {
            backupPath = `${oldPath}.bak-${Date.now()}`;
            try {
                await fse.move(oldPath, backupPath, { overwrite: true });
            } catch (moveError) {
                console.warn(t('plugins:error_d12e6b9a', { oldPath: oldPath, moveError: moveError.message }));
                backupPath = null;
            }
        }

        try {
            await this.deletePlugin(pluginId);
        } catch (deleteError) {
            if (backupPath) {
                await fse.move(backupPath, oldPath, { overwrite: true }).catch(() => {});
            }
            throw deleteError;
        }

        let newPlugin;
        try {
            newPlugin = await this.installFromGithub(botId, repoUrl, this.prisma, true, targetTag);
        } catch (installError) {
            if (backupPath) {
                try {
                    await fse.move(backupPath, oldPath, { overwrite: true });
                    const restored = await this.registerPlugin(botId, oldPath, 'GITHUB', repoUrl, this.prisma, {
                        sourceRefType: plugin.sourceRefType,
                        sourceRef: plugin.sourceRef,
                    });
                    await this.prisma.installedPlugin.update({
                        where: { id: restored.id },
                        data: {
                            settings: backupData.settings,
                            isEnabled: backupData.isEnabled,
                        },
                    });
                    await this.loadPluginGraphs(botId, restored.id, oldPath);
                    if (this.botManager) {
                        await this.botManager.reloadPlugins(botId);
                    }
                    console.warn(t('plugins:success_aa650e34', { plugin: plugin.name, oldVersion: oldVersion }));
                } catch (restoreError) {
                    console.error(t('plugins:error_8f428f3a', { plugin: plugin.name }), restoreError);
                }
            }
            throw installError;
        }

        if (backupPath) {
            await safeRemove(backupPath);
        }

        const oldMajor = semver.major(semver.coerce(oldVersion) || '0.0.0');
        const newMajor = semver.major(semver.coerce(newPlugin.version) || '0.0.0');
        const isMajorUpdate = newMajor > oldMajor;

        if (isMajorUpdate) {
            await this.prisma.installedPlugin.update({
                where: { id: newPlugin.id },
                data: { isEnabled: backupData.isEnabled },
            });
        } else if (backupData.settings) {
            try {
                await this.prisma.installedPlugin.update({
                    where: { id: newPlugin.id },
                    data: {
                        settings: backupData.settings,
                        isEnabled: backupData.isEnabled,
                    },
                });
            } catch (settingsError) {
                console.error(t('plugins:error_0dee7000', { plugin: plugin.name }), settingsError);
            }
        }

        try {
            const pluginHooks = new PluginHooks({ prisma: this.prisma });
            await pluginHooks.callOnUpdate(newPlugin.id, oldVersion, newPlugin.version);
        } catch (hookError) {
            console.error(t('plugins:error_a028506a', { plugin: plugin.name }), hookError);
        }

        return newPlugin;
    }

    async loadPluginGraphs(botId, pluginId, pluginPath) {
        const plugin = await this.prisma.installedPlugin.findUnique({ where: { id: pluginId } });
        if (!plugin) {
            console.error(t('plugins:log_39f3dfe8', { pluginId: pluginId }));
            return;
        }

        try {
            const graphDir = path.join(pluginPath, 'graph');
            if (!await fse.pathExists(graphDir)) {
                return;
            }

            const graphFiles = await fse.readdir(graphDir);
            const jsonFiles = graphFiles.filter((file) => file.endsWith('.json'));

            for (const fileName of jsonFiles) {
                try {
                    const graphName = path.basename(fileName, '.json');
                    const graphPath = path.join(graphDir, fileName);
                    const graphData = await fse.readJson(graphPath);

                    const hasCommandNode = graphData.nodes?.some((node) => node.type === 'event:command');
                    const hasEventNode = graphData.nodes?.some((node) => node.type?.startsWith('event:') && node.type !== 'event:command');

                    if (hasCommandNode) {
                        const existing = await this.prisma.command.findFirst({
                            where: { botId, name: graphName, pluginOwnerId: pluginId },
                        });
                        if (existing) continue;

                        await this.prisma.command.create({
                            data: {
                                botId,
                                name: graphName,
                                description: graphData.command || t('plugins:msg_5dca5459', { graphName: graphName }),
                                graphJson: JSON.stringify(graphData),
                                isEnabled: true,
                                pluginOwnerId: pluginId,
                                owner: `plugin:${plugin.name}`,
                                isVisual: true,
                            },
                        });
                    } else if (hasEventNode) {
                        const existing = await this.prisma.eventGraph.findFirst({
                            where: { botId, name: graphName, pluginOwnerId: pluginId },
                        });
                        if (existing) continue;

                        await this.prisma.eventGraph.create({
                            data: {
                                botId,
                                name: graphName,
                                graphJson: JSON.stringify(graphData),
                                isEnabled: true,
                                pluginOwnerId: pluginId,
                            },
                        });
                    } else {
                        console.warn(t('plugins:log_2bbcc0d0', { fileName: fileName }));
                    }
                } catch (error) {
                    console.error(t('plugins:error_d360bce6', { fileName: fileName }), error);
                }
            }
        } catch (error) {
            console.error(t('plugins:error_dc26c1b0'), error);
        }
    }

    async clearPluginData(pluginId) {
        const plugin = await this.prisma.installedPlugin.findUnique({ where: { id: pluginId } });
        if (!plugin) {
            throw new Error(t('plugins:msg_7ab2db23'));
        }

        const { count } = await this.prisma.pluginDataStore.deleteMany({
            where: { pluginName: plugin.name, botId: plugin.botId },
        });

        return { count };
    }

    async reloadLocalPlugin(pluginId) {
        const plugin = await this.prisma.installedPlugin.findUnique({ where: { id: pluginId } });
        if (!plugin) throw new Error(t('plugins:msg_7ab2db23'));

        if (plugin.sourceType !== 'LOCAL' && plugin.sourceType !== 'LOCAL_IDE') {
            throw new Error(t('plugins:msg_e1dd9ab6'));
        }

        const pluginPath = plugin.path;
        const packageJsonPath = path.join(pluginPath, 'package.json');
        if (!await fse.pathExists(packageJsonPath)) {
            throw new Error(t('plugins:msg_a539d45a', { packageJsonPath: packageJsonPath }));
        }

        let packageJson;
        try {
            packageJson = JSON.parse(await fse.readFile(packageJsonPath, 'utf-8'));
        } catch (e) {
            throw new Error(t('plugins:error_9a559b2a', { e: e.message }));
        }

        const manifest = packageJson.botpanel || {};
        const stampPath = path.join(pluginPath, '.bm-installed-deps.json');
        const nextStamp = JSON.stringify(packageJson.dependencies || {});
        let previousStamp = '';
        if (await fse.pathExists(stampPath)) {
            previousStamp = await fse.readFile(stampPath, 'utf8');
        }
        const nodeModulesPath = path.join(pluginPath, 'node_modules');
        if (nextStamp !== previousStamp || (nextStamp !== '{}' && !await fse.pathExists(nodeModulesPath))) {
            await this._installDependencies(pluginPath);
            await fse.writeFile(stampPath, nextStamp);
        }

        const updatedPlugin = await this.prisma.installedPlugin.update({
            where: { id: pluginId },
            data: {
                version: packageJson.version,
                description: packageJson.description || '',
                manifest: JSON.stringify(manifest),
            },
        });

        if (this.botManager) {
            await this.botManager.reloadPlugins(plugin.botId, plugin.name);
        }

        return updatedPlugin;
    }
}

module.exports = PluginManager;

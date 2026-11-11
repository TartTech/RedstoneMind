const {
    shortSha,
    firstLine,
    isDefaultBranch,
    isSafeRef,
    officialUpdateRef,
    officialFetchRefspec,
    mapGithubCommit,
    parseGitLogLine,
    parseListeningPids,
    resolveUpdateDecision,
    resolveRestartMethod,
    getPm2Target,
} = require('../../core/services/PanelUpdateService');
const { t } = require('../../i18n');

describe('PanelUpdateService helpers', () => {
    test(t('tests:msg_ca5beeae'), () => {
        expect(shortSha('abcdef1234567890')).toBe('abcdef1');
        expect(shortSha('')).toBe('');
        expect(shortSha(null)).toBe('');
    });

    test(t('tests:msg_04a31bad'), () => {
        expect(firstLine('feat: panel update\n\nlonger body')).toBe('feat: panel update');
        expect(firstLine('')).toBe('');
    });

    test(t('tests:msg_43a825fd'), () => {
        expect(isDefaultBranch('master', 'main')).toBe(true);
        expect(isDefaultBranch('main', 'master')).toBe(true);
        expect(isDefaultBranch('HEAD', 'master')).toBe(true);
        expect(isDefaultBranch('feat/update', 'master')).toBe(false);
        expect(isDefaultBranch('develop', 'develop')).toBe(true);
    });

    test(t('tests:msg_3d3f7c2c'), () => {
        expect(isSafeRef('master')).toBe(true);
        expect(isSafeRef('feat/panel-update')).toBe(true);
        expect(isSafeRef('-c')).toBe(false);
        expect(isSafeRef('main; rm -rf /')).toBe(false);
        expect(isSafeRef('abc..def')).toBe(false);
    });

    test(t('tests:success_e3677fdf'), () => {
        expect(officialUpdateRef('master')).toBe('refs/panel-update/master');
        expect(officialFetchRefspec('master')).toBe('+refs/heads/master:refs/panel-update/master');
        expect(officialFetchRefspec('-c')).toBe('+refs/heads/master:refs/panel-update/master');
    });

    test(t('tests:msg_54115e76'), () => {
        const sample = [
            'TCP    127.0.0.1:3001         0.0.0.0:0              LISTENING       12345',
            'TCP    127.0.0.1:5173         0.0.0.0:0              LISTENING       67890',
            'TCP    127.0.0.1:3001         127.0.0.1:54321        ESTABLISHED     11111',
        ].join('\n');
        expect(parseListeningPids(sample, 3001)).toEqual(['12345']);
        expect(parseListeningPids(sample, 5173)).toEqual(['67890']);
    });

    test(t('tests:msg_16172806'), () => {
        const mapped = parseGitLogLine('abcdef1234567890\x1ffeat: panel\x1fmerka\x1f2026-09-25T15:32:00+03:00');
        expect(mapped.shortSha).toBe('abcdef1');
        expect(mapped.message).toBe('feat: panel');
        expect(mapped.author).toBe('merka');
    });

    test(t('tests:msg_6bb06eaf'), () => {
        const mapped = mapGithubCommit({
            sha: '1234567890abcdef',
            html_url: 'https://github.com/TartTech/redstonemind/commit/1234567890abcdef',
            commit: {
                message: 'fix: bot kick\n\ndetails',
                author: { name: 'merka', date: '2026-09-24T10:00:00Z' },
            },
        });
        expect(mapped.shortSha).toBe('1234567');
        expect(mapped.message).toBe('fix: bot kick');
        expect(mapped.author).toBe('merka');
    });
});

describe('resolveUpdateDecision', () => {
    const base = {
        hasGit: true,
        gitAvailable: true,
        localSha: 'aaa1111aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        remoteSha: 'bbb2222bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
        dirty: false,
        branch: 'master',
        defaultBranch: 'master',
        compareStatus: 'behind',
        behindBy: 4,
        localVersion: '1.27.1',
        remoteVersion: '1.27.1',
    };

    test(t('tests:msg_d5176d44'), () => {
        expect(resolveUpdateDecision(base)).toEqual({
            updateAvailable: true,
            canUpdate: true,
            reason: null,
        });
    });

    test(t('tests:success_5dab83f1'), () => {
        const sha = base.localSha;
        expect(resolveUpdateDecision({
            ...base,
            remoteSha: sha,
            compareStatus: 'identical',
            behindBy: 0,
        })).toEqual({
            updateAvailable: false,
            canUpdate: false,
            reason: 'same',
        });
    });

    test(t('tests:msg_a7dd4c16'), () => {
        expect(resolveUpdateDecision({
            ...base,
            hasGit: false,
            gitAvailable: false,
            localSha: '',
            compareStatus: 'unknown',
            behindBy: 0,
            localVersion: '1.27.1',
            remoteVersion: '1.28.0',
        })).toEqual({
            updateAvailable: true,
            canUpdate: false,
            reason: 'not_git',
        });
    });

    test(t('tests:msg_5b8c94de'), () => {
        expect(resolveUpdateDecision({ ...base, dirty: true })).toEqual({
            updateAvailable: true,
            canUpdate: true,
            reason: null,
        });
    });

    test(t('tests:msg_3a58e4e3'), () => {
        expect(resolveUpdateDecision({ ...base, branch: 'feat/foo' })).toEqual({
            updateAvailable: true,
            canUpdate: false,
            reason: 'wrong_branch',
        });
    });

    test(t('tests:msg_fa859cc9'), () => {
        expect(resolveUpdateDecision({
            ...base,
            compareStatus: 'diverged',
            behindBy: 2,
        })).toEqual({
            updateAvailable: true,
            canUpdate: false,
            reason: 'diverged',
        });
    });

    test(t('tests:msg_0a07bd81'), () => {
        expect(resolveRestartMethod({ NODE_ENV: 'production', pm_id: '0' })).toBe('pm2');
        expect(getPm2Target({ pm_id: '0', name: 'redstonemind' })).toBe('0');
        expect(resolveRestartMethod({ NODE_ENV: 'production' })).toBe('spawn');
        expect(resolveRestartMethod({ NODE_ENV: 'development' })).toBe('nodemon');
    });

    test(t('tests:success_4e4be835'), () => {
        expect(resolveUpdateDecision({
            ...base,
            remoteSha: '',
            remoteVersion: '',
            compareStatus: 'unknown',
            behindBy: 0,
        })).toEqual({
            updateAvailable: false,
            canUpdate: false,
            reason: 'offline',
        });
    });
});

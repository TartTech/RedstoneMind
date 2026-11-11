const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { t } = require('./i18n');

const DATA_DIR = path.join(os.homedir(), '.redstonemind');
const CONFIG_PATH = path.join(DATA_DIR, 'config.json');

let config = null;

function generateInitialConfig() {
    console.log(t('core:log_d13ebca1'));

    const newConfig = {
        server: {
            host: '0.0.0.0',
            port: 3001,
            allowExternalAccess: true,
        },
        security: {
            jwtSecret: crypto.randomBytes(64).toString('hex'),
            encryptionKey: crypto.randomBytes(32).toString('hex'),
            adminRecoveryCode: `bmr-${crypto.randomBytes(12).toString('hex')}`
        },
        telemetry: {
            enabled: true
        }
    };

    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2), 'utf-8');
    
    console.log('================================================================');
    console.log(t('core:msg_0e194790'));
    console.log(t('core:success_e9f32676', { CONFIG_PATH: CONFIG_PATH }));
    
    console.log(t('core:msg_190a035b'));
    console.log(t('core:msg_1a0e908e'));
    
    console.log(t('core:msg_1512d70c'));
    console.log(t('core:msg_4293d986'));
    console.log(t('core:msg_b8b9e121', { newConfig: newConfig.security.adminRecoveryCode }));
    console.log('================================================================');

    return newConfig;
}

function loadConfig() {
    if (config) {
        return config;
    }

    try {
        if (fs.existsSync(CONFIG_PATH)) {
            const fileContent = fs.readFileSync(CONFIG_PATH, 'utf-8');
            config = JSON.parse(fileContent);
            console.log(t('core:success_543c3bf6', { CONFIG_PATH: CONFIG_PATH }));
        } else {
            config = generateInitialConfig();
        }
    } catch (error) {
        console.error(t('core:error_130f7018'), error);
        process.exit(1);
    }
    
    return config;
}

module.exports = loadConfig();
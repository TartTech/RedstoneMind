const { execute } = require('../restart_bot');
const { t } = require('../../../../i18n');

describe('bot:restart', () => {
    const originalSend = process.send;

    afterEach(() => {
        process.send = originalSend;
    });

    it(t('nodes:msg_82d91f78'), async () => {
        process.send = jest.fn();
        const effects = [];
        await execute({}, {
            __testMode: true,
            recordEffect: (effect) => effects.push(effect),
        });
        expect(process.send).not.toHaveBeenCalled();
        expect(effects).toEqual([{ kind: 'bot', operation: 'restart' }]);
    });

    it(t('nodes:msg_0ab08b78'), async () => {
        process.send = jest.fn();
        await execute({}, {});
        expect(process.send).toHaveBeenCalledWith({ type: 'restart' });
    });
});


import { apiHelper } from '@/lib/api';

export const createBotActionsSlice = (set, get) => ({
    createBot: async (botData) => {
        const newBot = await apiHelper('/api/bots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(botData),
        }, t('novyyBotUspeshnoSozdan'));
        
        if (newBot) {
            await get().fetchInitialData();
        }
        return newBot;
    },

    startBot: async (botId) => {
        await apiHelper(`/api/bots/${botId}/start`, { method: 'POST' });
    },

    stopBot: async (botId) => {
        await apiHelper(`/api/bots/${botId}/stop`, { method: 'POST' });
    },

    restartBot: async (botId) => {
        await apiHelper(`/api/bots/${botId}/restart`, { method: 'POST' });
    },
    
    deleteBot: async (botId) => {
        await apiHelper(`/api/bots/${botId}`, { method: 'DELETE' }, t('botUspeshnoUdalen'));
        await get().fetchInitialData();
    },

    startAllBots: async () => {
        await apiHelper('/api/bots/start-all', { method: 'POST' }, t('commandNaZapuskVsekhBotovOtpravlena'));
    },

    stopAllBots: async () => {
        await apiHelper('/api/bots/stop-all', { method: 'POST' }, t('commandNaOstanovkuVsekhBotovOtpravlena'));
    },

    applyProxyToBots: async (botIds, proxySettings) => {
        try {
            const result = await apiHelper('/api/bots/bulk-proxy-update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    botIds,
                    proxySettings
                })
            }, t('settingsProksiPrimenenyKBotidslengthBotam', { count: botIds.length }));
            
            if (result.success) {
                await get().fetchInitialData();
            }
            
            return result;
        } catch (error) {
            console.error('Failed to apply proxy settings:', error);
            throw error;
        }
    },
});
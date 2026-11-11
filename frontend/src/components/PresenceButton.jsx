import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useAppStore } from '@/stores/appStore';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const routeTitles = (path, metadata = {}, t) => {
	if (path === '/') return t('yesshbord');
	if (path.startsWith('/bots/')) {
		const parts = path.split('/');
		const id = parts[2];
		const botName = metadata.botName || t('botId', { id: id });

		// Проверяем любой путь с визуальным редактором (visual-editor or events/visual)
		if (path.includes('/visual-editor/') || path.includes('/events/visual/') || path.includes('/commands/visual/')) {
			const graphName = metadata.graphName || t('graf');
			return t('redaktorGraphnameBotaBotname', { graphName: graphName, botName: botName });
		}
		if (path.endsWith('/console')) return t('consoleBotaBotname', { botName: botName });
		if (path.endsWith('/plugins')) return t('pluginsBotaBotname', { botName: botName });
		if (path.endsWith('/settings')) return t('settingsBotaBotname', { botName: botName });
		if (path.endsWith('/events')) return t('eventsBotaBotname', { botName: botName });
		if (path.endsWith('/management')) return t('upravlenieBotaBotname', { botName: botName });
		return t('stranitsaBotaBotname', { botName: botName });
	}
	return path;
};

function sinceText(ts, t) {
	const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
	if (diffSec < 60) return t('diffsecSekAgo', { diffSec: diffSec });
	const m = Math.floor(diffSec / 60);
	return t('mMinAgo', { m: m });
}

export default function PresenceButton() {
    const { t } = useTranslation('common');
	const socket = useAppStore((s) => s.socket);
	const currentUser = useAppStore((s) => s.user);
	const bots = useAppStore((s) => s.bots);
	const { toast } = useToast();
	const [list, setList] = useState([]);
	const [enrichedList, setEnrichedList] = useState([]);
	const [tick, setTick] = useState(0);
	const location = useLocation();
	const navigate = useNavigate();

	const prevIdsRef = useRef(new Set());
	const lastLeftAtRef = useRef(() => {
		try {
			const raw = sessionStorage.getItem('presence:lastLeftAt');
			return raw ? new Map(Object.entries(JSON.parse(raw)).map(([k,v]) => [Number(k), Number(v)])) : new Map();
		} catch { return new Map(); }
	});
	if (typeof lastLeftAtRef.current === 'function') {
		lastLeftAtRef.current = lastLeftAtRef.current();
	}

	useEffect(() => {
		if (!socket) return;
		const handler = (payload) => {
			setList(payload || []);
			const currentIds = new Set((payload || []).map(u => u.userId));
			const prevIds = prevIdsRef.current;
			const now = Date.now();
			for (const uid of prevIds) {
				if (!currentIds.has(uid)) {
					lastLeftAtRef.current.set(uid, now);
				}
			}
			try {
				sessionStorage.setItem('presence:lastLeftAt', JSON.stringify(Object.fromEntries(lastLeftAtRef.current)));
			} catch {}
			for (const user of payload || []) {
				if (!prevIds.has(user.userId)) {
					if (!currentUser || user.userId !== currentUser.id) {
						const lastLeft = lastLeftAtRef.current.get(user.userId);
						if (!lastLeft || now - lastLeft >= 5 * 60 * 1000) {
							toast({ title: t('messages.userusernameZashelVPanel', { username: user.username }), description: routeTitles(user.path, user.metadata, t) });
						}
					}
				}
			}
			prevIdsRef.current = currentIds;
		};
		socket.on('presence:list', handler);
		return () => socket.off('presence:list', handler);
	}, [socket, toast, currentUser]);

	useEffect(() => {
		if (!socket) return;
		const interval = setInterval(() => socket.emit('presence:heartbeat'), 20000);
		return () => clearInterval(interval);
	}, [socket]);

	useEffect(() => {
		if (!socket) return;
		const cleanPath = location.pathname;
		socket.emit('presence:update', { path: cleanPath });
	}, [socket, location.pathname]);

	useEffect(() => {
		const interval = setInterval(() => setTick((v) => v + 1), 1000);
		return () => clearInterval(interval);
	}, []);
	useEffect(() => {
		const enrichedUsers = list.map((user) => {
			const match = user.path.match(/^\/bots\/(\d+)/);
			if (match) {
				const botId = parseInt(match[1]);
				const bot = bots.find(b => b.id === botId);

				if (!user.metadata?.botName && bot) {
					return {
						...user,
						metadata: {
							...user.metadata,
							botName: bot.username || bot.name || t('botBotid', { botId: botId })
						}
					};
				}
			}

			return user;
		});

		setEnrichedList(enrichedUsers);
	}, [list, bots]);

	const count = enrichedList.length;

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="ghost" className="h-9 px-2">
					<Users className="h-4 w-4 mr-2" /> {count}
				</Button>
			</PopoverTrigger>
			<PopoverContent align="end" className="w-80 max-w-[90vw] p-2">
				<div className="text-sm font-medium mb-2">{t('onlineNow')}</div>
				{count === 0 ? (
					<div className="text-xs text-muted-foreground">{t('nobodyOnline')}</div>
				) : (
					<ul className="space-y-1 max-h-64 overflow-auto">
						{enrichedList.map((u) => (
							<li key={u.userId} className="text-sm flex items-center justify-between">
								<div>
									<div className="font-medium">{u.username}</div>
									<div className="text-xs text-muted-foreground truncate">{routeTitles(u.path, u.metadata, t)}</div>
									<div className="text-[10px] text-muted-foreground">{sinceText(u.lastSeen, t)}</div>
								</div>
								<Button size="sm" variant="secondary" onClick={() => navigate(u.path)}>{t('open')}</Button>
							</li>
						))}
					</ul>
				)}
			</PopoverContent>
		</Popover>
	);
} 
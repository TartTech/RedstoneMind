import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from 'react-i18next';

export default function ProxyForm({ proxy, onSubmit, onCancel, isSaving }) {
    const { t } = useTranslation('proxies');
    const [formData, setFormData] = useState({
        name: '',
        type: 'socks5',
        host: '',
        port: '1080',
        username: '',
        password: '',
        note: ''
    });

    useEffect(() => {
        if (!proxy) {
            return;
        }

        setFormData({
            name: proxy.name || '',
            type: proxy.type || 'socks5',
            host: proxy.host || '',
            port: proxy.port?.toString() || '1080',
            username: proxy.username || '',
            password: proxy.password || '',
            note: proxy.note || ''
        });
    }, [proxy]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (value) => {
        setFormData((prev) => ({ ...prev, type: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(formData);
    };

    const isEditMode = !!proxy;

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{isEditMode ? t('titles.editProksi') : t('titles.addNovyyProksi')}</DialogTitle>
                <DialogDescription>
                    Заполните информацию о прокси-сервере. Боты смогут использовать этот прокси для подключения.
                </DialogDescription>
            </DialogHeader>
            <form id="proxy-form" onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Название</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder=t('placeholders.moyProksi') required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="type">Тип прокси</Label>
                    <Select value={formData.type} onValueChange={handleTypeChange}>
                        <SelectTrigger id="type">
                            <SelectValue placeholder=t('placeholders.vyberiteTipProksi') />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="socks5">SOCKS5</SelectItem>
                            <SelectItem value="http">HTTP</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="host">Хост</Label>
                        <Input id="host" name="host" value={formData.host} onChange={handleChange} placeholder="proxy.example.com" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="port">Порт</Label>
                        <Input id="port" name="port" type="number" value={formData.port} onChange={handleChange} placeholder="1080" required />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Имя пользователя (опционально)</Label>
                        <Input id="username" name="username" value={formData.username} onChange={handleChange} placeholder="user" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Пароль (опционально)</Label>
                        <PasswordInput id="password" name="password" value={formData.password} onChange={handleChange} placeholder="******" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="note">Заметка (опционально)</Label>
                    <Textarea id="note" name="note" value={formData.note} onChange={handleChange} placeholder=t('placeholders.descriptionIliZametki') />
                </div>
            </form>
            <DialogFooter>
                <Button variant="ghost" onClick={onCancel}>Отмена</Button>
                <Button type="submit" form="proxy-form" disabled={isSaving}>
                    {isSaving ? t('sokhranenie') : (isEditMode ? t('save') : t('create'))}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
}

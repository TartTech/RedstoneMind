import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Keyboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ShortcutRow = ({ keys, description, mac = false }) => {
    const { t } = useTranslation('plugins');
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const displayKeys = mac && isMac ? keys.replace('Ctrl', '⌘') : keys;

    return (
        <div className="flex items-center justify-between py-2 border-b last:border-0">
            <span className="text-sm text-muted-foreground">{description}</span>
            <kbd className="px-2 py-1 text-xs font-semibold bg-muted rounded">
                {displayKeys}
            </kbd>
        </div>
    );
};

const KeyboardShortcutsHelp = ({ isOpen, onClose }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Keyboard className="h-5 w-5" />
                        Горячие клавиши
                    </DialogTitle>
                    <DialogDescription>
                        Список всех доступных горячих клавиш в IDE
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {/* General */}
                    <div>
                        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                            Общие
                        </h3>
                        <div className="space-y-1">
                            <ShortcutRow keys="Ctrl+S" description={t('descriptions.saveFayl')} mac />
                            <ShortcutRow keys="Ctrl+W" description={t('descriptions.closeVkladku')} mac />
                            <ShortcutRow keys="Ctrl+N" description={t('descriptions.novyyFayl')} mac />
                            <ShortcutRow keys="Ctrl+P" description={t('descriptions.bystroeOtkrytieFayla')} mac />
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                            Навигация
                        </h3>
                        <div className="space-y-1">
                            <ShortcutRow keys="Ctrl+B" description={t('descriptions.pokazatskrytBokovuyuPanel')} mac />
                            <ShortcutRow keys="Ctrl+`" description={t('descriptions.pokazatskrytTerminal')} mac />
                            <ShortcutRow keys="Ctrl+Shift+E" description={t('descriptions.openExplorer')} mac />
                            <ShortcutRow keys="Ctrl+Shift+F" description={t('descriptions.globalnyyPoisk')} mac />
                            <ShortcutRow keys="Ctrl+Tab" description={t('descriptions.sleduyushchayaVkladka')} mac />
                            <ShortcutRow keys="Ctrl+Shift+Tab" description={t('descriptions.predydushchayaVkladka')} mac />
                        </div>
                    </div>

                    {/* Editor */}
                    <div>
                        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                            Редактор
                        </h3>
                        <div className="space-y-1">
                            <ShortcutRow keys="Ctrl+F" description={t('descriptions.naytiVFayle')} mac />
                            <ShortcutRow keys="Ctrl+H" description={t('descriptions.naytiIZamenit')} mac />
                            <ShortcutRow keys="Ctrl+/" description={t('descriptions.zakommentirovatStroku')} mac />
                            <ShortcutRow keys="Ctrl+D" description={t('descriptions.addSleduyushcheeVkhozhdenie')} mac />
                            <ShortcutRow keys="Alt+↑/↓" description={t('descriptions.peremestitStroku')} />
                            <ShortcutRow keys="Shift+Alt+↑/↓" description={t('descriptions.skopirovatStroku')} />
                            <ShortcutRow keys="Ctrl+Shift+K" description={t('descriptions.deleteStroku')} mac />
                            <ShortcutRow keys="Ctrl+Enter" description={t('descriptions.vstavitStrokuNizhe')} mac />
                            <ShortcutRow keys="Ctrl+Shift+Enter" description={t('descriptions.vstavitStrokuVyshe')} mac />
                        </div>
                    </div>

                    {/* Multi-cursor */}
                    <div>
                        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                            Мультикурсор
                        </h3>
                        <div className="space-y-1">
                            <ShortcutRow keys="Alt+Click" description={t('descriptions.addKursor')} />
                            <ShortcutRow keys="Ctrl+Alt+↑/↓" description={t('descriptions.addKursorVyshenizhe')} mac />
                            <ShortcutRow keys="Ctrl+D" description={t('descriptions.vydelitSleduyushcheeVkhozhdenie')} mac />
                            <ShortcutRow keys="Ctrl+Shift+L" description={t('descriptions.vydelitVseVkhozhdeniya')} mac />
                        </div>
                    </div>

                    {/* Code */}
                    <div>
                        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                            Код
                        </h3>
                        <div className="space-y-1">
                            <ShortcutRow keys="Ctrl+Space" description={t('descriptions.avtodopolnenie')} mac />
                            <ShortcutRow keys="Ctrl+Shift+Space" description={t('descriptions.podskazkaParametrov')} mac />
                            <ShortcutRow keys="F2" description={t('descriptions.pereimenovatSimvol')} />
                            <ShortcutRow keys="F12" description={t('descriptions.pereytiKOpredeleniyu')} />
                            <ShortcutRow keys="Shift+F12" description={t('descriptions.naytiVseSsylki')} />
                            <ShortcutRow keys="Ctrl+Shift+O" description={t('descriptions.pereytiKSimvoluVFayle')} mac />
                        </div>
                    </div>

                    {/* View */}
                    <div>
                        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                            Вид
                        </h3>
                        <div className="space-y-1">
                            <ShortcutRow keys="Ctrl++" description={t('descriptions.uvelichitMasshtab')} mac />
                            <ShortcutRow keys="Ctrl+-" description={t('descriptions.umenshitMasshtab')} mac />
                            <ShortcutRow keys="Ctrl+0" description={t('descriptions.resetMasshtab')} mac />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default KeyboardShortcutsHelp;

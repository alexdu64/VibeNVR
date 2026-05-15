import React from 'react';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const BulkActionsBar = ({ selectedCameraIds, setSelectedCameraIds, handleBulkDelete }) => {
    const { t } = useTranslation();
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-card/95 backdrop-blur-md border border-primary/20 shadow-2xl rounded-2xl px-6 py-4 flex items-center space-x-6 text-foreground min-w-[320px]">
                <div className="flex-1">
                    <p className="font-bold text-sm">{t('cameras.bulkBar.selected', { count: selectedCameraIds.length })}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{t('cameras.bulkBar.title')}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setSelectedCameraIds([])}
                        className="px-3 py-1.5 text-xs font-semibold hover:bg-muted/50 rounded-lg transition-colors"
                    >
                        {t('common.clear')}
                    </button>
                    <button
                        onClick={handleBulkDelete}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-all flex items-center shadow-lg shadow-red-500/20 active:scale-95"
                    >
                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                        {t('common.deleteSelected')}
                    </button>
                </div>
            </div>
        </div>
    );
};

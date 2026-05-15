import React from 'react';
import { Filter, Video, Image as ImageIcon, Play, Calendar, Brain } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const EventFilters = ({
    cameras,
    selectedCameraFilter,
    setSelectedCameraFilter,
    selectedTypeFilter,
    setSelectedTypeFilter,
    selectedObjectFilter,
    setSelectedObjectFilter,
    selectedDate,
    setSelectedDate,
    onReset,
    selectedHour,
    setSelectedHour,
    searchParams,
    setSearchParams
}) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-wrap items-center gap-3 mb-4 p-1">
            {/* Camera Filter */}
            <div className="relative">
                <select
                    className="appearance-none pl-3 pr-8 py-2 bg-card border border-border rounded-xl text-sm min-w-[140px] focus:ring-2 focus:ring-primary/20 outline-none transition-all hover:border-primary/50 text-foreground"
                    value={selectedCameraFilter}
                    onChange={(e) => {
                        setSelectedCameraFilter(e.target.value);
                        const newParams = new URLSearchParams(searchParams);
                        if (e.target.value === 'all') newParams.delete('camera');
                        else newParams.set('camera', e.target.value);
                        setSearchParams(newParams);
                    }}
                >
                    <option value="all">{t('timeline.filters.allCameras')}</option>
                    {cameras.map(cam => (
                        <option key={cam.id} value={cam.id}>{cam.name}</option>
                    ))}
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <Filter className="w-3.5 h-3.5" />
                </div>
            </div>

            {/* Media Type Filter */}
            <div className="relative">
                <select
                    className="appearance-none pl-3 pr-8 py-2 bg-card border border-border rounded-xl text-sm min-w-[120px] focus:ring-2 focus:ring-primary/20 outline-none transition-all hover:border-primary/50 text-foreground"
                    value={selectedTypeFilter}
                    onChange={(e) => {
                        setSelectedTypeFilter(e.target.value);
                        const newParams = new URLSearchParams(searchParams);
                        if (e.target.value === 'all') newParams.delete('type');
                        else newParams.set('type', e.target.value);
                        setSearchParams(newParams);
                    }}
                >
                    <option value="all">{t('timeline.filters.allMedia')}</option>
                    <option value="video">{t('timeline.filters.videos')}</option>
                    <option value="snapshot">{t('timeline.filters.snapshots')}</option>
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    {selectedTypeFilter === 'video' ? <Video className="w-3.5 h-3.5" /> : selectedTypeFilter === 'snapshot' ? <ImageIcon className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </div>
            </div>

            {/* Object Type Filter */}
            <div className="relative">
                <select
                    className="appearance-none pl-3 pr-8 py-2 bg-card border border-border rounded-xl text-sm min-w-[130px] focus:ring-2 focus:ring-primary/20 outline-none transition-all hover:border-primary/50 text-foreground"
                    value={selectedObjectFilter}
                    onChange={(e) => {
                        setSelectedObjectFilter(e.target.value);
                    }}
                >
                    <option value="all">{t('timeline.filters.allObjects')}</option>
                    <option value="person">{t('timeline.filters.person')}</option>
                    <option value="vehicle">{t('timeline.filters.vehicle')}</option>
                    <option value="dog">{t('timeline.filters.dog')}</option>
                    <option value="cat">{t('timeline.filters.cat')}</option>
                </select>
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <Brain className="w-3.5 h-3.5" />
                </div>
            </div>

            {/* Date Picker */}
            <div className="relative flex items-center">
                <input
                    type="date"
                    className="pl-9 pr-3 py-2 bg-card border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all hover:border-primary/50 text-foreground"
                    value={selectedDate}
                    onChange={(e) => {
                        setSelectedDate(e.target.value);
                        const newParams = new URLSearchParams(searchParams);
                        newParams.set('date', e.target.value);
                        setSearchParams(newParams);
                    }}
                />
                <Calendar className="absolute left-3 w-4 h-4 text-primary" />
            </div>

            {/* Reset Button */}
            <button
                onClick={onReset}
                className={`flex items-center space-x-1.5 px-3 py-2 border rounded-xl text-sm transition-all
                ${selectedDate === new Date().toLocaleDateString('en-CA') && selectedCameraFilter === 'all' && selectedTypeFilter === 'all' && selectedObjectFilter === 'all'
                        ? 'bg-primary/10 border-primary/20 text-primary font-medium'
                        : 'bg-card border-border hover:bg-accent text-muted-foreground'
                    }`}
            >
                <span>{t('common.reset')}</span>
            </button>

            {/* Selected Hour Active Filter */}
            {selectedHour !== null && (
                <button
                    onClick={() => setSelectedHour(null)}
                    className="px-3 py-2 text-sm bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
                >
                    <span className="font-bold">{selectedHour}:00</span>
                    <span className="opacity-70">✕</span>
                </button>
            )}
        </div>
    );
};

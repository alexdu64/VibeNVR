import React from 'react';
import { Monitor } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CollapsibleSection } from '../../../components/ui/CollapsibleSection';
import { SelectField } from '../../../components/ui/FormControls';

export const LiveViewLayoutSettings = ({
    liveViewColumns,
    setLiveViewColumns,
    isOpen,
    onToggle
}) => {
    const { t } = useTranslation();
    return (
        <CollapsibleSection
            id="liveview"
            title={t('settings.liveView.title')}
            description={t('settings.liveView.description')}
            icon={<Monitor className="w-6 h-6" />}
            isOpen={isOpen}
            onToggle={onToggle}
        >
            <div className="space-y-4">
                <SelectField
                    label={t('settings.liveView.gridColumns')}
                    value={liveViewColumns}
                    onChange={(val) => setLiveViewColumns(val)}
                    className="max-w-full sm:max-w-xs"
                    help={t('settings.liveView.gridColumnsHelp')}
                    options={[
                        { value: 'auto', label: t('settings.liveView.autoColumns') },
                        { value: '1', label: t('settings.liveView.column1') },
                        { value: '2', label: t('settings.liveView.column2') },
                        { value: '3', label: t('settings.liveView.column3') },
                        { value: '4', label: t('settings.liveView.column4') }
                    ]}
                />
            </div>
        </CollapsibleSection>
    );
};

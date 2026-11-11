import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import i18n from '@/i18n';

/**
 * Settings for ноды math:random_number
 */
function MathRandomNumberSettings({ nodeId, data, updateNodeData }) {
  const { t } = useTranslation('visual-editor');

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="min">{i18n.t('nodeSettings.minimumDefault')}</Label>
        <Input
          id="min"
          type="text"
          value={data.min ?? '0'}
          onChange={(e) => updateNodeData(nodeId, { min: e.target.value })}
          placeholder="0"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {i18n.t('nodeSettings.usedWhenPinDisconnected', { pin: 'Min' })}
        </p>
      </div>

      <div>
        <Label htmlFor="max">{i18n.t('nodeSettings.maximumDefault')}</Label>
        <Input
          id="max"
          type="text"
          value={data.max ?? '1'}
          onChange={(e) => updateNodeData(nodeId, { max: e.target.value })}
          placeholder="1"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {i18n.t('nodeSettings.usedWhenPinDisconnected', { pin: 'Max' })}
        </p>
      </div>

      <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
        {i18n.t('nodeHelp.mathRandom.note')}
      </div>
    </div>
  );
}

export default MathRandomNumberSettings;

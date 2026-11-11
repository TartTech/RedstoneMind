import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import i18n from '@/i18n';

/**
 * Component настроек for object:create ноды
 */
const ObjectCreateSettings = ({ nodeId, data, updateNodeData }) => {
  const { t } = useTranslation('visual-editor');

  return (
    <div className="p-2 border-t border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <Label>{i18n.t('nodeSettings.mode')}</Label>
        <Select
          value={data.advanced ? 'advanced' : 'simple'}
          onValueChange={(value) => updateNodeData(nodeId, { advanced: value === 'advanced' })}
        >
          <SelectTrigger className="visual-editor-node-input w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="simple">{i18n.t('nodeSettings.simple')}</SelectItem>
            <SelectItem value="advanced">{i18n.t('nodeSettings.advanced')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {data.advanced ? (
        <div>
          <Label>{i18n.t('nodeSettings.jsonObject')}</Label>
          <textarea
            className="visual-editor-node-input nodrag h-32 w-full rounded-md p-2 text-sm font-mono resize-none"
            value={data.jsonValue || '{}'}
            onChange={(e) => updateNodeData(nodeId, { jsonValue: e.target.value })}
            placeholder='{"key": "value", "nested": {"inner": 123}}'
          />
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={() => updateNodeData(nodeId, { pinCount: (data.pinCount || 0) + 1 })}
            className="h-8 rounded-md px-3 text-xs"
          >
            {i18n.t('nodeSettings.add')}
          </Button>
          {(data.pinCount || 0) > 0 && (
            <Button
              onClick={() => updateNodeData(nodeId, { pinCount: (data.pinCount || 0) - 1 })}
              variant="destructive"
              className="h-8 rounded-md px-3 text-xs"
            >
              {i18n.t('nodeSettings.remove')}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ObjectCreateSettings;

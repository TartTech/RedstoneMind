import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import i18n from '@/i18n';

/**
 * Component настроек for data:cast ноды
 */
const DataCastSettings = ({ nodeId, data, updateNodeData }) => {
  const { t } = useTranslation('visual-editor');

  return (
    <div className="p-2 border-t border-slate-700">
      <Label>{i18n.t('nodeSettings.targetType')}</Label>
      <Select
        value={data.targetType || 'String'}
        onValueChange={(value) => updateNodeData(nodeId, { targetType: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder={i18n.t('nodeSettings.selectType')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="String">{i18n.t('nodeSettings.castString')}</SelectItem>
          <SelectItem value="Number">{i18n.t('nodeSettings.castNumber')}</SelectItem>
          <SelectItem value="Boolean">{i18n.t('nodeSettings.castBoolean')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DataCastSettings;

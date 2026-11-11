import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import i18n from '@/i18n';

/**
 * Component настроек for data:boolean_literal ноды
 */
const DataBooleanLiteralSettings = ({ nodeId, data, updateNodeData }) => {
  const { t } = useTranslation('visual-editor');

  return (
    <div className="p-2 border-t border-slate-700">
      <Label>{i18n.t('nodeSettings.value')}</Label>
      <Select
        value={data.value ? 'true' : 'false'}
        onValueChange={(value) => updateNodeData(nodeId, { value: value === 'true' })}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">{i18n.t('nodeSettings.booleanTrue')}</SelectItem>
          <SelectItem value="false">{i18n.t('nodeSettings.booleanFalse')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DataBooleanLiteralSettings;

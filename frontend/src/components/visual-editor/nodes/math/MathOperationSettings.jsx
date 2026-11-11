import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import i18n from '@/i18n';

/**
 * Component настроек for math:operation ноды
 */
const MathOperationSettings = ({ nodeId, data, updateNodeData }) => {
  const { t } = useTranslation('visual-editor');

  return (
    <div className="p-2 border-t border-slate-700">
      <Label>{i18n.t('nodeSettings.operator')}</Label>
      <Select
        value={data.operation || '+'}
        onValueChange={(value) => updateNodeData(nodeId, { operation: value })}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="+">{i18n.t('nodeSettings.mathAdd')}</SelectItem>
          <SelectItem value="-">{i18n.t('nodeSettings.mathSubtract')}</SelectItem>
          <SelectItem value="*">{i18n.t('nodeSettings.mathMultiply')}</SelectItem>
          <SelectItem value="/">{i18n.t('nodeSettings.mathDivide')}</SelectItem>
          <SelectItem value=">">{i18n.t('nodeSettings.compareGreater')}</SelectItem>
          <SelectItem value="<">{i18n.t('nodeSettings.compareLess')}</SelectItem>
          <SelectItem value="==">{i18n.t('nodeSettings.compareEquals')}</SelectItem>
          <SelectItem value=">=">{i18n.t('nodeSettings.compareGreaterOrEqual')}</SelectItem>
          <SelectItem value="<=">{i18n.t('nodeSettings.compareLessOrEqual')}</SelectItem>
          <SelectItem value="!=">{i18n.t('nodeSettings.compareNotEquals')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MathOperationSettings;

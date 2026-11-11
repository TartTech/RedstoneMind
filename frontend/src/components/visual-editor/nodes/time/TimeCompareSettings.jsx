import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import i18n from '@/i18n';

/**
 * Component настроек for time:compare ноды
 */
const TimeCompareSettings = ({ nodeId, data, updateNodeData, nodeEdges }) => {
  const { t } = useTranslation('visual-editor');
  const hasOperationConnection = nodeEdges?.some(edge =>
    edge.target === nodeId && edge.targetHandle === 'operation'
  );

  if (hasOperationConnection) {
    return null;
  }

  return (
    <div className="p-2 border-t border-slate-700">
      <Label>{i18n.t('nodeSettings.operator')}</Label>
      <Select value={data.operation || 'before'} onValueChange={(value) => updateNodeData(nodeId, { operation: value })}>
        <SelectTrigger>
          <SelectValue placeholder={i18n.t('nodeSettings.selectOperation')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="before">{i18n.t('nodeSettings.timeBefore')}</SelectItem>
          <SelectItem value="after">{i18n.t('nodeSettings.timeAfter')}</SelectItem>
          <SelectItem value="equal">{i18n.t('nodeSettings.timeEqual')}</SelectItem>
          <SelectItem value="before_or_equal">{i18n.t('nodeSettings.timeBeforeOrEqual')}</SelectItem>
          <SelectItem value="after_or_equal">{i18n.t('nodeSettings.timeAfterOrEqual')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeCompareSettings;

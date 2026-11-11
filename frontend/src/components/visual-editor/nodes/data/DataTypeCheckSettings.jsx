import React from 'react';
import { useTranslation } from 'react-i18next';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import i18n from '@/i18n';

/**
 * Component настроек for data:type_check ноды
 */
const DataTypeCheckSettings = ({ nodeId, data, updateNodeData }) => {
  const { t } = useTranslation('visual-editor');

  return (
    <div className="p-2 border-t border-slate-700">
      <Label>{i18n.t('nodeSettings.checkType')}</Label>
      <Select
        value={data.checkType || 'string'}
        onValueChange={(value) => updateNodeData(nodeId, { checkType: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder={i18n.t('nodeSettings.selectType')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="string">{i18n.t('nodeSettings.typeString')}</SelectItem>
          <SelectItem value="number">{i18n.t('nodeSettings.typeNumber')}</SelectItem>
          <SelectItem value="numeric_string">{i18n.t('nodeSettings.typeNumericString')}</SelectItem>
          <SelectItem value="boolean">{i18n.t('nodeSettings.typeBoolean')}</SelectItem>
          <SelectItem value="array">{i18n.t('nodeSettings.typeArray')}</SelectItem>
          <SelectItem value="object">{i18n.t('nodeSettings.typeObject')}</SelectItem>
          <SelectItem value="null">{i18n.t('nodeSettings.typeNull')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DataTypeCheckSettings;

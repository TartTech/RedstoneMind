import React from 'react';
import { useTranslation } from 'react-i18next';
import { AutosizeInput } from '@/components/ui/AutosizeInput';
import i18n from '@/i18n';

/**
 * Component настроек for data:string_literal ноды
 */
const StringLiteralSettings = ({ nodeId, data, updateNodeData }) => {
  const { t } = useTranslation('visual-editor');

  return (
    <div className="p-2 w-full">
      <AutosizeInput
        className="visual-editor-node-input nodrag w-full rounded-md py-1 px-2 text-sm resize-none overflow-hidden"
        fullWidth
        value={data.value ?? ''}
        onChange={(e) => updateNodeData(nodeId, { value: e.target.value })}
        placeholder={i18n.t('nodeSettings.stringLiteralPlaceholder')}
      />
    </div>
  );
};

export default StringLiteralSettings;

import React from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

/**
 * Settings for ноды flow:for_each
 */
function FlowForEachSettings({ nodeId, data, updateNodeData }) {
  const { t } = useTranslation('visual-editor');

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        <p>{i18n.t('nodeHelp.flowForEach.intro')}</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>{i18n.t('nodeHelp.flowForEach.item1')}</li>
          <li>{i18n.t('nodeHelp.flowForEach.item2')}</li>
          <li>{i18n.t('nodeHelp.flowForEach.item3')}</li>
          <li>{i18n.t('nodeHelp.flowForEach.item4')}</li>
          <li>{i18n.t('nodeHelp.flowForEach.item5')}</li>
        </ul>
      </div>

      <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
        {i18n.t('nodeHelp.flowForEach.note')}
      </div>
    </div>
  );
}

export default FlowForEachSettings;

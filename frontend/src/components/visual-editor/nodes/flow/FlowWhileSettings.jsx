import React from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

/**
 * Settings for ноды flow:while
 */
function FlowWhileSettings({ nodeId, data, updateNodeData }) {
  const { t } = useTranslation('visual-editor');

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        <p>{i18n.t('nodeHelp.flowWhile.intro')}</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>{i18n.t('nodeHelp.flowWhile.item1')}</li>
          <li>{i18n.t('nodeHelp.flowWhile.item2')}</li>
          <li>{i18n.t('nodeHelp.flowWhile.item3')}</li>
          <li>{i18n.t('nodeHelp.flowWhile.item4')}</li>
        </ul>
      </div>

      <div className="text-xs text-muted-foreground p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
        {i18n.t('nodeHelp.flowWhile.warning')}
      </div>

      <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
        {i18n.t('nodeHelp.flowWhile.note')}
      </div>
    </div>
  );
}

export default FlowWhileSettings;

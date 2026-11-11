import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

/**
 * Переиспользуемый диалог подтверждения.
 * @param {object} props
 * @param {boolean} props.open - State, открыт ли диалог
 * @param {function} props.onOpenChange - Function for изменения состояния open
 * @param {string} props.title - Заголовок диалога
 * @param {string|React.ReactNode} props.description - Description/тело диалога
 * @param {function} props.onConfirm - Function, выполняемая при подтверждении
 * @param {string} [props.confirmText='Confirm'] - Текст на кнопке подтверждения
 * @param {string} [props.cancelText='Cancel'] - Текст на кнопке отмены
 */
export default function ConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = t('confirm.confirm'),
  cancelText = t('cancel'),
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
              onOpenChange(false);
            }}
            className={buttonVariants({ variant: "destructive" })}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
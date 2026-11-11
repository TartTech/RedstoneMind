import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ProtectedRoute = ({ children, requiredPermission }) => {
    const { t } = useTranslation('common');
    const hasPermission = useAppStore((state) => state.hasPermission);
    const authInitialized = useAppStore((state) => state.authInitialized);
    const { toast } = useToast();

    const canAccess = hasPermission(requiredPermission);

    useEffect(() => {
        if (authInitialized && !canAccess) {
            toast({
                variant: 'destructive',
                title: t('titles.accessDenied'),
                description: t('descriptions.uVasNedostatochnoPravDlyaProsmotra'),
            });
        }
    }, [canAccess, authInitialized, toast]);

    if (!authInitialized) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin" />
            </div>
        );
    }

    return canAccess ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
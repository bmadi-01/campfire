import { Navigate } from "react-router-dom";
import {type ReactNode } from "react";

interface PrivateRouteProps {
    children: ReactNode;
    requiredRole?: string; // optionnel (ADMIN, UTILISATEUR, etc.)
}

function PrivateRoute({ children, requiredRole }: PrivateRouteProps) {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("utilisateur");

    // Pas connecté
    if (!token || !storedUser) {
        return <Navigate to="/login" replace />;
    }

    const user = JSON.parse(storedUser);

    // Vérification du rôle si nécessaire
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}

export default PrivateRoute;

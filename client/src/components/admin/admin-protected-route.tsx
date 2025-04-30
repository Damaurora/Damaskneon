import { useEffect, useState } from "react";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";

interface AdminProtectedRouteProps {
  component: React.ComponentType;
}

export function AdminProtectedRoute({
  component: Component,
}: AdminProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Проверка авторизации из localStorage
    const checkAuth = () => {
      const auth = localStorage.getItem("isAdminAuthenticated");
      setIsAuthenticated(auth === "true");
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/auth" />;
  }

  return <Component />;
}
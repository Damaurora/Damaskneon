import { useState } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, Package, Newspaper, Store, Settings } from "lucide-react";
import ProductsTab from "@/components/admin/products-tab";
import NewsTab from "@/components/admin/news-tab";
import StoresTab from "@/components/admin/stores-tab";
import SettingsTab from "@/components/admin/settings-tab";

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const handleLogout = () => {
    setIsLoggingOut(true);
    
    // Имитация задержки для лучшего UX
    setTimeout(() => {
      localStorage.removeItem("isAdminAuthenticated");
      
      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из панели администратора",
      });
      
      setLocation("/");
      setIsLoggingOut(false);
    }, 500);
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Шапка админки */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto py-4 px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-unbounded neon-text">
              <span className="hidden sm:inline">Панель администратора</span>
              <span className="sm:hidden">Управление</span>
            </h1>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              disabled={isLoggingOut}
              size="sm"
              className="sm:h-10 sm:px-4 h-9 px-2"
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 sm:mr-2" />
              ) : (
                <LogOut className="h-4 w-4 sm:mr-2" />
              )}
              <span className="hidden sm:inline">Выйти</span>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Основной контент */}
      <main className="container mx-auto py-6 px-4">
        <Tabs defaultValue="products">
          {/* Адаптивные табы: иконки на мобильных устройствах, текст на больших экранах */}
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="products" className="flex items-center justify-center">
              <Package className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline">Товары</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center justify-center">
              <Newspaper className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline">Новости</span>
            </TabsTrigger>
            <TabsTrigger value="stores" className="flex items-center justify-center">
              <Store className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline">Магазины</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center justify-center">
              <Settings className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline">Настройки</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>
          
          <TabsContent value="news">
            <NewsTab />
          </TabsContent>
          
          <TabsContent value="stores">
            <StoresTab />
          </TabsContent>
          
          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
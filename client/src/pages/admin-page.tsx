import { useState } from "react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, Package, Newspaper, Store } from "lucide-react";
import ProductsTab from "@/components/admin/products-tab";
import NewsTab from "@/components/admin/news-tab";
import StoresTab from "@/components/admin/stores-tab";

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
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-unbounded neon-text">Панель администратора</h1>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4 mr-2" />
              )}
              Выйти
            </Button>
          </div>
        </div>
      </header>
      
      {/* Основной контент */}
      <main className="container mx-auto py-6 px-4">
        <Tabs defaultValue="products">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="products" className="flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Товары
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center">
              <Newspaper className="h-4 w-4 mr-2" />
              Новости
            </TabsTrigger>
            <TabsTrigger value="stores" className="flex items-center">
              <Store className="h-4 w-4 mr-2" />
              Магазины
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
        </Tabs>
      </main>
    </div>
  );
}
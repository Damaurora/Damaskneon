import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type FormData = {
  username: string;
  password: string;
};

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      // Локальная проверка учетных данных (только для демо)
      if (data.username === 'admin' && data.password === '321') {
        // Устанавливаем флаг авторизации в localStorage
        localStorage.setItem('isAdminAuthenticated', 'true');
        
        toast({
          title: "Авторизация успешна",
          description: "Добро пожаловать в панель администратора",
          variant: "default",
        });
        
        // Перенаправляем на страницу администратора
        setLocation("/admin");
      } else {
        toast({
          title: "Ошибка авторизации",
          description: "Неверный логин или пароль",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка авторизации",
        description: "Произошла ошибка при входе в систему",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md neon-border shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-unbounded">Панель администратора</CardTitle>
          <CardDescription>Войдите в систему, чтобы получить доступ</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Имя пользователя</Label>
                <Input
                  id="username"
                  type="text"
                  className="border-secondary"
                  {...register("username", { required: "Введите имя пользователя" })}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  className="border-secondary"
                  {...register("password", { required: "Введите пароль" })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Вход..." : "Войти"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => setLocation("/")}>
            Вернуться на главную
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
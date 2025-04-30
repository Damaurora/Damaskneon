import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Схема для настроек сайта
const siteSettingsSchema = z.object({
  siteName: z.string().min(2, "Название сайта должно содержать минимум 2 символа"),
  logoSvg: z.string().optional(),
  contactEmail: z.string().email("Введите корректный email").optional().or(z.literal("")),
  contactPhone: z.string().optional().or(z.literal("")),
  metaTitle: z.string().optional().or(z.literal("")),
  metaDescription: z.string().optional().or(z.literal("")),
  vkUrl: z.string().url("Должен быть действительный URL").optional().or(z.literal("")),
  telegramUrl: z.string().url("Должен быть действительный URL").optional().or(z.literal("")),
});

// Типы для формы
type SiteSettingsValues = z.infer<typeof siteSettingsSchema>;

// Интерфейс настроек
interface SiteSettings {
  id: number;
  siteName: string;
  logoSvg?: string;
  contactEmail?: string;
  contactPhone?: string;
  metaTitle?: string;
  metaDescription?: string;
  vkUrl?: string;
  telegramUrl?: string;
}

// Компонент вкладки настроек
export default function SettingsTab() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  // Инициализация формы
  const form = useForm<SiteSettingsValues>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: "Damask Shop",
      logoSvg: "",
      contactEmail: "",
      contactPhone: "",
      metaTitle: "",
      metaDescription: "",
      vkUrl: "",
      telegramUrl: "",
    },
  });
  
  // Предпросмотр логотипа при изменении SVG
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "logoSvg") {
        const svg = value.logoSvg;
        if (svg && typeof svg === "string" && svg.trim().startsWith("<svg")) {
          setLogoPreview(svg);
        } else {
          setLogoPreview(null);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form.watch]);
  
  // Имитация загрузки настроек (в будущем можно заменить на API запрос)
  useEffect(() => {
    // Имитация задержки загрузки
    const timer = setTimeout(() => {
      // Можно заменить на реальный запрос к API для получения настроек
      const settings = {
        siteName: "Damask Shop",
        logoSvg: "",
        contactEmail: "damask.shop@mail.ru",
        contactPhone: "+7 (900) 123-45-67",
        metaTitle: "Damask Shop - Вейп магазин",
        metaDescription: "Магазин вейп-товаров с широким ассортиментом",
        vkUrl: "https://vk.com",
        telegramUrl: "https://telegram.org",
      };
      
      form.reset(settings);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [form]);
  
  // Мутация для сохранения настроек
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: SiteSettingsValues) => {
      // В реальном приложении здесь будет API-запрос
      // const res = await apiRequest("PUT", "/api/settings", data);
      // if (!res.ok) throw new Error("Ошибка при обновлении настроек");
      // return await res.json();
      
      // Имитация успешного сохранения
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Настройки сохранены",
        description: "Изменения вступят в силу после перезагрузки страницы",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось сохранить настройки: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Обработчик отправки формы
  const onSubmit = (values: SiteSettingsValues) => {
    updateSettingsMutation.mutate(values);
  };
  
  // Если данные загружаются, показываем индикатор загрузки
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Настройки сайта</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Настройки сайта</CardTitle>
        <CardDescription>
          Настройте основные параметры сайта, такие как название, логотип и контактные данные
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="grid w-full md:w-[400px] grid-cols-2 mb-8">
            <TabsTrigger value="general">Основные</TabsTrigger>
            <TabsTrigger value="seo">SEO и контакты</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <TabsContent value="general" className="space-y-6">
                <FormField
                  control={form.control}
                  name="siteName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название сайта</FormLabel>
                      <FormControl>
                        <Input placeholder="Damask Shop" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="logoSvg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Логотип (SVG код)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="<svg>...</svg>"
                          className="min-h-40 font-mono text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Вставьте SVG код логотипа. Рекомендуемый размер: 150x50px.
                      </FormDescription>
                      <FormMessage />
                      
                      {logoPreview && (
                        <div className="mt-2 p-4 border border-border rounded-md bg-black">
                          <p className="text-xs text-muted-foreground mb-2">Предпросмотр:</p>
                          <div 
                            className="bg-black p-2 flex justify-center items-center"
                            dangerouslySetInnerHTML={{ __html: logoPreview }}
                          />
                        </div>
                      )}
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="vkUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ссылка на ВКонтакте</FormLabel>
                      <FormControl>
                        <Input placeholder="https://vk.com/damaskshop" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="telegramUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ссылка на Телеграм</FormLabel>
                      <FormControl>
                        <Input placeholder="https://t.me/damaskshop" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="seo" className="space-y-6">
                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Damask Shop - Вейп магазин" {...field} />
                      </FormControl>
                      <FormDescription>
                        Заголовок страницы в поисковых системах
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Магазин вейп-товаров с широким ассортиментом продукции"
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Описание сайта для поисковых систем (рекомендуется 150-160 символов)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Контактный E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="info@damaskshop.ru" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Контактный телефон</FormLabel>
                      <FormControl>
                        <Input placeholder="+7 (900) 123-45-67" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <Button 
                type="submit" 
                disabled={updateSettingsMutation.isPending}
                className="w-full sm:w-auto"
              >
                {updateSettingsMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {!updateSettingsMutation.isPending && (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Сохранить настройки
              </Button>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  );
}
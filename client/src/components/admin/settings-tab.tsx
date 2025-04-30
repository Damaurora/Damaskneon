import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Схема валидации настроек сайта
const siteSettingsSchema = z.object({
  siteName: z.string().min(3, "Название должно содержать минимум 3 символа"),
  logoSvg: z.string().optional(),
  contactEmail: z.string().email("Введите корректный email").optional().or(z.literal("")),
  contactPhone: z.string().min(5, "Телефон должен содержать минимум 5 символов").optional().or(z.literal("")),
  metaTitle: z.string().optional().or(z.literal("")),
  metaDescription: z.string().optional().or(z.literal("")),
  vkUrl: z.string().url("Введите корректный URL").optional().or(z.literal("")),
  telegramUrl: z.string().url("Введите корректный URL").optional().or(z.literal("")),
});

// Тип данных формы настроек
type SiteSettingsValues = z.infer<typeof siteSettingsSchema>;

// Интерфейс для настроек сайта
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

export default function SettingsTab() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Запрос для получения текущих настроек
  const { data: settings, isLoading: isLoadingSettings } = useQuery<SiteSettings | undefined>({
    queryKey: ["/api/settings"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/settings");
      if (!res.ok) return undefined;
      return await res.json();
    },
  });

  // Настройка формы
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

  // Заполняем форму данными после загрузки настроек
  useEffect(() => {
    if (settings) {
      form.reset({
        siteName: settings.siteName,
        logoSvg: settings.logoSvg || "",
        contactEmail: settings.contactEmail || "",
        contactPhone: settings.contactPhone || "",
        metaTitle: settings.metaTitle || "",
        metaDescription: settings.metaDescription || "",
        vkUrl: settings.vkUrl || "",
        telegramUrl: settings.telegramUrl || "",
      });
    }
  }, [settings, form]);

  // Мутация для обновления настроек
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: SiteSettingsValues) => {
      const res = await apiRequest("PUT", "/api/settings", data);
      if (!res.ok) throw new Error("Ошибка при обновлении настроек");
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Настройки обновлены",
        description: "Настройки сайта успешно сохранены",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось обновить настройки: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Обработка отправки формы
  const onSubmit = (values: SiteSettingsValues) => {
    updateSettingsMutation.mutate(values);
  };

  return (
    <Card className="border-secondary">
      <CardHeader>
        <CardTitle className="font-unbounded">Настройки сайта</CardTitle>
        <CardDescription>
          Управление общими настройками сайта, контактной информацией и метаданными
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingSettings ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Основные настройки */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-medium font-unbounded">Основные настройки</h3>
                  
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
                            className="min-h-28 font-mono text-xs"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Вставьте SVG код логотипа для отображения на сайте
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Контактная информация */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-medium font-unbounded">Контактная информация</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="contact@damaskshop.ru" {...field} />
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
                          <FormLabel>Телефон</FormLabel>
                          <FormControl>
                            <Input placeholder="+7 (900) 123-45-67" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Социальные сети */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-medium font-unbounded">Социальные сети</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="vkUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ВКонтакте</FormLabel>
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
                          <FormLabel>Телеграм</FormLabel>
                          <FormControl>
                            <Input placeholder="https://t.me/damaskshop" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Мета-теги */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-medium font-unbounded">SEO и метаданные</h3>
                  
                  <FormField
                    control={form.control}
                    name="metaTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Заголовок страницы (Title)</FormLabel>
                        <FormControl>
                          <Input placeholder="Damask Shop - магазин вейп-товаров" {...field} />
                        </FormControl>
                        <FormDescription>
                          Используется в заголовке браузера и результатах поиска
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
                        <FormLabel>Описание (Description)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Магазин вейп-товаров Damask Shop - большой выбор под-систем, модов, жидкостей и аксессуаров." 
                            className="min-h-24"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Отображается в результатах поиска под заголовком страницы
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updateSettingsMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {updateSettingsMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Сохранить настройки
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
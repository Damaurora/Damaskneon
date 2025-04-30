import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { News, insertNewsSchema } from "@shared/schema";

interface NewsFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  news: News | null;
  mode: "create" | "edit";
}

// Расширяем схему для валидации формы
const newsFormSchema = insertNewsSchema.extend({
  imageUrl: z.string().url("Должен быть действительный URL изображения"),
  title: z.string().min(3, "Заголовок должен содержать минимум 3 символа"),
  content: z.string().min(10, "Содержание должно содержать минимум 10 символов"),
  fullContent: z.string().optional(),
  validUntil: z.string().optional(),
});

type NewsFormValues = z.infer<typeof newsFormSchema>;

export default function NewsFormDialog({
  open,
  onOpenChange,
  news,
  mode,
}: NewsFormDialogProps) {
  const { toast } = useToast();

  // Настройка формы
  const form = useForm<NewsFormValues>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: "",
      content: "",
      fullContent: "",
      imageUrl: "",
      date: new Date().toISOString().split('T')[0], // Сегодняшняя дата в формате YYYY-MM-DD
      type: "news",
      validUntil: "",
    },
  });

  // Заполняем форму данными при редактировании
  useEffect(() => {
    if (news && mode === "edit") {
      form.reset({
        title: news.title,
        content: news.content,
        fullContent: news.fullContent || "",
        imageUrl: news.imageUrl,
        date: news.date,
        type: news.type,
        validUntil: news.validUntil || "",
      });
    }
  }, [news, mode, form]);

  // Мутации для создания/обновления новости
  const createNewsMutation = useMutation({
    mutationFn: async (data: NewsFormValues) => {
      const res = await apiRequest("POST", "/api/news", data);
      if (!res.ok) throw new Error("Ошибка при создании новости");
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Новость добавлена",
        description: "Новая новость успешно опубликована",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось создать новость: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateNewsMutation = useMutation({
    mutationFn: async (data: { id: number; news: NewsFormValues }) => {
      const res = await apiRequest("PUT", `/api/news/${data.id}`, data.news);
      if (!res.ok) throw new Error("Ошибка при обновлении новости");
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Новость обновлена",
        description: "Информация о новости успешно обновлена",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось обновить новость: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Обработка отправки формы
  const onSubmit = (values: NewsFormValues) => {
    if (mode === "create") {
      createNewsMutation.mutate(values);
    } else if (mode === "edit" && news) {
      updateNewsMutation.mutate({ id: news.id, news: values });
    }
  };

  const isLoading = createNewsMutation.isPending || updateNewsMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto" aria-describedby="news-form-description">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Добавить новую новость" : "Редактировать новость"}
          </DialogTitle>
          <span id="news-form-description" className="sr-only">
            Форма для создания или редактирования новости
          </span>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Основные данные */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Заголовок</FormLabel>
                    <FormControl>
                      <Input placeholder="Заголовок новости" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дата</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="news">Новость</SelectItem>
                        <SelectItem value="promo">Акция</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>URL изображения</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Краткое содержание</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Краткое содержание для карточки новости"
                        className="min-h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fullContent"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Полное содержание</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Полный текст новости (отображается при просмотре детальной информации)"
                        className="min-h-40"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.watch("type") === "promo" && (
                <FormField
                  control={form.control}
                  name="validUntil"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Действует до</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Отмена
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "create" ? "Создать новость" : "Сохранить изменения"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
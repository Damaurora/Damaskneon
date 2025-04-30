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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Store, insertStoreSchema } from "@shared/schema";

interface StoreFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store: Store | null;
  mode: "create" | "edit";
}

// Расширяем схему для валидации формы
const storeFormSchema = insertStoreSchema.extend({
  imageUrl: z.string().url("Должен быть действительный URL изображения"),
  name: z.string().min(3, "Название должно содержать минимум 3 символа"),
  address: z.string().min(5, "Адрес должен содержать минимум 5 символов"),
  district: z.string().nullable().optional(),
  hours: z.string().min(3, "Время работы должно содержать минимум 3 символа"),
  additionalHours: z.string().nullable().optional(),
  phone: z.string().min(5, "Телефон должен содержать минимум 5 символов"),
  phoneHours: z.string().nullable().optional(),
});

type StoreFormValues = z.infer<typeof storeFormSchema>;

export default function StoreFormDialog({
  open,
  onOpenChange,
  store,
  mode,
}: StoreFormDialogProps) {
  const { toast } = useToast();

  // Настройка формы
  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: "",
      address: "",
      district: null,
      phone: "",
      hours: "",
      additionalHours: null,
      phoneHours: null,
      imageUrl: "",
    },
  });

  // Заполняем форму данными при редактировании
  useEffect(() => {
    if (store && mode === "edit") {
      form.reset({
        name: store.name,
        address: store.address,
        district: store.district,
        phone: store.phone,
        hours: store.hours,
        additionalHours: store.additionalHours,
        phoneHours: store.phoneHours,
        imageUrl: store.imageUrl,
      });
    }
  }, [store, mode, form]);

  // Мутации для создания/обновления магазина
  const createStoreMutation = useMutation({
    mutationFn: async (data: StoreFormValues) => {
      const res = await apiRequest("POST", "/api/stores", data);
      if (!res.ok) throw new Error("Ошибка при создании магазина");
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Магазин добавлен",
        description: "Новый магазин успешно добавлен",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/stores"] });
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось создать магазин: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateStoreMutation = useMutation({
    mutationFn: async (data: { id: number; store: StoreFormValues }) => {
      const res = await apiRequest("PUT", `/api/stores/${data.id}`, data.store);
      if (!res.ok) throw new Error("Ошибка при обновлении магазина");
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Магазин обновлен",
        description: "Информация о магазине успешно обновлена",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/stores"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось обновить магазин: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Обработка отправки формы
  const onSubmit = (values: StoreFormValues) => {
    if (mode === "create") {
      createStoreMutation.mutate(values);
    } else if (mode === "edit" && store) {
      updateStoreMutation.mutate({ id: store.id, store: values });
    }
  };

  const isLoading = createStoreMutation.isPending || updateStoreMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto" aria-describedby="store-form-description">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Добавить новый магазин" : "Редактировать информацию о магазине"}
          </DialogTitle>
          <span id="store-form-description" className="sr-only">
            Форма для создания или редактирования магазина
          </span>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Основные данные */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Название</FormLabel>
                    <FormControl>
                      <Input placeholder="Название магазина" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Адрес</FormLabel>
                    <FormControl>
                      <Input placeholder="ул. Примерная, 123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Район (опционально)</FormLabel>
                    <FormControl>
                      <Input placeholder="Центральный" value={field.value || ""} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон</FormLabel>
                    <FormControl>
                      <Input placeholder="+7 (999) 123-45-67" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Часы работы телефона (опционально)</FormLabel>
                    <FormControl>
                      <Input placeholder="Пн-Вс: 9:00-21:00" value={field.value || ""} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Время работы</FormLabel>
                    <FormControl>
                      <Input placeholder="Пн-Вс: 10:00-20:00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="additionalHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дополнительное время работы</FormLabel>
                    <FormControl>
                      <Input placeholder="Сб-Вс: 10:00-18:00" value={field.value || ""} onChange={field.onChange} />
                    </FormControl>
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
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Отмена
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "create" ? "Создать магазин" : "Сохранить изменения"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Product, insertProductSchema } from "@shared/schema";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  mode: "create" | "edit";
}

// Расширяем схему для валидации формы
const productFormSchema = insertProductSchema.extend({
  imageUrl: z.string().url("Должен быть действительный URL изображения"),
  name: z.string().min(3, "Название должно содержать минимум 3 символа"),
  description: z.string().min(10, "Описание должно содержать минимум 10 символов"),
  specifications: z.record(z.string(), z.string()).optional(),
  packageContents: z.record(z.string(), z.string()).optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function ProductFormDialog({
  open,
  onOpenChange,
  product,
  mode,
}: ProductFormDialogProps) {
  const { toast } = useToast();
  const [specsFields, setSpecsFields] = useState<string[]>([]);
  const [packageFields, setPackageFields] = useState<string[]>([]);

  // Настройка формы
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      category: "pod",
      isTopProduct: false,
      isNew: false,
      gagarinAvailability: "outOfStock",
      pobedyAvailability: "outOfStock",
      specifications: {},
      packageContents: {},
    },
  });

  // Заполняем форму данными при редактировании
  useEffect(() => {
    if (product && mode === "edit") {
      // Базовые поля
      form.reset({
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        category: product.category,
        isTopProduct: product.isTopProduct,
        isNew: product.isNew,
        gagarinAvailability: product.gagarinAvailability as string,
        pobedyAvailability: product.pobedyAvailability as string,
        specifications: product.specifications as Record<string, string>,
        packageContents: product.packageContents as Record<string, string>,
      });

      // Добавляем поля спецификаций
      if (product.specifications) {
        const specs = product.specifications as Record<string, string>;
        setSpecsFields(Object.keys(specs));
      }

      // Добавляем поля комплектации
      if (product.packageContents) {
        const contents = product.packageContents as Record<string, string>;
        setPackageFields(Object.keys(contents));
      }
    }
  }, [product, mode, form]);

  // Мутации для создания/обновления товара
  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const res = await apiRequest("POST", "/api/products", data);
      if (!res.ok) throw new Error("Ошибка при создании товара");
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Товар добавлен",
        description: "Новый товар успешно добавлен в каталог",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось создать товар: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: { id: number; product: ProductFormValues }) => {
      const res = await apiRequest("PUT", `/api/products/${data.id}`, data.product);
      if (!res.ok) throw new Error("Ошибка при обновлении товара");
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Товар обновлен",
        description: "Информация о товаре успешно обновлена",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось обновить товар: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Обработка отправки формы
  const onSubmit = (values: ProductFormValues) => {
    // Обработка спецификаций и комплектации
    const formattedSpecs: Record<string, string> = {};
    specsFields.forEach((key, index) => {
      if (form.getValues(`specifications.${key}`)) {
        formattedSpecs[`${index + 1}`] = form.getValues(`specifications.${key}`);
      }
    });

    const formattedPackage: Record<string, string> = {};
    packageFields.forEach((key, index) => {
      if (form.getValues(`packageContents.${key}`)) {
        formattedPackage[`${index + 1}`] = form.getValues(`packageContents.${key}`);
      }
    });

    const productData = {
      ...values,
      specifications: formattedSpecs,
      packageContents: formattedPackage,
    };

    if (mode === "create") {
      createProductMutation.mutate(productData);
    } else if (mode === "edit" && product) {
      updateProductMutation.mutate({ id: product.id, product: productData });
    }
  };

  // Управление динамическими полями
  const addSpecField = () => {
    const newKey = `spec_${specsFields.length + 1}`;
    setSpecsFields([...specsFields, newKey]);
  };

  const addPackageField = () => {
    const newKey = `item_${packageFields.length + 1}`;
    setPackageFields([...packageFields, newKey]);
  };

  const removeSpecField = (key: string) => {
    setSpecsFields(specsFields.filter((k) => k !== key));
    const currentSpecs = form.getValues("specifications") || {};
    delete currentSpecs[key];
    form.setValue("specifications", currentSpecs);
  };

  const removePackageField = (key: string) => {
    setPackageFields(packageFields.filter((k) => k !== key));
    const currentPackage = form.getValues("packageContents") || {};
    delete currentPackage[key];
    form.setValue("packageContents", currentPackage);
  };

  const isLoading = createProductMutation.isPending || updateProductMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Добавить новый товар" : "Редактировать товар"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Основные данные */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Название</FormLabel>
                    <FormControl>
                      <Input placeholder="Название товара" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Категория</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pod">Под-системы</SelectItem>
                        <SelectItem value="mod">Моды</SelectItem>
                        <SelectItem value="disposable">Одноразовые</SelectItem>
                        <SelectItem value="liquid">Жидкости</SelectItem>
                        <SelectItem value="accessories">Аксессуары</SelectItem>
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
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Описание товара"
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Статусы и наличие */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="isTopProduct"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Топ продаж
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isNew"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Новинка
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="gagarinAvailability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Наличие на Гагарина</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите статус" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="inStock">В наличии</SelectItem>
                          <SelectItem value="lowStock">Заканчивается</SelectItem>
                          <SelectItem value="expected">Ожидается</SelectItem>
                          <SelectItem value="outOfStock">Нет в наличии</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pobedyAvailability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Наличие на Победы</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите статус" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="inStock">В наличии</SelectItem>
                          <SelectItem value="lowStock">Заканчивается</SelectItem>
                          <SelectItem value="expected">Ожидается</SelectItem>
                          <SelectItem value="outOfStock">Нет в наличии</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Спецификации */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Характеристики</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSpecField}
                >
                  Добавить характеристику
                </Button>
              </div>
              
              {specsFields.map((key) => (
                <div key={key} className="flex gap-2 items-start">
                  <FormField
                    control={form.control}
                    name={`specifications.${key}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Характеристика товара"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-0.5"
                    onClick={() => removeSpecField(key)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Комплектация */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Комплектация</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPackageField}
                >
                  Добавить элемент
                </Button>
              </div>
              
              {packageFields.map((key) => (
                <div key={key} className="flex gap-2 items-start">
                  <FormField
                    control={form.control}
                    name={`packageContents.${key}`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            placeholder="Элемент комплектации"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-0.5"
                    onClick={() => removePackageField(key)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Отмена
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "create" ? "Создать товар" : "Сохранить изменения"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
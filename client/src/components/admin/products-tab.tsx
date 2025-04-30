import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ProductFormDialog from "./product-form-dialog";
import DeleteConfirmDialog from "./delete-confirm-dialog";
import { Product } from "@shared/schema";

export default function ProductsTab() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Получение списка товаров
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Мутация для удаления товара
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/products/${id}`);
      if (!res.ok) throw new Error("Ошибка при удалении товара");
      return id;
    },
    onSuccess: () => {
      toast({
        title: "Товар удален",
        description: "Товар был успешно удален из каталога",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось удалить товар: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      deleteProductMutation.mutate(selectedProduct.id);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Управление товарами</CardTitle>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Добавить товар
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Изображение</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Наличие</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products?.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.id}</TableCell>
                    <TableCell>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      {getCategoryLabel(product.category)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {product.isTopProduct && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                            Топ продаж
                          </Badge>
                        )}
                        {product.isNew && (
                          <Badge variant="outline" className="bg-accent/10 text-accent border-accent">
                            Новинка
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${getStatusColorClass(product.gagarinAvailability)}`}></span>
                          <span>Гагарина: {getStatusLabel(product.gagarinAvailability)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`w-2 h-2 rounded-full ${getStatusColorClass(product.pobedyAvailability)}`}></span>
                          <span>Победы: {getStatusLabel(product.pobedyAvailability)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(product)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {products?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Нет доступных товаров
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Диалоги для добавления/редактирования/удаления товаров */}
      <ProductFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        product={null}
        mode="create"
      />

      <ProductFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        product={selectedProduct}
        mode="edit"
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Удалить товар"
        description={`Вы уверены, что хотите удалить товар "${selectedProduct?.name}"? Это действие нельзя отменить.`}
        onConfirm={confirmDelete}
        isLoading={deleteProductMutation.isPending}
      />
    </Card>
  );
}

// Вспомогательные функции
function getCategoryLabel(category: string): string {
  const categories: Record<string, string> = {
    pod: "Под-системы",
    mod: "Моды",
    disposable: "Одноразовые",
    liquid: "Жидкости",
    accessories: "Аксессуары",
  };
  return categories[category] || "Другое";
}

function getStatusLabel(status: string): string {
  const statuses: Record<string, string> = {
    inStock: "В наличии",
    lowStock: "Заканчивается",
    expected: "Ожидается",
    outOfStock: "Нет в наличии",
  };
  return statuses[status] || "Неизвестно";
}

function getStatusColorClass(status: string): string {
  const colors: Record<string, string> = {
    inStock: "bg-[#00C853]",
    lowStock: "bg-[#FF3D00]",
    expected: "bg-[#FF9100]",
    outOfStock: "bg-[#9E9E9E]",
  };
  return colors[status] || "bg-[#9E9E9E]";
}
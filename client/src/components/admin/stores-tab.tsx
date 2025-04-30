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
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import StoreFormDialog from "./store-form-dialog";
import DeleteConfirmDialog from "./delete-confirm-dialog";
import { Store } from "@shared/schema";

export default function StoresTab() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  // Получение списка магазинов
  const { data: stores, isLoading } = useQuery<Store[]>({
    queryKey: ["/api/stores"],
  });

  // Мутация для удаления магазина
  const deleteStoreMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/stores/${id}`);
      if (!res.ok) throw new Error("Ошибка при удалении магазина");
      return id;
    },
    onSuccess: () => {
      toast({
        title: "Магазин удален",
        description: "Магазин был успешно удален из списка",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/stores"] });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось удалить магазин: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleEditClick = (store: Store) => {
    setSelectedStore(store);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (store: Store) => {
    setSelectedStore(store);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedStore) {
      deleteStoreMutation.mutate(selectedStore.id);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Управление магазинами</CardTitle>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Добавить магазин
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Мобильное представление для маленьких экранов */}
            <div className="md:hidden grid gap-4">
              {stores?.map((store) => (
                <Card key={store.id} className="overflow-hidden">
                  <div className="flex items-center p-4 gap-3">
                    <img
                      src={store.imageUrl}
                      alt={store.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-base">{store.name}</h3>
                      <p className="text-sm text-muted-foreground">{store.address}</p>
                      <p className="text-sm mt-1">{store.phone}</p>
                    </div>
                  </div>
                  
                  <div className="px-4 pb-2">
                    <div className="text-xs">
                      <p className="text-muted-foreground">Время работы: {store.hours}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-border px-4 py-3 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(store)}
                      className="h-9 px-3"
                    >
                      <Edit className="h-4 w-4 mr-1" /> Изменить
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 text-destructive border-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteClick(store)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Удалить
                    </Button>
                  </div>
                </Card>
              ))}
              {stores?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Нет доступных магазинов
                </div>
              )}
            </div>
            
            {/* Табличное представление для больших экранов */}
            <Table className="hidden md:table">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Фото</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead>Адрес</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Время работы</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stores?.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell className="font-medium">{store.id}</TableCell>
                    <TableCell>
                      <img
                        src={store.imageUrl}
                        alt={store.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{store.name}</TableCell>
                    <TableCell>{store.address}</TableCell>
                    <TableCell>{store.phone}</TableCell>
                    <TableCell>{store.hours}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(store)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(store)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {stores?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Нет доступных магазинов
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Диалоги для добавления/редактирования/удаления магазинов */}
      <StoreFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        store={null}
        mode="create"
      />

      <StoreFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        store={selectedStore}
        mode="edit"
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Удалить магазин"
        description={`Вы уверены, что хотите удалить магазин "${selectedStore?.name}"? Это действие нельзя отменить.`}
        onConfirm={confirmDelete}
        isLoading={deleteStoreMutation.isPending}
      />
    </Card>
  );
}
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
import NewsFormDialog from "./news-form-dialog";
import DeleteConfirmDialog from "./delete-confirm-dialog";
import { News } from "@shared/schema";

export default function NewsTab() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  // Получение списка новостей
  const { data: newsList, isLoading } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  // Мутация для удаления новости
  const deleteNewsMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/news/${id}`);
      if (!res.ok) throw new Error("Ошибка при удалении новости");
      return id;
    },
    onSuccess: () => {
      toast({
        title: "Новость удалена",
        description: "Новость была успешно удалена",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось удалить новость: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleEditClick = (news: News) => {
    setSelectedNews(news);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (news: News) => {
    setSelectedNews(news);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedNews) {
      deleteNewsMutation.mutate(selectedNews.id);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Управление новостями</CardTitle>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Добавить новость
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
              {newsList?.map((news) => (
                <Card key={news.id} className="overflow-hidden">
                  <div className="flex items-center p-4 gap-3">
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-base">{news.title}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-sm text-muted-foreground">{news.date}</p>
                        <Badge
                          variant="outline"
                          className={news.type === "news" 
                            ? "bg-accent/10 text-accent border-accent text-xs" 
                            : "bg-primary/10 text-primary border-primary text-xs"}
                        >
                          {news.type === "news" ? "Новость" : "Акция"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-border px-4 py-3 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(news)}
                      className="h-9 px-3"
                    >
                      <Edit className="h-4 w-4 mr-1" /> Изменить
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 text-destructive border-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteClick(news)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Удалить
                    </Button>
                  </div>
                </Card>
              ))}
              {newsList?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Нет доступных новостей
                </div>
              )}
            </div>
            
            {/* Табличное представление для больших экранов */}
            <Table className="hidden md:table">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Изображение</TableHead>
                  <TableHead>Заголовок</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsList?.map((news) => (
                  <TableRow key={news.id}>
                    <TableCell className="font-medium">{news.id}</TableCell>
                    <TableCell>
                      <img
                        src={news.imageUrl}
                        alt={news.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{news.title}</TableCell>
                    <TableCell>{news.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={news.type === "news" ? "bg-accent/10 text-accent border-accent" : "bg-primary/10 text-primary border-primary"}
                      >
                        {news.type === "news" ? "Новость" : "Акция"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(news)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(news)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {newsList?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Нет доступных новостей
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Диалоги для добавления/редактирования/удаления новостей */}
      <NewsFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        news={null}
        mode="create"
      />

      <NewsFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        news={selectedNews}
        mode="edit"
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Удалить новость"
        description={`Вы уверены, что хотите удалить новость "${selectedNews?.title}"? Это действие нельзя отменить.`}
        onConfirm={confirmDelete}
        isLoading={deleteNewsMutation.isPending}
      />
    </Card>
  );
}
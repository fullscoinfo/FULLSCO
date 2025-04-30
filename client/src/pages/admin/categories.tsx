import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Edit, Trash2, RefreshCw, Check, X } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

// زودج سكيما للتحقق من صحة البيانات
const categorySchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
  slug: z.string().min(2, 'الاسم المختصر يجب أن يكون على الأقل حرفين').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'الاسم المختصر يجب أن يحتوي على أحرف صغيرة وأرقام وشرطات فقط'),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

// واجهة للتصنيف
interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export default function CategoriesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // استلام التصنيفات من الخادم
  const { data: categories, isLoading, isError, refetch } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('فشل في استلام التصنيفات');
      return response.json();
    }
  });

  // إضافة تصنيف جديد
  const addMutation = useMutation({
    mutationFn: async (newCategory: CategoryFormValues) => {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });
      if (!response.ok) throw new Error('فشل في إضافة التصنيف');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: 'تم إضافة التصنيف بنجاح', description: 'تمت إضافة التصنيف الجديد إلى قاعدة البيانات' });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({ title: 'خطأ!', description: `فشل في إضافة التصنيف: ${error.message}`, variant: 'destructive' });
    }
  });

  // تعديل تصنيف
  const updateMutation = useMutation({
    mutationFn: async (updatedCategory: CategoryFormValues & { id: number }) => {
      const { id, ...categoryData } = updatedCategory;
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      if (!response.ok) throw new Error('فشل في تحديث التصنيف');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: 'تم التحديث بنجاح', description: 'تم تحديث التصنيف في قاعدة البيانات' });
      setIsEditDialogOpen(false);
      setSelectedCategory(null);
    },
    onError: (error) => {
      toast({ title: 'خطأ!', description: `فشل في تحديث التصنيف: ${error.message}`, variant: 'destructive' });
    }
  });

  // حذف تصنيف
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('فشل في حذف التصنيف');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: 'تم الحذف بنجاح', description: 'تم حذف التصنيف من قاعدة البيانات' });
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    },
    onError: (error) => {
      toast({ title: 'خطأ!', description: `فشل في حذف التصنيف: ${error.message}`, variant: 'destructive' });
    }
  });

  // نموذج إضافة تصنيف جديد
  const addForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
    },
  });

  // نموذج تعديل تصنيف
  const editForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: selectedCategory?.name || '',
      slug: selectedCategory?.slug || '',
      description: selectedCategory?.description || '',
    },
  });

  // تحديث نموذج التعديل عند تغيير التصنيف المحدد
  useEffect(() => {
    if (selectedCategory) {
      editForm.reset({
        name: selectedCategory.name,
        slug: selectedCategory.slug,
        description: selectedCategory.description || '',
      });
    }
  }, [selectedCategory, editForm]);

  // إعادة ضبط نموذج الإضافة عند فتح نافذة الإضافة
  useEffect(() => {
    if (isAddDialogOpen) {
      addForm.reset({
        name: '',
        slug: '',
        description: '',
      });
    }
  }, [isAddDialogOpen, addForm]);

  // معالجة حدث إرسال نموذج الإضافة
  const onSubmitAdd = (data: CategoryFormValues) => {
    addMutation.mutate(data);
  };

  // معالجة حدث إرسال نموذج التعديل
  const onSubmitEdit = (data: CategoryFormValues) => {
    if (selectedCategory) {
      updateMutation.mutate({ ...data, id: selectedCategory.id });
    }
  };

  // تحضير التصنيف للتعديل
  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  // تحضير التصنيف للحذف
  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  // تأكيد الحذف
  const confirmDelete = () => {
    if (selectedCategory) {
      deleteMutation.mutate(selectedCategory.id);
    }
  };

  // إنتاج slug من الاسم
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  // معالجة تلقائية لإنشاء slug عند كتابة الاسم في نموذج الإضافة
  const handleNameChangeAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    addForm.setValue('name', name);
    if (!addForm.getValues('slug') || addForm.getValues('slug') === generateSlug(addForm.getValues('name'))) {
      const slug = generateSlug(name);
      addForm.setValue('slug', slug);
    }
  };

  // معالجة تلقائية لإنشاء slug عند كتابة الاسم في نموذج التعديل
  const handleNameChangeEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    editForm.setValue('name', name);
    if (!editForm.getValues('slug') || editForm.getValues('slug') === generateSlug(editForm.getValues('name'))) {
      const slug = generateSlug(name);
      editForm.setValue('slug', slug);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة التصنيفات</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="ml-2 h-4 w-4" />
            تحديث
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="ml-2 h-4 w-4" />
                إضافة تصنيف
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>إضافة تصنيف جديد</DialogTitle>
                <DialogDescription>
                  أضف تصنيفًا جديدًا للمنح الدراسية هنا. اضغط على حفظ عند الانتهاء.
                </DialogDescription>
              </DialogHeader>
              <Form {...addForm}>
                <form onSubmit={addForm.handleSubmit(onSubmitAdd)} className="space-y-4">
                  <FormField
                    control={addForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم التصنيف</FormLabel>
                        <FormControl>
                          <Input {...field} onChange={handleNameChangeAdd} placeholder="مثال: دراسات عليا" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم المختصر (Slug)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="مثال: graduate-studies" dir="ltr" />
                        </FormControl>
                        <FormDescription>
                          سيستخدم هذا في عنوان URL. يجب أن يحتوي على أحرف صغيرة وأرقام وشرطات فقط.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الوصف</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="وصف اختياري للتصنيف" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={addMutation.isPending}>
                      {addMutation.isPending ? (
                        <>
                          <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Check className="ml-2 h-4 w-4" />
                          حفظ
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>قائمة التصنيفات</CardTitle>
          <CardDescription>
            جميع تصنيفات المنح الدراسية المتوفرة في الموقع
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <RefreshCw className="h-6 w-6 animate-spin" />
              <span className="mr-2">جاري التحميل...</span>
            </div>
          ) : isError ? (
            <div className="text-center py-4 text-red-500">
              <p>حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.</p>
              <Button variant="outline" onClick={() => refetch()} className="mt-2">
                إعادة المحاولة
              </Button>
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-right">الرقم</TableHead>
                    <TableHead className="text-right">الاسم</TableHead>
                    <TableHead className="text-right">الاسم المختصر</TableHead>
                    <TableHead className="text-right">الوصف</TableHead>
                    <TableHead className="text-left w-[120px]">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>{category.id}</TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell dir="ltr">{category.slug}</TableCell>
                      <TableCell>{category.description || "—"}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="ghost" onClick={() => handleEdit(category)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">تعديل</span>
                          </Button>
                          <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDelete(category)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">حذف</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>لا توجد تصنيفات حاليًا.</p>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(true)} className="mt-2">
                إضافة تصنيف جديد
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* نافذة تعديل التصنيف */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>تعديل التصنيف</DialogTitle>
            <DialogDescription>
              قم بتعديل بيانات التصنيف هنا. اضغط على حفظ عند الانتهاء.
            </DialogDescription>
          </DialogHeader>
          {selectedCategory && (
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم التصنيف</FormLabel>
                      <FormControl>
                        <Input {...field} onChange={handleNameChangeEdit} placeholder="مثال: دراسات عليا" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الاسم المختصر (Slug)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="مثال: graduate-studies" dir="ltr" />
                      </FormControl>
                      <FormDescription>
                        سيستخدم هذا في عنوان URL. يجب أن يحتوي على أحرف صغيرة وأرقام وشرطات فقط.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الوصف</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="وصف اختياري للتصنيف" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={updateMutation.isPending}>
                    {updateMutation.isPending ? (
                      <>
                        <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Check className="ml-2 h-4 w-4" />
                        حفظ
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      {/* نافذة تأكيد الحذف */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا التصنيف؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف التصنيف نهائيًا من قاعدة البيانات.
              {selectedCategory && (
                <p className="font-medium mt-2">
                  التصنيف: {selectedCategory.name}
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <Trash2 className="ml-2 h-4 w-4" />
                  نعم، حذف التصنيف
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
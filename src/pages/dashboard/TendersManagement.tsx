import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Search, Save, X, FileText, Calendar, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTenders, useCreateTender, useUpdateTender, useDeleteTender } from '@/hooks/useApi';
import { toast } from 'sonner';
import type { Tender } from '@/services/api';

const TendersManagement = () => {
  const { t, isRTL, language } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'closed' | 'draft'>('all');
  const [editingTender, setEditingTender] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const documentFileInputRef = useRef<HTMLInputElement>(null);

  const { data: tenders = [], isLoading } = useTenders();
  const createTender = useCreateTender();
  const updateTender = useUpdateTender();
  const deleteTender = useDeleteTender();

  const handleEdit = (tender: Tender) => {
    setEditingTender({ ...tender });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingTender) return;

    // Validate required fields
    if (!editingTender.title || !editingTender.titleAr || !editingTender.deadline) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    try {
      if (editingTender.id) {
        await updateTender.mutateAsync({ id: editingTender.id, updates: editingTender });
        toast.success(language === 'ar' ? 'تم تحديث المناقصة بنجاح' : 'Tender updated successfully');
      } else {
        await createTender.mutateAsync(editingTender);
        toast.success(language === 'ar' ? 'تم إنشاء المناقصة بنجاح' : 'Tender created successfully');
      }
      setIsDialogOpen(false);
      setEditingTender(null);
    } catch (error: any) {
      console.error('Error saving tender:', error);
      toast.error(language === 'ar' ? `فشل في حفظ المناقصة: ${error?.message || 'Unknown error'}` : `Failed to save tender: ${error?.message || 'Unknown error'}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه المناقصة؟' : 'Are you sure you want to delete this tender?')) {
      try {
        await deleteTender.mutateAsync(id);
        toast.success(language === 'ar' ? 'تم حذف المناقصة بنجاح' : 'Tender deleted successfully');
      } catch (error) {
        toast.error(language === 'ar' ? 'فشل في حذف المناقصة' : 'Failed to delete tender');
      }
    }
  };

  const handleAdd = () => {
    setEditingTender({
      title: '',
      titleAr: '',
      category: 'Equipment',
      categoryAr: 'معدات',
      deadline: '',
      description: '',
      descriptionAr: '',
      status: 'active' as const,
      documentFile: undefined,
      documentFileName: undefined,
    });
    setIsDialogOpen(true);
  };

  const handleDocumentFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(language === 'ar' ? 'حجم الملف يجب أن يكون أقل من 10 ميجابايت' : 'File size must be less than 10MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingTender({
          ...editingTender,
          documentFile: reader.result as string,
          documentFileName: file.name,
        });
        toast.success(language === 'ar' ? 'تم رفع الملف بنجاح' : 'File uploaded successfully');
      };
      reader.onerror = () => {
        toast.error(language === 'ar' ? 'خطأ في قراءة الملف' : 'Error reading file');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleViewTender = (tender: Tender) => {
    navigate(`/dashboard/tenders/${tender.id}`);
  };

  const filteredTenders = tenders.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.titleAr.includes(searchTerm) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; labelAr: string; className: string }> = {
      active: { label: 'Active', labelAr: 'نشط', className: 'bg-green-500/80 text-white' },
      closed: { label: 'Closed', labelAr: 'مغلق', className: 'bg-gray-500/80 text-white' },
      draft: { label: 'Draft', labelAr: 'مسودة', className: 'bg-yellow-500/80 text-white' },
    };
    const statusInfo = statusMap[status] || statusMap.active;
    return (
      <Badge className={statusInfo.className}>
        {language === 'ar' ? statusInfo.labelAr : statusInfo.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">{language === 'ar' ? 'جاري تحميل المناقصات...' : 'Loading tenders...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{language === 'ar' ? 'إدارة المناقصات' : 'Tenders Management'}</h2>
          <p className="text-muted-foreground mt-1">{language === 'ar' ? 'إدارة جميع المناقصات والتقديمات' : 'Manage all tenders and submissions'}</p>
        </div>
        <Button onClick={handleAdd} disabled={createTender.isPending} >
          <Plus className="h-4 w-4 mr-2" />
          {language === 'ar' ? 'إضافة مناقصة' : 'Add Tender'}
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="backdrop-blur-xl bg-card/90 border-border shadow-elevation-2">
        <CardContent className="p-4">
          <div className={cn('flex gap-4', isRTL && 'flex-row-reverse')}>
            <div className="flex-1 relative">
              <Search className={cn('absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground', isRTL ? 'right-3' : 'left-3')} />
              <Input
                placeholder={language === 'ar' ? 'ابحث عن مناقصة...' : 'Search tenders...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn('bg-muted/50 border-border text-foreground placeholder:text-muted-foreground', isRTL && 'pr-10', !isRTL && 'pl-10')}
              />
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-[180px] bg-muted/50 border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                <SelectItem value="active">{language === 'ar' ? 'نشط' : 'Active'}</SelectItem>
                <SelectItem value="closed">{language === 'ar' ? 'مغلق' : 'Closed'}</SelectItem>
                <SelectItem value="draft">{language === 'ar' ? 'مسودة' : 'Draft'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tenders List */}
      <Card className="backdrop-blur-xl bg-card/90 border-border shadow-elevation-2">
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'المناقصات' : 'Tenders'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTenders.map((tender) => (
              <div
                key={tender.id}
                role="button"
                tabIndex={0}
                onClick={() => handleViewTender(tender)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleViewTender(tender);
                  }
                }}
                className="backdrop-blur-xl bg-muted/40 border border-border rounded-lg p-4 hover:bg-muted transition-all cursor-pointer"
              >
                <div className={cn('flex items-start justify-between gap-4', isRTL && 'flex-row-reverse')}>
                  <div className="flex-1">
                    <div className={cn('flex items-center gap-3 mb-2', isRTL && 'flex-row-reverse')}>
                      <h3 className="text-lg font-semibold text-foreground">
                        {language === 'ar' ? tender.titleAr : tender.title}
                      </h3>
                      {getStatusBadge(tender.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {language === 'ar' ? tender.descriptionAr : tender.description}
                    </p>
                    <div className={cn('flex items-center gap-4 text-xs text-muted-foreground', isRTL && 'flex-row-reverse')}>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {tender.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {language === 'ar' ? 'الموعد النهائي: ' : 'Deadline: '}
                        {new Date(tender.deadline).toLocaleDateString()}
                      </span>
                      <span>
                        {language === 'ar' ? 'التقديمات: ' : 'Submissions: '}
                        {tender.submissions?.length || 0}
                      </span>
                    </div>
                  </div>
                  <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleViewTender(tender);
                      }}
                      className="hover:bg-muted"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleEdit(tender);
                      }}
                      className="hover:bg-muted"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDelete(tender.id);
                      }}
                      className="text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {filteredTenders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{language === 'ar' ? 'لا توجد مناقصات' : 'No tenders found'}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit/Create Tender Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={true}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-popover border-border text-popover-foreground z-[150]">
          <DialogHeader>
            <DialogTitle>
              {editingTender?.id ? (language === 'ar' ? 'تعديل المناقصة' : 'Edit Tender') : (language === 'ar' ? 'إضافة مناقصة' : 'Add Tender')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'العنوان (إنجليزي)' : 'Title (English)'}</Label>
                <Input
                  value={editingTender?.title || ''}
                  onChange={(e) => setEditingTender({ ...editingTender, title: e.target.value })}
                  className="bg-muted/50 border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'العنوان (عربي)' : 'Title (Arabic)'}</Label>
                <Input
                  value={editingTender?.titleAr || ''}
                  onChange={(e) => setEditingTender({ ...editingTender, titleAr: e.target.value })}
                  className="bg-muted/50 border-border text-foreground"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'الفئة (إنجليزي)' : 'Category (English)'}</Label>
                <Input
                  value={editingTender?.category || ''}
                  onChange={(e) => setEditingTender({ ...editingTender, category: e.target.value })}
                  className="bg-muted/50 border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>{language === 'ar' ? 'الفئة (عربي)' : 'Category (Arabic)'}</Label>
                <Input
                  value={editingTender?.categoryAr || ''}
                  onChange={(e) => setEditingTender({ ...editingTender, categoryAr: e.target.value })}
                  className="bg-muted/50 border-border text-foreground"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الموعد النهائي' : 'Deadline'}</Label>
              <Input
                type="date"
                value={editingTender?.deadline || ''}
                onChange={(e) => setEditingTender({ ...editingTender, deadline: e.target.value })}
                className="bg-muted/50 border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الوصف (إنجليزي)' : 'Description (English)'}</Label>
              <Textarea
                value={editingTender?.description || ''}
                onChange={(e) => setEditingTender({ ...editingTender, description: e.target.value })}
                rows={4}
                className="bg-muted/50 border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الوصف (عربي)' : 'Description (Arabic)'}</Label>
              <Textarea
                value={editingTender?.descriptionAr || ''}
                onChange={(e) => setEditingTender({ ...editingTender, descriptionAr: e.target.value })}
                rows={4}
                className="bg-muted/50 border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'الحالة' : 'Status'}</Label>
              <Select
                value={editingTender?.status || 'active'}
                onValueChange={(value: any) => setEditingTender({ ...editingTender, status: value })}
              >
                <SelectTrigger className="bg-muted/50 border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="active">{language === 'ar' ? 'نشط' : 'Active'}</SelectItem>
                  <SelectItem value="closed">{language === 'ar' ? 'مغلق' : 'Closed'}</SelectItem>
                  <SelectItem value="draft">{language === 'ar' ? 'مسودة' : 'Draft'}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'وثيقة المناقصة (PDF أو أي ملف)' : 'Tender Document (PDF or any file)'}</Label>
              <Input
                ref={documentFileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 10 * 1024 * 1024) {
                      toast.error(language === 'ar' ? 'حجم الملف يجب أن يكون أقل من 10MB' : 'File size must be less than 10MB');
                      return;
                    }
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setEditingTender({
                        ...editingTender,
                        documentFile: reader.result as string,
                        documentFileName: file.name,
                      });
                      toast.success(language === 'ar' ? 'تم رفع الملف بنجاح' : 'File uploaded successfully');
                    };
                    reader.onerror = () => {
                      toast.error(language === 'ar' ? 'خطأ في قراءة الملف' : 'Error reading file');
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
              <div className="flex items-center gap-4">
                {editingTender?.documentFile ? (
                  <div className="flex items-center gap-2 p-2 bg-muted/40 rounded border border-border">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{editingTender.documentFileName}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingTender({ ...editingTender, documentFile: undefined, documentFileName: undefined })}
                      className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">{language === 'ar' ? 'لم يتم رفع ملف' : 'No file uploaded'}</div>
                )}
                <Button
                  type="button"
                  onClick={() => documentFileInputRef.current?.click()}
                  variant="outline"
                  className="border-border hover:bg-muted"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {editingTender?.documentFile ? (language === 'ar' ? 'تغيير الملف' : 'Change File') : (language === 'ar' ? 'رفع ملف' : 'Upload File')}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? 'يمكن رفع ملفات PDF, DOC, DOCX, XLS, XLSX (حد أقصى 10MB)' : 'You can upload PDF, DOC, DOCX, XLS, XLSX files (max 10MB)'}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-border hover:bg-muted"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                onClick={handleSave}
                disabled={createTender.isPending || updateTender.isPending}
                
              >
                <Save className="h-4 w-4 mr-2" />
                {language === 'ar' ? 'حفظ' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TendersManagement;


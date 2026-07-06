import { useState, useRef } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Save, X, Upload, Image as ImageIcon, Trash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn, getImageUrl } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, useProductCategories } from '@/hooks/useApi';
import { toast } from 'sonner';
import {
  normalizeSpecificationsTable,
  createEmptySpecificationsTable,
  SPEC_COLUMN_LABELS,
  type SpecRow,
  type SpecTable,
} from '@/lib/productSpecifications';

const ProductsManagement = () => {
  const { t, isRTL, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null); // State to hold the actual file
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useProductCategories(true);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const handleEdit = (product: any) => {
    let gallery = product.gallery || [];
    if (gallery && typeof gallery === 'string') {
      try {
        gallery = JSON.parse(gallery);
      } catch {
        gallery = [];
      }
    }
    if (!Array.isArray(gallery)) {
      gallery = [];
    }
    setEditingProduct({
      ...product,
      specifications_table: normalizeSpecificationsTable(product.specifications_table),
      gallery,
    });
    setImageFile(null); // Reset image file when editing
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (editingProduct) {
      try {
        // Prepare product data without base64 image if we have a file
        const productData = {
          ...editingProduct,
          specifications_table: normalizeSpecificationsTable(
            editingProduct.specifications_table,
          ),
        };
        if (imageFile && productData.image && productData.image.startsWith('data:image')) {
          // Remove base64 preview from data - we'll send the file instead
          // Keep the image field for backward compatibility, but it won't be used if file is provided
        }
        
        if (editingProduct.id) {
          await updateProduct.mutateAsync({ 
            id: editingProduct.id, 
            updates: productData,
            imageFile: imageFile || undefined
          });
          toast.success('Product updated successfully');
        } else {
          await createProduct.mutateAsync({ 
            product: productData,
            imageFile: imageFile || undefined
          });
          toast.success('Product created successfully');
        }
        setIsDialogOpen(false);
        setEditingProduct(null);
        setImageFile(null); // Clear file after save
      } catch (error: any) {
        console.error('Error saving product:', {
          error,
          message: error?.message,
          stack: error?.stack,
          product: editingProduct,
          errorType: error?.constructor?.name,
          errorString: String(error),
        });
        
        // Extract error message with better handling
        let errorMessage = 'Unknown error occurred';
        if (error?.message) {
          errorMessage = error.message;
          // Remove "API Error: " prefix if present
          errorMessage = errorMessage.replace(/^API Error:\s*/i, '');
          // Remove "Network error: " prefix if present
          errorMessage = errorMessage.replace(/^Network error:\s*/i, '');
        } else if (typeof error === 'string') {
          errorMessage = error;
        } else if (error?.toString && typeof error.toString === 'function') {
          errorMessage = error.toString();
        }
        
        // Show detailed error in console for debugging
        console.error('Product save error details:', {
          errorMessage,
          fullError: error,
          productData: editingProduct,
        });
        
        toast.error(`Failed to save product: ${errorMessage}`);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct.mutateAsync(id);
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleAdd = () => {
    setEditingProduct({
      name: '',
      nameAr: '',
      category_id: categories.length > 0 ? categories[0].id : undefined,
      category: 'Industrial' as const,
      status: 'active' as const,
      views: 0,
      description: '',
      descriptionAr: '',
      gallery: [],
      specifications_table: null,
    });
    setImageFile(null); // Reset image file when adding new
    setIsDialogOpen(true);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nameAr.includes(searchTerm)
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{t('products') || 'Products'}</h2>
          <p className="text-muted-foreground mt-1">{t('manageProducts') || 'Manage all products'}</p>
        </div>
        <Button onClick={handleAdd} disabled={createProduct.isPending} >
          <Plus className="h-4 w-4 mr-2" />
          {t('addProduct') || 'Add Product'}
        </Button>
      </div>

      {/* Search */}
      <Card className="backdrop-blur-xl bg-card/90 border-border shadow-elevation-2">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search') || 'Search products...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="backdrop-blur-xl bg-card/90 border-border shadow-elevation-2">
        <CardHeader>
          <CardTitle>{t('productsList') || 'Products List'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className={cn('text-left py-3 px-4 text-foreground', isRTL && 'text-right')}>{t('name') || 'Name'}</th>
                  <th className={cn('text-left py-3 px-4 text-foreground', isRTL && 'text-right')}>{t('category') || 'Category'}</th>
                  <th className={cn('text-left py-3 px-4 text-foreground', isRTL && 'text-right')}>{t('views') || 'Views'}</th>
                  <th className={cn('text-left py-3 px-4 text-foreground', isRTL && 'text-right')}>{t('status') || 'Status'}</th>
                  <th className={cn('text-left py-3 px-4 text-foreground', isRTL && 'text-right')}>{t('actions') || 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-border hover:bg-muted/40 transition-all">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.nameAr}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        {product.category_name ? (
                          <Badge variant="outline" className="border-border text-muted-foreground w-fit">
                            {language === 'ar' ? product.category_nameAr : product.category_name}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-border text-muted-foreground w-fit">{product.category}</Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{product.views.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge className={product.status === 'active' ? 'bg-green-500/80 text-white' : 'bg-gray-500/80 text-white'}>
                        {product.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className={cn('flex gap-2', isRTL && 'flex-row-reverse')}>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(product)} className="hover:bg-muted">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-500/20" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} modal={true}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-popover border-border text-popover-foreground z-[150]">
          <DialogHeader>
            <DialogTitle>{editingProduct?.id ? t('editProduct') || 'Edit Product' : t('addProduct') || 'Add Product'}</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t('name') || 'Name'} (EN)</Label>
                  <Input
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="bg-muted/50 border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('name') || 'Name'} (AR)</Label>
                  <Input
                    value={editingProduct.nameAr}
                    onChange={(e) => setEditingProduct({ ...editingProduct, nameAr: e.target.value })}
                    className="bg-muted/50 border-border text-foreground"
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t('category') || 'Category'}</Label>
                  <Select
                    value={editingProduct.category_id?.toString() || ''}
                    onValueChange={(value) => {
                      const selectedCategory = categories.find(c => c.id.toString() === value);
                      setEditingProduct({ 
                        ...editingProduct, 
                        category_id: selectedCategory ? selectedCategory.id : undefined,
                        category: selectedCategory?.slug === 'industrial' ? 'Industrial' : 'Mining'
                      });
                    }}
                  >
                    <SelectTrigger className="bg-muted/50 border-border text-foreground">
                      <SelectValue placeholder={language === 'ar' ? 'اختر القسم' : 'Select Category'} />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {language === 'ar' ? cat.nameAr : cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('status') || 'Status'}</Label>
                  <Select
                    value={editingProduct.status}
                    onValueChange={(value) => setEditingProduct({ ...editingProduct, status: value })}
                  >
                    <SelectTrigger className="bg-muted/50 border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('description') || 'Description'} (EN)</Label>
                <Textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={3}
                  className="bg-muted/50 border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('description') || 'Description'} (AR)</Label>
                <Textarea
                  value={editingProduct.descriptionAr}
                  onChange={(e) => setEditingProduct({ ...editingProduct, descriptionAr: e.target.value })}
                  rows={3}
                  className="bg-muted/50 border-border text-foreground"
                />
              </div>
              
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>{t('productImage') || 'Product Image'}</Label>
                <div className="flex items-center gap-4">
                  {editingProduct.image ? (
                    <div className="relative">
                      <img
                        src={getImageUrl(editingProduct.image)}
                        alt="Product"
                        className="w-32 h-32 object-cover rounded-lg border border-border"
                        onError={(e) => {
                          console.error('Failed to load product image:', editingProduct.image);
                          // Fallback: hide image and show placeholder
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingProduct({ ...editingProduct, image: '' });
                          setImageFile(null); // Clear image file
                        }}
                        className="absolute -top-2 -right-2 bg-red-500/80 hover:bg-red-500 text-white h-6 w-6 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/40">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 10 * 1024 * 1024) { // Increased limit to 10MB
                            toast.error('Image size must be less than 10MB');
                            return;
                          }
                          setImageFile(file); // Store the file
                          // Also create a preview URL for display
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditingProduct({
                              ...editingProduct,
                              image: URL.createObjectURL(file), // Use URL.createObjectURL for preview
                            });
                            toast.success('Image selected successfully');
                          };
                          reader.onerror = () => {
                            toast.error('Error reading image file');
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      {editingProduct.image ? t('changeImage') || 'Change Image' : t('uploadImage') || 'Upload Image'}
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      {t('imageUploadHint') || 'Recommended: 800x600px, Max 2MB'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Gallery Upload */}
              <div className="space-y-2">
                <Label>
                  {language === 'ar' ? 'معرض الصور' : 'Image Gallery'}
                </Label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length === 0) return;
                        
                        const newImages: string[] = [];
                        let loadedCount = 0;
                        
                        files.forEach((file) => {
                          if (file.size > 2 * 1024 * 1024) {
                            toast.error(`${file.name}: Image size must be less than 2MB`);
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            newImages.push(reader.result as string);
                            loadedCount++;
                            if (loadedCount === files.length) {
                              setEditingProduct({
                                ...editingProduct,
                                gallery: [...(editingProduct.gallery || []), ...newImages],
                              });
                              toast.success(`${newImages.length} image(s) added to gallery`);
                            }
                          };
                          reader.onerror = () => {
                            toast.error(`Error reading ${file.name}`);
                          };
                          reader.readAsDataURL(file);
                        });
                      }}
                      className="hidden"
                      id="gallery-upload"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('gallery-upload') as HTMLInputElement;
                        input?.click();
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors cursor-pointer"
                    >
                      <Upload className="h-4 w-4" />
                      {language === 'ar' ? 'إضافة صور للمعرض' : 'Add Images to Gallery'}
                    </Button>
                  </div>
                  
                  {/* Gallery Preview */}
                  {(editingProduct.gallery && editingProduct.gallery.length > 0) && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {editingProduct.gallery.map((img: string, index: number) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Gallery image ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-border"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newGallery = editingProduct.gallery.filter((_: string, idx: number) => idx !== index);
                              setEditingProduct({
                                ...editingProduct,
                                gallery: newGallery,
                              });
                            }}
                            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {(!editingProduct.gallery || editingProduct.gallery.length === 0) && (
                    <div className="border-2 border-dashed border-border rounded-lg p-8 bg-muted/40 text-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground text-sm">
                        {language === 'ar' 
                          ? 'لا توجد صور في المعرض. ابدأ بإضافة صور'
                          : 'No images in gallery. Start by adding images'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Specifications Tables */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>
                    {language === 'ar' ? 'جداول المواصفات' : 'Specifications Tables'}
                  </Label>
                  <Button
                    type="button"
                    onClick={() => {
                      const currentTables =
                        editingProduct.specifications_table?.tables || [];
                      const emptyTable = createEmptySpecificationsTable().tables[0];
                      setEditingProduct({
                        ...editingProduct,
                        specifications_table: {
                          tables: [...currentTables, emptyTable],
                        },
                      });
                    }}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {language === 'ar' ? 'إضافة جدول' : 'Add Table'}
                  </Button>
                </div>

                {(editingProduct.specifications_table?.tables || []).length === 0 ? (
                  <div className="border border-border rounded-lg p-6 bg-muted/40 text-center">
                    <p className="text-muted-foreground mb-4">
                      {language === 'ar'
                        ? 'لا توجد جداول. ابدأ بإضافة جدول جديد'
                        : 'No tables. Start by adding a new table'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {(editingProduct.specifications_table?.tables || []).map(
                      (table: SpecTable, tableIndex: number) => (
                        <div
                          key={tableIndex}
                          className="border border-border rounded-lg p-4 bg-muted/40 space-y-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="grid flex-1 gap-4 md:grid-cols-2">
                              <div className="space-y-2">
                                <Label>
                                  {language === 'ar'
                                    ? 'عنوان الجدول (إنجليزي)'
                                    : 'Table Title (English)'}
                                </Label>
                                <Input
                                  value={table.titleEn || ''}
                                  onChange={(e) => {
                                    const newTables = [
                                      ...(editingProduct.specifications_table?.tables || []),
                                    ];
                                    newTables[tableIndex] = {
                                      ...newTables[tableIndex],
                                      titleEn: e.target.value,
                                    };
                                    setEditingProduct({
                                      ...editingProduct,
                                      specifications_table: { tables: newTables },
                                    });
                                  }}
                                  className="bg-muted/50 border-border text-foreground"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>
                                  {language === 'ar'
                                    ? 'عنوان الجدول (عربي)'
                                    : 'Table Title (Arabic)'}
                                </Label>
                                <Input
                                  value={table.titleAr || ''}
                                  onChange={(e) => {
                                    const newTables = [
                                      ...(editingProduct.specifications_table?.tables || []),
                                    ];
                                    newTables[tableIndex] = {
                                      ...newTables[tableIndex],
                                      titleAr: e.target.value,
                                    };
                                    setEditingProduct({
                                      ...editingProduct,
                                      specifications_table: { tables: newTables },
                                    });
                                  }}
                                  className="bg-muted/50 border-border text-foreground"
                                  dir="rtl"
                                />
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newTables = (
                                  editingProduct.specifications_table?.tables || []
                                ).filter((_: SpecTable, idx: number) => idx !== tableIndex);
                                setEditingProduct({
                                  ...editingProduct,
                                  specifications_table: { tables: newTables },
                                });
                              }}
                              className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/20"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid gap-2 rounded-lg border border-border bg-background/40 p-3 text-sm font-medium md:grid-cols-2">
                            <span>{SPEC_COLUMN_LABELS.en[0]} / {SPEC_COLUMN_LABELS.en[1]}</span>
                            <span dir="rtl" className="text-right">
                              {SPEC_COLUMN_LABELS.ar[0]} / {SPEC_COLUMN_LABELS.ar[1]}
                            </span>
                          </div>

                          <div className="space-y-3">
                            {(table.rows || []).map((row: SpecRow, rowIdx: number) => (
                              <div
                                key={rowIdx}
                                className="grid gap-3 rounded-lg border border-border p-3 md:grid-cols-2"
                              >
                                <div className="space-y-2">
                                  <Label className="text-xs text-muted-foreground">
                                    {language === 'ar'
                                      ? 'اسم الخاصية (إنجليزي)'
                                      : 'Property / Specification Name (English)'}
                                  </Label>
                                  <Input
                                    value={row.labelEn || ''}
                                    onChange={(e) => {
                                      const newTables = [
                                        ...(editingProduct.specifications_table?.tables || []),
                                      ];
                                      const newRows = [...newTables[tableIndex].rows];
                                      newRows[rowIdx] = {
                                        ...newRows[rowIdx],
                                        labelEn: e.target.value,
                                      };
                                      newTables[tableIndex] = {
                                        ...newTables[tableIndex],
                                        rows: newRows,
                                      };
                                      setEditingProduct({
                                        ...editingProduct,
                                        specifications_table: { tables: newTables },
                                      });
                                    }}
                                    className="bg-muted/50 border-border text-foreground h-8"
                                  />
                                  <Label className="text-xs text-muted-foreground">
                                    {language === 'ar'
                                      ? 'قيمة الخاصية (إنجليزي)'
                                      : 'Property Value (English)'}
                                  </Label>
                                  <Input
                                    value={row.valueEn || ''}
                                    onChange={(e) => {
                                      const newTables = [
                                        ...(editingProduct.specifications_table?.tables || []),
                                      ];
                                      const newRows = [...newTables[tableIndex].rows];
                                      newRows[rowIdx] = {
                                        ...newRows[rowIdx],
                                        valueEn: e.target.value,
                                      };
                                      newTables[tableIndex] = {
                                        ...newTables[tableIndex],
                                        rows: newRows,
                                      };
                                      setEditingProduct({
                                        ...editingProduct,
                                        specifications_table: { tables: newTables },
                                      });
                                    }}
                                    className="bg-muted/50 border-border text-foreground h-8"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs text-muted-foreground">
                                    {language === 'ar'
                                      ? 'اسم الخاصية (عربي)'
                                      : 'Property / Specification Name (Arabic)'}
                                  </Label>
                                  <Input
                                    value={row.labelAr || ''}
                                    onChange={(e) => {
                                      const newTables = [
                                        ...(editingProduct.specifications_table?.tables || []),
                                      ];
                                      const newRows = [...newTables[tableIndex].rows];
                                      newRows[rowIdx] = {
                                        ...newRows[rowIdx],
                                        labelAr: e.target.value,
                                      };
                                      newTables[tableIndex] = {
                                        ...newTables[tableIndex],
                                        rows: newRows,
                                      };
                                      setEditingProduct({
                                        ...editingProduct,
                                        specifications_table: { tables: newTables },
                                      });
                                    }}
                                    className="bg-muted/50 border-border text-foreground h-8"
                                    dir="rtl"
                                  />
                                  <Label className="text-xs text-muted-foreground">
                                    {language === 'ar'
                                      ? 'قيمة الخاصية (عربي)'
                                      : 'Property Value (Arabic)'}
                                  </Label>
                                  <Input
                                    value={row.valueAr || ''}
                                    onChange={(e) => {
                                      const newTables = [
                                        ...(editingProduct.specifications_table?.tables || []),
                                      ];
                                      const newRows = [...newTables[tableIndex].rows];
                                      newRows[rowIdx] = {
                                        ...newRows[rowIdx],
                                        valueAr: e.target.value,
                                      };
                                      newTables[tableIndex] = {
                                        ...newTables[tableIndex],
                                        rows: newRows,
                                      };
                                      setEditingProduct({
                                        ...editingProduct,
                                        specifications_table: { tables: newTables },
                                      });
                                    }}
                                    className="bg-muted/50 border-border text-foreground h-8"
                                    dir="rtl"
                                  />
                                </div>
                                <div className="md:col-span-2 flex justify-end">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const newTables = [
                                        ...(editingProduct.specifications_table?.tables || []),
                                      ];
                                      newTables[tableIndex].rows = newTables[
                                        tableIndex
                                      ].rows.filter((_: SpecRow, idx: number) => idx !== rowIdx);
                                      setEditingProduct({
                                        ...editingProduct,
                                        specifications_table: { tables: newTables },
                                      });
                                    }}
                                    className="h-8 w-8 p-0 text-red-400 hover:bg-red-500/20"
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <Button
                            type="button"
                            onClick={() => {
                              const newTables = [
                                ...(editingProduct.specifications_table?.tables || []),
                              ];
                              newTables[tableIndex].rows = [
                                ...newTables[tableIndex].rows,
                                { labelEn: '', labelAr: '', valueEn: '', valueAr: '' },
                              ];
                              setEditingProduct({
                                ...editingProduct,
                                specifications_table: { tables: newTables },
                              });
                            }}
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {language === 'ar' ? 'إضافة صف' : 'Add Row'}
                          </Button>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-border hover:bg-muted"
                >
                  <X className="h-4 w-4 mr-2" />
                  {t('cancel') || 'Cancel'}
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={createProduct.isPending || updateProduct.isPending}
                  
                >
                  <Save className="h-4 w-4 mr-2" />
                  {createProduct.isPending || updateProduct.isPending ? 'Saving...' : (t('save') || 'Save')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsManagement;


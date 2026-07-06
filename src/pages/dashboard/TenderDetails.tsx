import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useTender, useTenderSubmissions, useUpdateSubmissionStatus } from '@/hooks/useApi';
import { TenderSubmissionsList } from '@/components/dashboard/TenderSubmissionsList';
import { toast } from 'sonner';
import type { TenderSubmission } from '@/services/api';

const TenderDetails = () => {
  const { tenderId } = useParams<{ tenderId: string }>();
  const navigate = useNavigate();
  const { language, isRTL } = useLanguage();
  const id = Number(tenderId);

  const { data: tender, isLoading: tenderLoading } = useTender(id);
  const { data: submissions = [], isLoading: submissionsLoading } = useTenderSubmissions(id);
  const updateSubmissionStatus = useUpdateSubmissionStatus();

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

  const handleStatusChange = async (submissionId: number, status: TenderSubmission['status']) => {
    try {
      await updateSubmissionStatus.mutateAsync({ tenderId: id, submissionId, status });
      toast.success(
        language === 'ar' ? 'تم تحديث حالة التقديم بنجاح' : 'Submission status updated successfully',
      );
    } catch {
      toast.error(
        language === 'ar' ? 'فشل في تحديث حالة التقديم' : 'Failed to update submission status',
      );
    }
  };

  if (tenderLoading) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">
          {language === 'ar' ? 'جاري تحميل المناقصة...' : 'Loading tender...'}
        </p>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="space-y-4 py-12 text-center">
        <p className="text-muted-foreground">
          {language === 'ar' ? 'المناقصة غير موجودة' : 'Tender not found'}
        </p>
        <Button variant="outline" onClick={() => navigate('/dashboard/tenders')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {language === 'ar' ? 'العودة للمناقصات' : 'Back to Tenders'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={cn('flex items-center gap-4', isRTL && 'flex-row-reverse')}>
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/tenders')}>
          <ArrowLeft className={cn('h-4 w-4', isRTL ? 'ml-2 rotate-180' : 'mr-2')} />
          {language === 'ar' ? 'العودة' : 'Back'}
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {language === 'ar' ? tender.titleAr : tender.title}
          </h2>
          <p className="mt-1 text-muted-foreground">
            {language === 'ar' ? 'تفاصيل المناقصة والتقديمات' : 'Tender details and submissions'}
          </p>
        </div>
      </div>

      <Card className="border-border bg-card/90 backdrop-blur-xl shadow-elevation-2">
        <CardHeader>
          <div className={cn('flex flex-wrap items-center gap-3', isRTL && 'flex-row-reverse')}>
            <CardTitle>{language === 'ar' ? 'معلومات المناقصة' : 'Tender Information'}</CardTitle>
            {getStatusBadge(tender.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {language === 'ar' ? tender.descriptionAr : tender.description}
          </p>
          <div className={cn('flex flex-wrap gap-6 text-sm text-muted-foreground', isRTL && 'flex-row-reverse')}>
            <span className={cn('flex items-center gap-1', isRTL && 'flex-row-reverse')}>
              <FileText className="h-4 w-4" />
              {language === 'ar' ? tender.categoryAr : tender.category}
            </span>
            <span className={cn('flex items-center gap-1', isRTL && 'flex-row-reverse')}>
              <Calendar className="h-4 w-4" />
              {language === 'ar' ? 'الموعد النهائي: ' : 'Deadline: '}
              {new Date(tender.deadline).toLocaleDateString()}
            </span>
            <span className="font-medium text-foreground">
              {language === 'ar' ? 'عدد التقديمات: ' : 'Submissions: '}
              {submissions.length}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card/90 backdrop-blur-xl shadow-elevation-2">
        <CardHeader>
          <CardTitle>
            {language === 'ar' ? 'التقديمات' : 'Submissions'}
            {!submissionsLoading ? ` (${submissions.length})` : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submissionsLoading ? (
            <p className="py-8 text-center text-muted-foreground">
              {language === 'ar' ? 'جاري تحميل التقديمات...' : 'Loading submissions...'}
            </p>
          ) : (
            <TenderSubmissionsList
              submissions={submissions}
              onStatusChange={handleStatusChange}
              isUpdating={updateSubmissionStatus.isPending}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TenderDetails;

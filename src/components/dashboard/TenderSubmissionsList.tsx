import { Calendar, CheckCircle2, Clock, Download, Eye, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { getApiOrigin } from '@/lib/images';
import type { TenderSubmission } from '@/services/api';

interface TenderSubmissionsListProps {
  submissions: TenderSubmission[];
  onStatusChange: (submissionId: number, status: TenderSubmission['status']) => void;
  isUpdating?: boolean;
}

function resolveFileUrl(file: string): string {
  if (file.startsWith('data:') || file.startsWith('http://') || file.startsWith('https://')) {
    return file;
  }
  if (file.startsWith('/uploads')) {
    return `${getApiOrigin()}${file}`;
  }
  return file;
}

function downloadFile(file: string, fileName: string) {
  const link = document.createElement('a');
  link.href = resolveFileUrl(file);
  link.download = fileName;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.click();
}

export function TenderSubmissionsList({
  submissions,
  onStatusChange,
  isUpdating,
}: TenderSubmissionsListProps) {
  const { isRTL, language } = useLanguage();

  const getSubmissionStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; labelAr: string; className: string; icon: typeof Clock }> = {
      pending: { label: 'Pending', labelAr: 'قيد المراجعة', className: 'bg-yellow-500/80 text-white', icon: Clock },
      reviewed: { label: 'Reviewed', labelAr: 'تمت المراجعة', className: 'bg-blue-500/80 text-white', icon: Eye },
      accepted: { label: 'Accepted', labelAr: 'مقبول', className: 'bg-green-500/80 text-white', icon: CheckCircle2 },
      rejected: { label: 'Rejected', labelAr: 'مرفوض', className: 'bg-red-500/80 text-white', icon: XCircle },
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    const Icon = statusInfo.icon;
    return (
      <Badge className={cn('flex items-center gap-1', statusInfo.className)}>
        <Icon className="h-3 w-3" />
        {language === 'ar' ? statusInfo.labelAr : statusInfo.label}
      </Badge>
    );
  };

  if (submissions.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        {language === 'ar' ? 'لا توجد تقديمات' : 'No submissions yet'}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <Card key={submission.id} className="border-border bg-muted/40 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className={cn('space-y-3', isRTL && 'text-right')}>
              <div className={cn('flex items-start justify-between gap-4', isRTL && 'flex-row-reverse')}>
                <div className="space-y-1">
                  <h4 className="font-semibold text-foreground">{submission.companyName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {language === 'ar' ? 'جهة الاتصال: ' : 'Contact: '}
                    {submission.contactName}
                  </p>
                  <p className="text-sm text-muted-foreground">{submission.email}</p>
                  {submission.phone ? (
                    <p className="text-sm text-muted-foreground">{submission.phone}</p>
                  ) : null}
                </div>
                <div className={cn('flex shrink-0 flex-col items-end gap-2', isRTL && 'items-start')}>
                  {getSubmissionStatusBadge(submission.status)}
                  <Select
                    value={submission.status}
                    disabled={isUpdating}
                    onValueChange={(value: TenderSubmission['status']) =>
                      onStatusChange(submission.id, value)
                    }
                  >
                    <SelectTrigger className="w-[150px] border-border bg-muted/50 text-xs text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-border bg-popover">
                      <SelectItem value="pending">
                        {language === 'ar' ? 'قيد المراجعة' : 'Pending'}
                      </SelectItem>
                      <SelectItem value="reviewed">
                        {language === 'ar' ? 'تمت المراجعة' : 'Reviewed'}
                      </SelectItem>
                      <SelectItem value="accepted">
                        {language === 'ar' ? 'مقبول' : 'Accepted'}
                      </SelectItem>
                      <SelectItem value="rejected">
                        {language === 'ar' ? 'مرفوض' : 'Rejected'}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className={cn('flex items-center gap-1 text-xs text-muted-foreground', isRTL && 'flex-row-reverse')}>
                <Calendar className="h-3 w-3" />
                {language === 'ar' ? 'تاريخ التقديم: ' : 'Submitted: '}
                {new Date(submission.submittedAt).toLocaleString()}
              </div>
              {submission.files && submission.files.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    {language === 'ar' ? 'الملفات المرفقة:' : 'Attached Files:'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {submission.files.map((file, index) => (
                      <Button
                        key={`${submission.id}-file-${index}`}
                        variant="outline"
                        size="sm"
                        className="border-border hover:bg-muted"
                        onClick={() => downloadFile(file, `submission-${submission.id}-file-${index + 1}`)}
                      >
                        <Download className="mr-1 h-3 w-3" />
                        {language === 'ar' ? `ملف ${index + 1}` : `File ${index + 1}`}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default TenderSubmissionsList;

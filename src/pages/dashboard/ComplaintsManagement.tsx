import { useState } from 'react';
import { Eye, Search, Mail, MessageSquare, Calendar, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useComplaints, useUpdateComplaint } from '@/hooks/useApi';
import { toast } from 'sonner';

const ComplaintsManagement = () => {
  const { t, isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);

  const { data: complaints = [], isLoading } = useComplaints();
  const updateComplaint = useUpdateComplaint();

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateComplaint.mutateAsync({ id, updates: { status: newStatus as any } });
      toast.success('Complaint status updated');
    } catch (error) {
      toast.error('Failed to update complaint status');
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">{t('complaints') || 'Complaints'}</h2>
        <p className="text-muted-foreground mt-1">{t('manageComplaints') || 'Manage customer complaints'}</p>
      </div>

      <Card className="backdrop-blur-xl bg-card/90 border-border shadow-elevation-2">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('search') || 'Search complaints...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-muted/50 border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="backdrop-blur-xl bg-card/90 border-border shadow-elevation-2">
        <CardHeader>
          <CardTitle>{t('complaintsList') || 'Complaints List'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="flex items-center justify-between p-4 backdrop-blur-xl bg-muted/40 border border-border rounded-lg hover:bg-muted transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-medium text-foreground">{complaint.name}</p>
                    <Badge
                      className={
                        complaint.status === 'resolved' ? 'bg-green-500/80 text-white' :
                        complaint.status === 'in-progress' ? 'bg-yellow-500/80 text-white' :
                        'bg-red-500/80 text-white'
                      }
                    >
                      {complaint.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      {complaint.email}
                    </div>
                    <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      {complaint.subject}
                    </div>
                    <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(complaint.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                  <Select
                    value={complaint.status}
                    onValueChange={(value) => handleStatusChange(complaint.id, value)}
                  >
                    <SelectTrigger className="w-32 bg-muted/50 border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedComplaint(complaint)} className="hover:bg-muted">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedComplaint && (
        <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedComplaint.subject}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Name</p>
                <p>{selectedComplaint.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p>{selectedComplaint.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Message</p>
                <p>{selectedComplaint.message}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date</p>
                <p>{new Date(selectedComplaint.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge
                  className={
                    selectedComplaint.status === 'resolved' ? 'bg-green-500' :
                    selectedComplaint.status === 'in-progress' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }
                >
                  {selectedComplaint.status}
                </Badge>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ComplaintsManagement;


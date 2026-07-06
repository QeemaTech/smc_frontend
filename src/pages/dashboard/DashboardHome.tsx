import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Newspaper, Mail, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStatistics, useComplaints } from '@/hooks/useApi';

const DashboardHome = () => {
  const { t } = useLanguage();
  const { data: stats, isLoading } = useStatistics();
  const { data: complaints = [] } = useComplaints();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">{t('overview')}</h2>
        <p className="text-muted-foreground mt-1">{t('dashboardSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border bg-card shadow-elevation-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">{t('totalProducts')}</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">{t('activeProducts')}</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-elevation-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">{t('totalNews')}</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <Newspaper className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats?.totalNews || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">{t('publishedArticles')}</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-elevation-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">{t('totalContacts')}</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <Mail className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats?.totalContacts || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">{t('newMessages')}</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-elevation-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">{t('totalComplaints')}</CardTitle>
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageSquare className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats?.totalComplaints || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('pendingLabel')}: {complaints?.filter(c => c.status === 'pending').length || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border bg-card shadow-elevation-2">
          <CardHeader>
            <CardTitle>{t('recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted transition-all">
                <div>
                  <p className="font-medium text-foreground">{t('newContactReceived')}</p>
                  <p className="text-sm text-muted-foreground">{t('twoHoursAgo')}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-primary"></div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted transition-all">
                <div>
                  <p className="font-medium text-foreground">{t('productUpdated')}</p>
                  <p className="text-sm text-muted-foreground">{t('fiveHoursAgo')}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-primary/70"></div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted transition-all">
                <div>
                  <p className="font-medium text-foreground">{t('newNewsPublished')}</p>
                  <p className="text-sm text-muted-foreground">{t('oneDayAgo')}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-primary/50"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-elevation-2">
          <CardHeader>
            <CardTitle>{t('quickStats')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                <span className="text-muted-foreground">{t('totalRevenue')}</span>
                <span className="font-bold text-foreground">{stats?.totalRevenue || '0'} EGP</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                <span className="text-muted-foreground">{t('monthlyGrowth')}</span>
                <span className="font-bold text-foreground">{stats?.monthlyGrowth || '+0%'}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                <span className="text-muted-foreground">{t('totalViewsLabel')}</span>
                <span className="font-bold text-foreground">{(stats?.totalViews || 0).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;

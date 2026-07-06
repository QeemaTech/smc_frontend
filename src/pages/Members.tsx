import { Users, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { pickLocalized } from '@/lib/localize';
import { resolveImageSrc } from '@/lib/utils';
import { useMembers } from '@/hooks/useApi';
import { usePageHero } from '@/hooks/usePageContent';
import { PublicPageHeader, PublicShell } from '@/components/public/PublicShell';

const Members = () => {
  const { t, language, isRTL } = useLanguage();
  const hero = usePageHero('members', {
    title: t('boardMembersTitle'),
    description: t('boardMembersSubtitle'),
  });
  const { data: members = [], isLoading } = useMembers();

  return (
    <div className="pb-12 md:pb-16">
      <PublicPageHeader
        icon="groups"
        title={hero.title}
        description={hero.description}
        centered
      />

      <PublicShell className="py-8 md:py-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-muted-foreground">{t('loading')}</p>
            </div>
          </div>
        ) : members.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">{t('noMembersAvailable')}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {members.map((member) => {
              const photoSrc = resolveImageSrc(
                member.photoUrl ?? member.image ?? member.imageUrl,
                { cacheKey: member.updatedAt },
              );

              return (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-start">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                      {photoSrc ? (
                        <img
                          src={photoSrc}
                          alt={pickLocalized(member, 'name', language)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Users className="w-12 h-12 text-primary" />
                      )}
                    </div>
                    <CardTitle className="text-2xl font-bold">{pickLocalized(member, 'name', language)}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-start">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Award className="w-5 h-5 text-primary" />
                      <p className="text-lg font-semibold text-primary">{pickLocalized(member, 'title', language)}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <p className="mt-12 text-start text-muted-foreground">{t('membersGovernanceNote')}</p>
      </PublicShell>
    </div>
  );
};

export default Members;

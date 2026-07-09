import { Users, Award } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { pickLocalized } from '@/lib/localize';
import { resolveImageSrc } from '@/lib/utils';
import { useMembers } from '@/hooks/useApi';
import { usePageHero, usePageSections } from '@/hooks/usePageContent';
import { PublicPageHeader, PublicShell } from '@/components/public/PublicShell';
import { ContentCard } from '@/components/public/cards';
import { PageSections } from '@/components/public/ContentSection';

const Members = () => {
  const { t, language, isRTL } = useLanguage();
  const sections = usePageSections('members');
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
            {members.map((member, index) => {
              const photoSrc = resolveImageSrc(
                member.photoUrl ?? member.image ?? member.imageUrl,
                { cacheKey: member.updatedAt },
              );

              return (
                <ContentCard key={member.id} index={index} className="p-6 text-center keep-center">
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-primary-container">
                    {photoSrc ? (
                      <img
                        src={photoSrc}
                        alt={pickLocalized(member, 'name', language)}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Users className="h-12 w-12 text-primary" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold">{pickLocalized(member, 'name', language)}</h3>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    <p className="text-lg font-medium text-primary">{pickLocalized(member, 'title', language)}</p>
                  </div>
                </ContentCard>
              );
            })}
          </div>
        )}

        <p className="mt-12 text-start text-muted-foreground">{t('membersGovernanceNote')}</p>
        <div className="mt-12">
          <PageSections sections={sections} />
        </div>
      </PublicShell>
    </div>
  );
};

export default Members;

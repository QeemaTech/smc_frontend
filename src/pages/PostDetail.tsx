import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedLink } from '@/hooks/useLocalizedNavigate';
import { cn, resolveImageSrc } from '@/lib/utils';
import { pickLocalized } from '@/lib/localize';
import { useNews } from '@/hooks/useApi';
import { PublicDetailTitle, PublicShell } from '@/components/public/PublicShell';
import slideOne from '@/assets/manganese/one.jpeg';
import slideTwo from '@/assets/manganese/two.jpg';
import slideThree from '@/assets/manganese/three.jpg';
import homeImage from '@/assets/manganese/home3-image3.jpg';
import portfolio14 from '@/assets/manganese/portfolio14.jpg';
import portfolio16 from '@/assets/manganese/portfolio16.jpg';

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const { t, isRTL, language } = useLanguage();
  const { data: news = [], isLoading } = useNews();

  const defaultImages = [slideOne, slideTwo, slideThree, homeImage, portfolio14, portfolio16];
  const post = news.find(n => n.id === parseInt(postId || '0'));

  // Fallback post data if API fails
  const fallbackPosts: Record<string, any> = {
    '1': {
      id: 1,
      title: 'SMC Expands Production Capacity',
      date: '2024-11-01',
      category: 'Company News',
      image: slideOne,
      excerpt: 'Sinai Manganese Company announces major expansion of production facilities, increasing annual output by 20%.',
      content: `
        <p>Sinai Manganese Company (SMC) is pleased to announce a significant expansion of its production facilities, marking a new milestone in the company's growth trajectory. This expansion will increase our annual production capacity by 20%, enabling us to better serve our growing customer base both domestically and internationally.</p>
        
        <p>The expansion project includes the installation of new state-of-the-art equipment and the enhancement of our existing production lines. This investment reflects our commitment to maintaining our position as Egypt's leading manganese producer while meeting the increasing global demand for high-quality ferroalloys.</p>
        
        <p>Key highlights of the expansion include:</p>
        <ul>
          <li>Increased annual production capacity to 43,200 tons</li>
          <li>Enhanced quality control systems</li>
          <li>Improved energy efficiency</li>
          <li>Expanded storage and logistics capabilities</li>
        </ul>
        
        <p>The project is expected to be completed by the end of 2025, with production ramp-up beginning in early 2026. This expansion will create approximately 50 new jobs and strengthen our contribution to the Egyptian economy.</p>
      `,
    },
    '2': {
      id: 2,
      title: 'New Quality Certifications Achieved',
      date: '2024-10-15',
      category: 'Awards',
      image: slideTwo,
      excerpt: 'SMC receives international quality certifications, reinforcing our commitment to excellence.',
      content: `
        <p>Sinai Manganese Company has successfully obtained several international quality certifications, further validating our commitment to producing the highest quality products that meet and exceed global standards.</p>
        
        <p>These certifications include ISO 9001:2015 for Quality Management Systems, ISO 14001:2015 for Environmental Management, and OHSAS 18001 for Occupational Health and Safety. These achievements demonstrate our dedication to continuous improvement and sustainable operations.</p>
        
        <p>Our quality assurance team has worked tirelessly to ensure that all our processes, from raw material sourcing to final product delivery, meet the stringent requirements of these international standards. This certification process involved comprehensive audits, process improvements, and staff training.</p>
        
        <p>These certifications not only validate our current operations but also position us as a trusted partner for international customers who require certified suppliers. We are committed to maintaining these standards and continuously improving our quality management systems.</p>
      `,
    },
    '3': {
      id: 3,
      title: 'Sustainability Initiative Launch',
      date: '2024-09-28',
      category: 'Sustainability',
      image: slideThree,
      excerpt: 'Introduction of new environmental sustainability programs to reduce carbon footprint.',
      content: `
        <p>Sinai Manganese Company is proud to announce the launch of our comprehensive sustainability initiative, aimed at reducing our environmental impact and promoting sustainable industrial practices.</p>
        
        <p>This initiative includes several key programs:</p>
        <ul>
          <li>Energy efficiency improvements across all facilities</li>
          <li>Waste reduction and recycling programs</li>
          <li>Water conservation measures</li>
          <li>Renewable energy integration</li>
          <li>Carbon footprint reduction targets</li>
        </ul>
        
        <p>We have set ambitious targets to reduce our carbon emissions by 30% over the next five years through a combination of process optimization, technology upgrades, and renewable energy adoption. Our 21 MW gas turbine power station is already a step in the right direction, and we are exploring additional solar power installations.</p>
        
        <p>This sustainability initiative reflects our responsibility as an industry leader to protect the environment while continuing to provide high-quality products to our customers. We believe that sustainable practices are not just good for the environment, but also make good business sense in the long term.</p>
      `,
    },
    '4': {
      id: 4,
      title: 'Partnership with Leading Steel Manufacturers',
      date: '2024-09-10',
      category: 'Partnership',
      image: homeImage,
      excerpt: 'SMC signs strategic partnerships with major steel producers across the Middle East.',
      content: `
        <p>Sinai Manganese Company has entered into strategic partnerships with several leading steel manufacturers across the Middle East, expanding our market presence and strengthening our position in the regional ferroalloys market.</p>
        
        <p>These partnerships will enable us to:</p>
        <ul>
          <li>Supply high-quality silicomanganese to major steel producers</li>
          <li>Develop customized product formulations for specific applications</li>
          <li>Establish long-term supply agreements</li>
          <li>Collaborate on research and development projects</li>
        </ul>
        
        <p>Our partners recognize the quality and consistency of our products, as well as our commitment to reliable supply and customer service. These partnerships are built on mutual trust and a shared vision of advancing the steel industry in the region.</p>
        
        <p>This expansion into new markets represents a significant milestone for SMC and demonstrates the growing recognition of Egyptian industrial capabilities on the international stage. We look forward to building on these partnerships and exploring new opportunities for collaboration.</p>
      `,
    },
    '5': {
      id: 5,
      title: 'Investment in Renewable Energy',
      date: '2024-08-22',
      category: 'Infrastructure',
      image: portfolio14,
      excerpt: 'New solar power installation to supplement gas turbine power station.',
      content: `
        <p>Sinai Manganese Company is investing in renewable energy infrastructure with the installation of a new solar power system to supplement our existing 21 MW gas turbine power station.</p>
        
        <p>This solar installation will:</p>
        <ul>
          <li>Reduce our dependence on fossil fuels</li>
          <li>Lower our operational costs</li>
          <li>Decrease our carbon footprint</li>
          <li>Provide backup power capacity</li>
        </ul>
        
        <p>The solar panels will be installed on available roof space and open areas within our facility, maximizing the use of our land while generating clean energy. This project aligns with our sustainability goals and demonstrates our commitment to environmental responsibility.</p>
        
        <p>We expect the solar installation to generate approximately 2 MW of power, which will supplement our existing power generation capacity and help us achieve our energy efficiency targets. This investment is part of our broader strategy to modernize our infrastructure and reduce our environmental impact.</p>
      `,
    },
    '6': {
      id: 6,
      title: 'Employee Training Program Success',
      date: '2024-08-05',
      category: 'Training',
      image: portfolio16,
      excerpt: 'Over 200 employees complete advanced technical training programs.',
      content: `
        <p>Sinai Manganese Company has successfully completed a comprehensive employee training program, with over 200 employees receiving advanced technical training in various aspects of our operations.</p>
        
        <p>The training program covered:</p>
        <ul>
          <li>Advanced production techniques</li>
          <li>Quality control and assurance</li>
          <li>Safety procedures and best practices</li>
          <li>Equipment operation and maintenance</li>
          <li>Environmental management</li>
        </ul>
        
        <p>This investment in our workforce reflects our belief that our employees are our most valuable asset. By providing them with the skills and knowledge they need to excel, we are not only improving our operations but also creating opportunities for career growth and development.</p>
        
        <p>The training program was conducted by both internal experts and external specialists, ensuring that our employees receive the most up-to-date knowledge and best practices. We are committed to continuing these training initiatives to maintain a highly skilled and motivated workforce.</p>
        
        <p>Employees who completed the program have reported increased confidence in their roles and a better understanding of how their work contributes to the company's overall success. This training program is part of our ongoing commitment to employee development and operational excellence.</p>
      `,
    },
  };

  const displayPost = post || (postId ? fallbackPosts[postId] : null);
  const postImage = resolveImageSrc(post?.image ?? displayPost?.image, {
    fallback: defaultImages[parseInt(postId || '0') % defaultImages.length],
  });
  const postTitle = post ? pickLocalized(post, 'title', language) : displayPost?.title;
  const postContent = post ? pickLocalized(post, 'content', language) : displayPost?.content;
  const postCategory = pickLocalized(post ?? displayPost, 'category', language, t('news'));
  const postDate = post?.date || displayPost?.date || new Date().toISOString().split('T')[0];

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center py-16">
        <div className={cn('text-center', isRTL && 'text-right')}>
          <p className="text-muted-foreground">{t('loadingPost')}</p>
        </div>
      </div>
    );
  }

  if (!displayPost) {
    return (
      <div className="pb-12 md:pb-16">
        <PublicShell className="flex min-h-[40vh] flex-col items-center justify-center py-16 text-center">
          <PublicDetailTitle title={t('postNotFound')} description={t('postNotFoundDesc')} />
          <Button asChild className="mt-6">
            <Link to={getLocalizedLink('/news', language)}>{t('backToNews')}</Link>
          </Button>
        </PublicShell>
      </div>
    );
  }

  return (
    <div className="pb-12 md:pb-16 bg-background">
      <PublicShell className="max-w-4xl py-8 md:py-10">
        <div className="mb-6 md:mb-8">
          <Button asChild variant="ghost" className="gap-2 px-0 hover:bg-transparent">
            <Link to={getLocalizedLink('/news', language)}>
              <ArrowLeft className={cn('h-4 w-4', isRTL && 'rotate-180')} />
              {t('backToNews')}
            </Link>
          </Button>
        </div>

        <div className="relative mb-8 h-72 overflow-hidden rounded-[24px] border border-border shadow-elevation-2 md:h-96">
          <img
            src={postImage}
            alt={postTitle}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
          <div className="absolute bottom-0 start-0 end-0 p-6 md:p-8 text-start">
            <PublicDetailTitle
              eyebrow={postCategory}
              title={postTitle}
            />
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="ltr-nums">
                {new Date(postDate).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardContent className="p-8 md:p-12">
            <div
              className="prose prose-lg max-w-none text-start"
              dangerouslySetInnerHTML={{ __html: postContent || '' }}
            />
          </CardContent>
        </Card>

        {/* Related Posts or CTA */}
        <div className="mt-12 text-center">
          <Button asChild size="lg" variant="outline">
            <Link to={getLocalizedLink('/news', language)}>{t('viewAllNews')}</Link>
          </Button>
        </div>
      </PublicShell>
    </div>
  );
};

export default PostDetail;


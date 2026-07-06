import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MaterialIcon } from '@/components/MaterialIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedLink } from '@/hooks/useLocalizedNavigate';
import { cn } from '@/lib/utils';

export interface SlideItem {
  image: string;
  title?: string;
  certification?: string;
  description?: string;
}

interface ImageSlideshowProps {
  images?: string[];
  slides?: SlideItem[];
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  autoPlayInterval?: number;
  className?: string;
}

const processSteps = [
  { icon: 'landscape', key: 'galleryProcessOre' as const },
  { icon: 'precision_manufacturing', key: 'galleryProcessProcessing' as const },
  { icon: 'factory', key: 'galleryProcessSteel' as const },
];

export const ImageSlideshow = ({
  images,
  slides: slidesProp,
  title,
  description,
  ctaLabel,
  ctaHref,
  autoPlayInterval = 5000,
  className,
}: ImageSlideshowProps) => {
  const { t, language, isRTL } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const thumbTrackRef = useRef<HTMLDivElement>(null);
  const thumbContainerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const slides = useMemo<SlideItem[]>(() => {
    if (slidesProp?.length) return slidesProp;
    if (images?.length) {
      return images.map((image) => ({ image }));
    }
    return [];
  }, [slidesProp, images]);

  const totalSlides = slides.length;

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + totalSlides) % totalSlides);
    },
    [totalSlides],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const timer = setInterval(goNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPaused, goNext, autoPlayInterval, totalSlides]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        !viewportRef.current?.contains(document.activeElement) &&
        document.activeElement !== viewportRef.current
      ) {
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        isRTL ? goPrev() : goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        isRTL ? goNext() : goPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, isRTL]);

  useEffect(() => {
    const track = thumbTrackRef.current;
    const container = thumbContainerRef.current;
    if (!track || !container) return;

    const thumbElements = track.children;
    if (!thumbElements[activeIndex]) return;

    const thumb = thumbElements[activeIndex] as HTMLElement;
    const containerWidth = container.offsetWidth;
    const thumbCenter = thumb.offsetLeft + thumb.offsetWidth / 2;
    const trackWidth = track.scrollWidth;

    let offset = thumbCenter - containerWidth / 2;
    const maxOffset = trackWidth - containerWidth;
    offset = Math.max(0, Math.min(offset, maxOffset));

    track.style.transform = `translateX(-${offset}px)`;
  }, [activeIndex]);

  if (!slides.length) return null;

  const activeSlide = slides[activeIndex];
  const slideTitle = activeSlide.title || title || t('productSilicomanganese');
  const slideCertification = activeSlide.certification || t('galleryCertified');
  const slideDescription = activeSlide.description || description || t('galleryOptimized');
  const specLabel = ctaLabel || t('galleryRequestSpec');
  const specHref = ctaHref || getLocalizedLink('/contact', language);

  return (
    <section className={cn('slideshow-section py-16 md:py-20', className)}>
      <div className="container mx-auto px-4">
        <div
          ref={viewportRef}
          className="slideshow-viewport group mb-6"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          tabIndex={0}
          role="region"
          aria-label="Image slideshow"
          aria-roledescription="carousel"
        >
          <div className="grid md:grid-cols-2 gap-0 min-h-[320px] lg:min-h-[380px]">
            {/* Image panel */}
            <div className="relative overflow-hidden p-4 md:p-6 lg:p-8">
              <div className="relative h-full min-h-[240px] md:min-h-[280px] rounded-2xl overflow-hidden bg-white/40">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={cn(
                      'slideshow-slide',
                      index === activeIndex
                        ? 'slideshow-slide--active z-[2]'
                        : 'slideshow-slide--inactive z-[1]',
                    )}
                    aria-hidden={index !== activeIndex}
                  >
                    <img
                      src={slide.image}
                      alt={`${slideTitle} — ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading={index === 0 ? 'eager' : 'lazy'}
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Content panel */}
            <div className="flex flex-col justify-between p-6 md:p-8 lg:p-10 text-start">
              <div className="space-y-4">
                <h2 className="font-heading text-xl md:text-2xl lg:text-[1.65rem] font-bold leading-snug tracking-wide text-[#0D236A] uppercase">
                  {slideTitle}
                </h2>

                <div className="flex flex-wrap items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#0D236A]/90">
                  <MaterialIcon
                    name="verified"
                    size={22}
                    className="text-amber-500"
                    filled
                  />
                  <span>{slideCertification}</span>
                  <MaterialIcon
                    name="check_circle"
                    size={20}
                    className="text-[#204393]"
                    filled
                  />
                </div>

                <p className="text-sm md:text-base font-medium uppercase tracking-wide text-[#0D236A]/75 leading-relaxed">
                  {slideDescription}
                </p>

                <Link
                  to={specHref}
                  className="inline-block text-sm font-semibold uppercase tracking-wider text-[#204393] underline underline-offset-4 decoration-[#204393]/60 hover:decoration-[#204393] transition-colors"
                >
                  {specLabel}
                </Link>
              </div>

              {/* Process flow */}
              <div className="mt-8 flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-[#0D236A]/70">
                {processSteps.map((step, index) => (
                  <div key={step.key} className="flex items-center gap-2 md:gap-3">
                    <div className="flex flex-col items-center gap-1 min-w-[4.5rem]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0D236A]/10">
                        <MaterialIcon name={step.icon} size={20} className="text-[#0D236A]/70" />
                      </div>
                      <span className="font-medium uppercase tracking-wide text-center">
                        {t(step.key)}
                      </span>
                    </div>
                    {index < processSteps.length - 1 && (
                      <MaterialIcon
                        name={isRTL ? 'arrow_back' : 'arrow_forward'}
                        size={18}
                        className="text-[#0D236A]/35 mb-5"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation: arrows + dots */}
        {totalSlides > 1 && (
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={goPrev}
              className="slideshow-inline-nav"
              aria-label="Previous slide"
            >
              <ChevronLeft className={cn('h-5 w-5', isRTL && 'rotate-180')} strokeWidth={2} />
            </button>

            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  className={cn(
                    'rounded-full transition-all duration-300',
                    index === activeIndex
                      ? 'w-2.5 h-2.5 bg-[#0D236A]'
                      : 'w-2 h-2 bg-[#0D236A]/25 hover:bg-[#0D236A]/45',
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goNext}
              className="slideshow-inline-nav"
              aria-label="Next slide"
            >
              <ChevronRight className={cn('h-5 w-5', isRTL && 'rotate-180')} strokeWidth={2} />
            </button>
          </div>
        )}

        {/* Thumbnail strip */}
        {totalSlides > 1 && (
          <div ref={thumbContainerRef} className="slideshow-thumb-strip mx-auto max-w-4xl">
            <div ref={thumbTrackRef} className="slideshow-thumb-track justify-center">
              {slides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  className={cn(
                    'group/thumb relative flex-shrink-0 overflow-hidden rounded-xl',
                    'w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28',
                    'transition-all duration-300',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D236A]/50',
                    index === activeIndex
                      ? 'border-[2.5px] border-[#204393] shadow-md scale-105'
                      : 'border-2 border-transparent opacity-65 hover:opacity-90 hover:border-slate-300/80 hover:shadow-sm',
                  )}
                  aria-label={`View image ${index + 1}`}
                  aria-pressed={index === activeIndex}
                >
                  <img
                    src={slide.image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
                    loading="lazy"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageSlideshow;

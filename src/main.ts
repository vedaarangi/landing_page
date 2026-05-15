import { bootstrapApplication } from '@angular/platform-browser';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { SocialGlassBarComponent } from './app/social-glass-bar.component';

type NavItem = {
  label: string;
  children?: string[];
};

type Metric = {
  value: number;
  label: string;
};

type Program = {
  icon: string[];
  title: string;
  text: string;
};

type IncubationProgram = {
  title: string;
  duration: string;
  selection: string;
  details: string;
  imageSrc?: string;
};

type EcosystemPartner = {
  name: string;
  logoSrc?: string;
  logoAlt?: string;
  initials?: string;
};

type EcosystemPartnerGroup = {
  category: string;
  partners: EcosystemPartner[];
};

type StartupCard = {
  logoSrc: string;
  alt: string;
  name: string;
  year: string;
  summary: string;
  raised: string;
  teamSize: string;
};

type Story = {
  name: string;
  role: string;
  video: string;
};

type Testimonial = {
  name: string;
  title: string;
  company: string;
  text: string;
  logoSrc?: string;
};

type EventCard = {
  imageSrc: string;
  imageAlt: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf, SocialGlassBarComponent],
  templateUrl: './app/app.html',
  styleUrl: './app/app.css'
})
class App implements AfterViewInit, OnDestroy {
  heroVideoSrc = 'https://res.cloudinary.com/dz1yfypyx/video/upload/f_mp4/1778867189233540_ewf2jd.mp4';

  @ViewChild('metricsSection') metricsSection?: ElementRef<HTMLElement>;
  @ViewChild('eventsSection') eventsSection?: ElementRef<HTMLElement>;
  @ViewChild('seedFundSection') seedFundSection?: ElementRef<HTMLElement>;
  @ViewChild('startupSection') startupSection?: ElementRef<HTMLElement>;
  @ViewChild('ecosystemSection') ecosystemSection?: ElementRef<HTMLElement>;
  @ViewChild('programsSection') programsSection?: ElementRef<HTMLElement>;
  @ViewChild('testimonialTrack') testimonialTrack?: ElementRef<HTMLElement>;
  @ViewChild('ecosystemCarousel') ecosystemCarousel?: ElementRef<HTMLElement>;
  @ViewChild('incubationCarousel') incubationCarousel?: ElementRef<HTMLElement>;
  private testimonialAutoplayTimer?: number;
  private testimonialMouseEnterHandler?: () => void;
  private testimonialMouseLeaveHandler?: () => void;
  currentTestimonialIndex = 0;

  activeStoryIndex = 1;
  isStoryMuted = true;
  animatedMetrics: number[] = [];
  slidesPerView = 5;
  hasMetricIntroStarted = false;
  isMetricCarouselRunning = false;
  isMetricCarouselPaused = false;
  isEventsSectionActive = false;
  isSeedFundSectionActive = false;
  isStartupPortfolioActive = false;
  isEcosystemSectionActive = false;
  isProgramsSectionActive = false;
  carouselOffset = 0;

  startupCards: StartupCard[] = [
    {
      logoSrc: 'startup-logos/agrosense-logo.png',
      alt: 'AgroSense AI logo',
      name: 'AgroSense AI',
      year: 'Since 2021',
      summary: 'AI-powered precision agriculture platform for smallholder farmers across AP.',
      raised: '₹3.2Cr',
      teamSize: '24',
    },
    {
      logoSrc: 'startup-logos/medi.png',
      alt: 'MediTrack360 logo',
      name: 'MediTrack360',
      year: 'Since 2022',
      summary: 'Digital health records and telemedicine for rural Andhra Pradesh.',
      raised: '₹1.8Cr',
      teamSize: '12',
    },
    {
      logoSrc: 'startup-logos/edunexa.png',
      alt: 'EduNexa logo',
      name: 'EduNexa',
      year: 'Since 2020',
      summary: 'Vernacular-first adaptive learning platform serving 1.2M students.',
      raised: '₹2.5Cr',
      teamSize: '31',
    },
    {
      logoSrc: 'startup-logos/grid.png',
      alt: 'GridFlow Energy logo',
      name: 'GridFlow Energy',
      year: 'Since 2019',
      summary: 'Smart microgrid management for industrial and commercial sectors.',
      raised: '₹5.1Cr',
      teamSize: '45',
    },
    {
      logoSrc: 'startup-logos/supply.png',
      alt: 'SupplyNest logo',
      name: 'SupplyNest',
      year: 'Since 2023',
      summary: 'B2B supply chain visibility platform for manufacturing SMEs.',
      raised: '₹90L',
      teamSize: '8',
    },
    {
      logoSrc: 'startup-logos/neuro.jpeg',
      alt: 'NeuroCraft logo',
      name: 'NeuroCraft',
      year: 'Since 2023',
      summary: 'Edge AI inference chips designed for IoT and autonomous systems.',
      raised: '₹45L',
      teamSize: '6',
    }
  ];

  get featuredStartupCards(): StartupCard[] {
    return this.startupCards.slice(0, 3);
  }

  private metricStartTimer?: number;
  private counterFrame?: number;
  private metricsObserver?: IntersectionObserver;
  private eventsObserver?: IntersectionObserver;
  private seedFundObserver?: IntersectionObserver;
  private startupObserver?: IntersectionObserver;
  private ecosystemObserver?: IntersectionObserver;
  private programsObserver?: IntersectionObserver;
  private hasAnimatedMetrics = false;
  private hasMetricsSectionLeftViewport = false;
  private isMetricCarouselReady = false;

  navItems: NavItem[] = [
    { label: 'Home' },
    { label: 'About RTIH' },
    { label: 'Programs & Events', children: ['Programs', 'Events', 'Hackthons and Challenges', 'Sunrise Connects'] },
    { label: 'Focus Segments' },
    { label: 'Locations', children: ['Amaravati Hub', 'Ananthapuramu', 'Rajamahendravaram', 'Tirupati', 'Vijayawada', 'Visakhapatnam'] },
    { label: 'Partners' },
    { label: "What’s New", children: ['AI Hackthons', 'Call for Mentors', 'Loan mela bankers connect'] },
    { label: 'Opportunities', children: ['Careers', 'Tenders'] }
  ];

  metrics: Metric[] = [
    { value: 250, label: 'Corporates' },
    { value: 2300, label: 'Startups' },
    { value: 80, label: 'Value Partners' },
    { value: 290, label: 'Mentors' },
    { value: 200, label: 'Investors' },
    { value: 90, label: 'Innovation Partners' }
  ];

  ongoingPrograms: IncubationProgram[] = [
    {
      title: 'SPARK',
      duration: '4–6 weeks',
      selection: 'Open application',
      details: 'A founder-first incubation entry point for early-stage ideas.',
      imageSrc: 'incubation/spark.jpg'
    },
    {
      title: 'FUTURE FOUNDERS',
      duration: '8 weeks',
      selection: 'Shortlisting + interview',
      details: 'Cohort-based mentorship and business validation for aspiring founders.',
      imageSrc: 'incubation/ff.png'
    },
    {
      title: 'CATALYST',
      duration: '3 months',
      selection: 'Pitch review',
      details: 'Growth-focused acceleration for product-led startups ready for go-to-market.',
      imageSrc: 'incubation/catalyst.jpg'
    },
    {
      title: 'VELOCITY LAB',
      duration: '4 months',
      selection: 'Demo day selection',
      details: 'Market traction support, investor readiness, and partner connect.',
      imageSrc: 'incubation/velocityLab.jpg'
    },
    {
      title: 'INNOTRIBE',
      duration: 'Ongoing student pathway',
      selection: 'Screening and mentoring',
      details: 'Student innovation support from exposure to venture formation and validation.',
      imageSrc: 'incubation/innotribe.jpg'
    },
    {
      title: 'AVGC XR INCUBATION PROGRAM',
      duration: '6 months',
      selection: 'Scrutiny-based selection',
      details: 'Specialized track for immersive media, AR/VR and interactive experiences.',
      imageSrc: 'incubation/avgc-xr-incubation.jpg'
    }
  ];

  pastPrograms: IncubationProgram[] = [
    {
      title: 'Student Entrepreneurship Programs',
      duration: 'Varied by year',
      selection: 'Open to enrolled students',
      details: 'From idea generation to prototype creation and venture development.',
      imageSrc: 'incubation/VIP.jpg'
    }
  ];

  events: EventCard[] = [
    {
      imageSrc: 'events/event1.jpg',
      imageAlt: 'Future Founders Summit event image'
    },
    {
      imageSrc: 'events/event2.jpg',
      imageAlt: 'Startup Connect 2.0 event image'
    },
    {
      imageSrc: 'events/event3.jpg',
      imageAlt: 'Innovation Bootcamp event image'
    },
    {
      imageSrc: 'events/event4.jpg',
      imageAlt: 'Investor Meet event image'
    },
    {
      imageSrc: 'events/event5.jpg',
      imageAlt: 'Event gallery image five'
    },
    {
      imageSrc: 'events/event6.jpg',
      imageAlt: 'Event gallery image six'
    },
    {
      imageSrc: 'events/event7.jpg',
      imageAlt: 'Event gallery image seven'
    }
  ];

  selectedProgramTab: 'ongoing' | 'past' = 'ongoing';

  get activePrograms(): IncubationProgram[] {
    return this.selectedProgramTab === 'ongoing' ? this.ongoingPrograms : this.pastPrograms;
  }

  selectProgramTab(tab: 'ongoing' | 'past'): void {
    this.selectedProgramTab = tab;
  }

  get metricLoop(): Metric[] {
    return [...this.metrics, ...this.metrics];
  }

  ecosystemPartnerGroups: EcosystemPartnerGroup[] = [
    {
      category: 'Academic Collaborator',
      partners: [
        {
          name: 'Ratan Tata Innovation Hub',
          logoSrc: 'rtih-logo.png',
          logoAlt: 'Ratan Tata Innovation Hub logo'
        }
      ]
    },
    {
      category: 'Industry Partners',
      partners: [
        { name: 'KIA', logoSrc: 'partner-logos/kia.png', logoAlt: 'KIA' },
        { name: 'LT', logoSrc: 'partner-logos/LT.png', logoAlt: 'LT' },
        { name: 'Medi360', logoSrc: 'partner-logos/medi.png', logoAlt: 'Medi360' },
        { name: 'MEIL', logoSrc: 'partner-logos/meil.png', logoAlt: 'MEIL' }
      ]
    },
    {
      category: 'Knowledge Partners',
      partners: [
        { name: 'IIT Madras', logoSrc: 'partner-logos/iit-chennai.png', logoAlt: 'IIT Madras' },
        { name: 'IIM Vizag', logoSrc: 'partner-logos/iim-vizag.png', logoAlt: 'IIM Vizag' },
        { name: 'IIPE Vizag', logoSrc: 'partner-logos/iipe-vizag.png', logoAlt: 'IIPE Vizag' },
        { name: 'BITS Pilani', logoSrc: 'partner-logos/bits-pilani.png', logoAlt: 'BITS Pilani' }
      ]
    },
    {
      category: 'Government Initiatives',
      partners: [
        {
          name: 'Government of Andhra Pradesh',
          logoSrc: 'ap-logo.webp',
          logoAlt: 'Government of Andhra Pradesh logo'
        }
      ]
    }
  ];

  get ecosystemPartners(): EcosystemPartner[] {
    return this.ecosystemPartnerGroups.flatMap((group) => group.partners);
  }

  scrollPartners(direction: number): void {
    const carousel = this.ecosystemCarousel?.nativeElement;
    if (!carousel) {
      return;
    }

    const viewportWidth = carousel.clientWidth;
    const firstCard = carousel.querySelector<HTMLElement>('.partner-logo');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 220;
    const scrollAmount = Math.max(cardWidth * 1.15, viewportWidth * 0.72);

    carousel.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }

  scrollIncubationPrograms(direction: number): void {
    const carousel = this.incubationCarousel?.nativeElement;
    if (!carousel) {
      return;
    }

    const viewportWidth = carousel.clientWidth;
    const firstCard = carousel.querySelector<HTMLElement>('.incubation-card');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 340;
    const scrollAmount = Math.max(cardWidth * 1.08, viewportWidth * 0.78);

    carousel.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }

  ngAfterViewInit(): void {
    this.animatedMetrics = this.metrics.map(() => 0);
    this.updateSlidesPerView();
    this.observeMetrics();
    this.observeEventsSection();
    this.observeSeedFundSection();
    this.observeProgramsSection();
    this.observeStartupPortfolio();
    this.observeEcosystemPartners();
    // delay autoplay to ensure ViewChild is ready
    setTimeout(() => this.startTestimonialAutoplay(), 300);
  }

  ngOnDestroy(): void {
    this.pauseMetricMovement();
    this.clearMetricStartTimer();
    this.metricsObserver?.disconnect();
    this.eventsObserver?.disconnect();
    this.seedFundObserver?.disconnect();
    this.programsObserver?.disconnect();
    this.startupObserver?.disconnect();
    this.ecosystemObserver?.disconnect();
    this.clearTestimonialAutoplay();

    if (this.testimonialTrack?.nativeElement) {
      const t = this.testimonialTrack.nativeElement;
      if (this.testimonialMouseEnterHandler) {
        t.removeEventListener('mouseenter', this.testimonialMouseEnterHandler);
      }
      if (this.testimonialMouseLeaveHandler) {
        t.removeEventListener('mouseleave', this.testimonialMouseLeaveHandler);
      }
    }

    if (this.counterFrame) {
      cancelAnimationFrame(this.counterFrame);
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateSlidesPerView();
  }

  pauseMetricCarousel(): void {
    this.isMetricCarouselPaused = true;
  }

  resumeMetricCarousel(): void {
    this.isMetricCarouselPaused = false;

    if (this.isMetricCarouselReady) {
      this.startMetricCarousel();
    }
  }

  programs: Program[] = [
    {
      icon: [
        'M4 21v-1.5A4.5 4.5 0 0 1 8.5 15H11',
        'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
        'M16 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6',
        'M14 21v-1a4 4 0 0 1 4-4h2',
        'M19 12h2',
        'M20 11v2'
      ],
      title: 'Expert Mentorship',
      text: 'Receive guidance from industry experts to sharpen strategy, improve operations, and make stronger founder decisions.'
    },
    {
      icon: [
        'M12 18V6',
        'M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8'
      ],
      title: 'Funding Opportunities',
      text: 'Get access to investor connects, grant pathways, startup schemes, and capital-readiness support for your growth stage.'
    },
    {
      icon: [
        'M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13',
        'm8 6 2-2',
        'm18 16 2-2',
        'm17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17',
        'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z',
        'm15 5 4 4'
      ],
      title: 'Prototyping Support',
      text: 'Use facilities, technical inputs, and validation support to develop proof-of-concepts and minimum viable products.'
    },
    {
      icon: [
        'M12 22s7-3 7-10V6l-7-3-7 3v6c0 7 7 10 7 10Z',
        'M9.2 11.8l1.9 1.9 3.8-4'
      ],
      title: 'Legal & Technical Resources',
      text: 'Benefit from legal, accounting, compliance, technology, and product partners that strengthen business capabilities.'
    },
    {
      icon: [
        'M4 8h16',
        'M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z',
        'M8 12h8',
        'M7 16h10'
      ],
      title: 'Networking Events',
      text: 'Join workshops, founder circles, partner sessions, and community events built for knowledge-sharing and collaboration.'
    },
    {
      icon: [
        'M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z',
        'M3 6h18',
        'M16 10a4 4 0 0 1-8 0'
      ],
      title: 'Market Access',
      text: 'Connect with customers, departments, corporates, and ecosystem stakeholders across a tourism-led innovation economy.'
    }
  ];

  stories: Story[] = [
    {
      name: 'Founder Name',
      role: 'Co-founder & Director, Startup Name',
      video: 'founder-catalyst.mp4'
    },
    {
      name: 'Aaradhya Rao',
      role: 'Founder & CEO, Venture Labs',
      video: 'founder-amaravati.mp4?v=20260512'
    },
    {
      name: 'Kiran Varma',
      role: 'Co-founder, Deeptech Works',
      video: 'founder-grassip.mp4'
    },
    {
      name: 'Meera Singh',
      role: 'Director, Growth Studio',
      video: 'founder-sunrise.mp4'
    }
  ];

  testimonials: Testimonial[] = [
    {
      name: 'Rakesh Mathur',
      title: 'Co-founder & CEO',
      company: 'Whiterabbit.ai',
      text: 'My thanks to Prof. Deepak Phatak, Director Prof. Ashok Misra and the incomparable Poyni Bhatt who played a super important role in our formative years. It is incredible to form a company inside the beautiful and inspiring IIT B.',
      logoSrc: 'partner-logos/100xvc.svg'
    },
    {
      name: 'Priya Sharma',
      title: 'Founder & Director',
      company: 'TechVenture Solutions',
      text: 'The ecosystem support and mentorship at RTIH was instrumental in scaling our operations. The access to investors and technical expertise accelerated our growth significantly.',
      logoSrc: 'partner-logos/sine-logo.svg'
    },
    {
      name: 'Ankit Patel',
      title: 'Co-founder',
      company: 'InnovateHub',
      text: 'RTIH provided the perfect launchpad for our startup. The collaborative environment and network connections have been invaluable for our market expansion.',
      logoSrc: 'partner-logos/venture-partners.svg'
    },
    {
      name: 'Neha Gupta',
      title: 'CEO & Founder',
      company: 'FutureTech Innovations',
      text: 'Being part of this incubation program transformed our business strategy. The resources, mentorship, and investor connections made all the difference.',
      logoSrc: 'partner-logos/startup-hub.svg'
    }
  ];

  get visibleTestimonials(): Testimonial[] {
    const prev = this.testimonials[(this.currentTestimonialIndex - 1 + this.testimonials.length) % this.testimonials.length];
    const current = this.testimonials[this.currentTestimonialIndex];
    const next = this.testimonials[(this.currentTestimonialIndex + 1) % this.testimonials.length];
    return [prev, current, next];
  }

  get activeStory(): Story {
    return this.stories[this.activeStoryIndex];
  }

  prepareStoryVideo(video: HTMLVideoElement): void {
    video.muted = this.isStoryMuted;
    video.volume = this.isStoryMuted ? 0 : 1;
    video.currentTime = 0;
    void video.play();
  }

  toggleStorySound(video: HTMLVideoElement): void {
    this.isStoryMuted = !this.isStoryMuted;
    video.muted = this.isStoryMuted;
    video.volume = this.isStoryMuted ? 0 : 1;
    void video.play();
  }

  prepareThumbnail(video: HTMLVideoElement): void {
    video.pause();
    video.muted = true;
    video.volume = 0;
    video.currentTime = Math.min(1, video.duration || 1);
  }

  showPreviousStory(video?: HTMLVideoElement): void {
    this.activeStoryIndex = (this.activeStoryIndex - 1 + this.stories.length) % this.stories.length;
    this.resetStoryVideo(video);
  }

  showNextStory(video?: HTMLVideoElement): void {
    this.activeStoryIndex = (this.activeStoryIndex + 1) % this.stories.length;
    this.resetStoryVideo(video);
  }

  selectStory(index: number, video?: HTMLVideoElement): void {
    this.activeStoryIndex = index;
    this.resetStoryVideo(video);
  }

  advanceStoryAfterTenSeconds(video: HTMLVideoElement): void {
    if (video.currentTime >= 10) {
      this.showNextStory(video);
    }
  }

  private resetStoryVideo(video?: HTMLVideoElement): void {
    if (!video) {
      return;
    }

    video.currentTime = 0;
    video.muted = this.isStoryMuted;
    video.volume = this.isStoryMuted ? 0 : 1;
    void video.play();
  }



  private startTestimonialAutoplay(): void {
    const el = this.testimonialTrack?.nativeElement;
    if (!el) {
      return;
    }

    this.clearTestimonialAutoplay();

    // pause on hover
    if (!this.testimonialMouseEnterHandler) {
      this.testimonialMouseEnterHandler = () => this.clearTestimonialAutoplay();
      this.testimonialMouseLeaveHandler = () => setTimeout(() => this.startTestimonialAutoplay(), 500);
      el.addEventListener('mouseenter', this.testimonialMouseEnterHandler);
      el.addEventListener('mouseleave', this.testimonialMouseLeaveHandler);
    }

    this.testimonialAutoplayTimer = window.setInterval(() => {
      const trackEl = this.testimonialTrack?.nativeElement;
      if (!trackEl) return;

      // Get card width
      const card = trackEl.querySelector('.testimonial-card') as HTMLElement | null;
      if (!card) return;

      const cardWidth = card.offsetWidth + 20; // width + gap
      const maxScroll = trackEl.scrollWidth - trackEl.clientWidth;
      const currentScroll = trackEl.scrollLeft;

      // If near the end, reset to beginning seamlessly
      if (currentScroll + cardWidth >= maxScroll) {
        // Disable smooth scroll temporarily for seamless reset
        trackEl.style.scrollBehavior = 'auto';
        trackEl.scrollLeft = 0;
        // Re-enable smooth scroll for next transitions
        setTimeout(() => {
          trackEl.style.scrollBehavior = 'smooth';
        }, 50);
      } else {
        trackEl.scrollLeft = currentScroll + cardWidth;
      }
    }, 2000);
  }
  private clearTestimonialAutoplay(): void {
    if (this.testimonialAutoplayTimer) {
      window.clearInterval(this.testimonialAutoplayTimer);
      this.testimonialAutoplayTimer = undefined;
    }
  }

  private startMetricCarousel(): void {
    if (!this.isMetricCarouselReady || this.isMetricCarouselPaused) {
      return;
    }

    this.isMetricCarouselRunning = true;
  }

  private pauseMetricMovement(): void {
    this.isMetricCarouselRunning = false;
  }

  private clearMetricStartTimer(): void {
    if (!this.metricStartTimer) {
      return;
    }

    window.clearTimeout(this.metricStartTimer);
    this.metricStartTimer = undefined;
  }

  private updateSlidesPerView(): void {
    const width = window.innerWidth;

    if (width < 576) {
      this.slidesPerView = 1;
      return;
    }

    if (width < 900) {
      this.slidesPerView = 3;
      return;
    }

    this.slidesPerView = 5;
  }

  private observeMetrics(): void {
    const section = this.metricsSection?.nativeElement;

    if (!section) {
      return;
    }

    this.metricsObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          this.hasMetricsSectionLeftViewport = true;
          continue;
        }

        if (this.hasMetricsSectionLeftViewport) {
          this.hasMetricIntroStarted = true;
          this.animateMetricCounters();
          this.metricsObserver?.disconnect();
          break;
        }
      }
    }, { threshold: 0.32 });

    this.metricsObserver.observe(section);
  }

  private observeEventsSection(): void {
    const section = this.eventsSection?.nativeElement;

    if (!section) {
      return;
    }

    this.eventsObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        this.isEventsSectionActive = entry.isIntersecting;
      }
    }, { threshold: 0.22 });

    this.eventsObserver.observe(section);
  }

  private observeSeedFundSection(): void {
    const section = this.seedFundSection?.nativeElement;

    if (!section) {
      return;
    }

    this.seedFundObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        this.isSeedFundSectionActive = entry.isIntersecting;
      }
    }, { threshold: 0.24 });

    this.seedFundObserver.observe(section);
  }

  private animateMetricCounters(): void {
    if (this.hasAnimatedMetrics) {
      return;
    }

    this.hasAnimatedMetrics = true;
    const duration = 2000;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      this.animatedMetrics = this.metrics.map((metric) => Math.floor(metric.value * easedProgress));

      if (progress < 1) {
        this.counterFrame = requestAnimationFrame(tick);
        return;
      }

      this.animatedMetrics = this.metrics.map((metric) => metric.value);
      this.counterFrame = undefined;
      this.metricStartTimer = window.setTimeout(() => {
        this.isMetricCarouselReady = true;
        this.startMetricCarousel();
      }, 0);
    };

    this.counterFrame = requestAnimationFrame(tick);
  }

  private observeStartupPortfolio(): void {
    const section = this.startupSection?.nativeElement;

    if (!section) {
      return;
    }

    this.startupObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        this.isStartupPortfolioActive = true;
        this.startupObserver?.disconnect();
      }
    }, { threshold: 0.22 });

    this.startupObserver.observe(section);
  }

  private observeEcosystemPartners(): void {
    const section = this.ecosystemSection?.nativeElement;

    if (!section) {
      return;
    }

    this.ecosystemObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        this.isEcosystemSectionActive = entry.isIntersecting;
      }
    }, { threshold: 0.22 });

    this.ecosystemObserver.observe(section);
  }

  private observeProgramsSection(): void {
    const section = this.programsSection?.nativeElement;

    if (!section) {
      return;
    }

    this.programsObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        this.isProgramsSectionActive = entry.isIntersecting;
      }
    }, { threshold: 0.22 });

    this.programsObserver.observe(section);
  }
}

bootstrapApplication(App).catch((err) => console.error(err));

import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

type NavItem = {
  label: string;
  children?: string[];
};

type Metric = {
  value: string;
  label: string;
};

type Program = {
  icon: string[];
  title: string;
  text: string;
};

type Story = {
  name: string;
  role: string;
  video: string;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './app/app.html',
  styleUrl: './app/app.css'
})
class App {
  activeStoryIndex = 1;
  isStoryMuted = true;

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
    { value: '90+', label: 'Innovation Partners' },
    { value: '250+', label: 'Corporate Connects' },
    { value: '2300+', label: 'Startups Supported' },
    { value: '80+', label: 'Value Partners' },
    { value: '290+', label: 'Mentors' }
  ];

  programs: Program[] = [
    {
      icon: [
        'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
        'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
        'M22 21v-2a4 4 0 0 0-3-3.87',
        'M16 3.13a4 4 0 0 1 0 7.75'
      ],
      title: 'Expert Mentorship',
      text: 'Receive guidance from industry experts to sharpen strategy, improve operations, and make stronger founder decisions.'
    },
    {
      icon: [
        'M12 3v18',
        'M17 7H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6',
        'M18 5a4 4 0 1 1 0 8',
        'M20 11a3 3 0 0 1 0 6'
      ],
      title: 'Funding Opportunities',
      text: 'Get access to investor connects, grant pathways, startup schemes, and capital-readiness support for your growth stage.'
    },
    {
      icon: [
        'M8 12h8',
        'M12 8v8',
        'M3 12h3l3-4 4 8 3-4h5',
        'M19 7l2 2-2 2',
        'M21 9h-5'
      ],
      title: 'Prototyping Support',
      text: 'Use facilities, technical inputs, and validation support to develop proof-of-concepts and minimum viable products.'
    },
    {
      icon: [
        'M14.7 6.3a1 1 0 0 0-1.4 0l-7 7a1 1 0 0 0 0 1.4l3 3a1 1 0 0 0 1.4 0l7-7a1 1 0 0 0 0-1.4z',
        'M8 12l4 4',
        'M3 21h18',
        'M12 3l9 9'
      ],
      title: 'Legal & Technical Resources',
      text: 'Benefit from legal, accounting, compliance, technology, and product partners that strengthen business capabilities.'
    },
    {
      icon: [
        'M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2',
        'M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
        'M19 8v6',
        'M22 11h-6'
      ],
      title: 'Networking Events',
      text: 'Join workshops, founder circles, partner sessions, and community events built for knowledge-sharing and collaboration.'
    },
    {
      icon: [
        'M3 21h18',
        'M7 17V9',
        'M12 17V5',
        'M17 17v-6',
        'M5 9l7-6 7 6'
      ],
      title: 'Market Access',
      text: 'Connect with customers, departments, corporates, and ecosystem stakeholders across a tourism-led innovation economy.'
    }
  ];

  stories: Story[] = [
    {
      name: 'Founder Name',
      role: 'Co-founder & Director, Startup Name',
      video: '/founder-catalyst.mp4'
    },
    {
      name: 'Aaradhya Rao',
      role: 'Founder & CEO, Venture Labs',
      video: '/founder-amaravati.mp4?v=20260512'
    },
    {
      name: 'Kiran Varma',
      role: 'Co-founder, Deeptech Works',
      video: '/founder-grassip.mp4'
    },
    {
      name: 'Meera Singh',
      role: 'Director, Growth Studio',
      video: '/founder-sunrise.mp4'
    }
  ];

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
}

bootstrapApplication(App).catch((err) => console.error(err));

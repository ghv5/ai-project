declare namespace Api {
  namespace Portal {
    type PlatformCode = 'annotate' | 'simulate';

    interface StatItem {
      label: string;
      value: string;
    }

    interface ServiceCenterItem {
      category: string;
      title: string;
      description: string;
      partnerNames: string[];
    }

    interface NewsItem {
      id: number;
      title: string;
      summary: string;
      publishDate?: string;
      highlight?: boolean;
    }

    interface HomeContent {
      heroTitle: string;
      heroSubtitle: string;
      stats: StatItem[];
      flowSteps: string[];
      services: ServiceCenterItem[];
      news: NewsItem[];
    }

    interface CaseItem {
      caseId?: number;
      title: string;
      description: string;
      coverUrl?: string;
      videoUrl?: string;
      tags?: string;
      industry?: string;
      scenario?: string;
      sortOrder?: number;
      pinned?: boolean;
      published?: boolean;
      publishTime?: string;
      updateTime?: string;
    }

    interface CaseSearchParams {
      keyword?: string | null;
      published?: '' | 'true' | 'false';
    }

    interface UserMapping {
      userId?: number;
      annotateAccount?: string;
      simulateAccount?: string;
      updatedAt?: string;
      updatedBy?: number;
    }

    interface TicketResponse {
      platform: PlatformCode;
      ticket: string;
      entryUrl: string;
      expireIn: number;
    }

    interface LogoutResponse {
      localLogout: boolean;
      successPlatforms: string[];
      failedPlatforms: string[];
    }
  }
}

import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { routing } from '~/lib/i18n/routing';
import PageLayout from '~/components/layout/pageLayout';

function OfflineFallback() {
  return (
    <PageLayout>
      <div className="flex h-[70vh] flex-col items-center justify-center p-4 text-center">
        <div className="bg-muted mb-6 h-10 w-48 animate-pulse rounded-full" aria-hidden />
        <div className="bg-muted mb-8 h-6 w-72 animate-pulse rounded-full" aria-hidden />
        <div className="bg-card border-border rounded-lg border p-4">
          <div className="bg-muted h-4 w-64 animate-pulse rounded-full" aria-hidden />
        </div>
      </div>
    </PageLayout>
  );
}

async function OfflineContent() {
  const t = await getTranslations('offline');

  return (
    <PageLayout>
      <div className="flex h-[70vh] flex-col items-center justify-center p-4 text-center">
        <h1 className="mb-6 text-4xl font-bold">{t('title')}</h1>
        <p className="mb-8 text-xl">{t('description')}</p>
        <div className="bg-card border-border rounded-lg border p-4">
          <p className="text-muted-foreground">{t('tips')}</p>
        </div>
      </div>
    </PageLayout>
  );
}

export default function OfflinePage() {
  return (
    <Suspense fallback={<OfflineFallback />}>
      {/* Async segment wrapped for Cache Components compatibility */}
      <OfflineContent />
    </Suspense>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

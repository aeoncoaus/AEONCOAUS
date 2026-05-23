import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { ReactNode } from 'react';
import Providers from './components/Providers';
import './globals.css';

const SITE_URL = 'https://aeonco.com.au';
const META_PIXEL_ID = '1401245241809373';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'AEON Longevity — Premium Peptides & Longevity Products',
    template: '%s | AEON Longevity',
  },
  description:
    'AEON Longevity — pharmaceutical-grade peptides, NAD+ protocols, and precision longevity interventions. Join the waitlist for early access.',
  alternates: { canonical: '/' },
  other: {
    'facebook-domain-verification': 'w0cc4ll1z10cbxnu3us96hflycdq97',
    'geo.region': 'AU',
    'geo.placename': 'Australia',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: 'AEON Longevity — Premium Peptides & Longevity Products',
    description:
      'Evidence-based peptides, NAD+ protocols, and precision longevity interventions. Join the waitlist for early access.',
    siteName: 'AEON Longevity',
    locale: 'en_AU',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AEON Longevity — Premium Peptides & Longevity Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AEON Longevity — Premium Peptides & Longevity Products',
    description: 'Evidence-based peptides, NAD+ protocols, and precision longevity interventions.',
    images: ['/og-image.jpg'],
  },
};

export const viewport: Viewport = {
  themeColor: '#E8E6E1',
  width: 'device-width',
  initialScale: 1,
};

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#org`,
      name: 'AEON Longevity',
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/apple-touch-icon.png`,
      description:
        'Premium peptides and longevity products. Evidence-based interventions for optimal human performance and healthspan.',
      email: 'hello@aeonco.com.au',
      areaServed: 'AU',
      sameAs: [
        'https://instagram.com/aeoncoaus',
        'https://facebook.com/aeoncoaus',
        'https://twitter.com/aeoncoaus',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: 'AEON Longevity',
      description: 'Premium peptides, NAD+ protocols, and precision longevity interventions.',
      publisher: { '@id': `${SITE_URL}/#org` },
      inLanguage: 'en-AU',
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/#webpage`,
      url: `${SITE_URL}/`,
      name: 'AEON Longevity — Premium Peptides & Longevity Products',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#org` },
      inLanguage: 'en-AU',
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-AU">
      <head>
        {/* Google Fonts — preconnect + stylesheet (mirrors existing pattern) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500&family=DM+Sans:wght@200;300;400;500;600&display=swap"
          rel="stylesheet"
        />

        {/* Structured data — JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />

        {/* Meta Pixel — load early, before hydration, like the original site */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

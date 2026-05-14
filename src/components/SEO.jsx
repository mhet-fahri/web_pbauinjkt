import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const SEO = ({ title, description, keywords, image, url }) => {
  const { t, i18n } = useTranslation();
  
  const siteName = t('site.name') || 'PBA UIN Jakarta';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = t('site.description') || 'Website Resmi Program Studi Pendidikan Bahasa Arab (PBA) FITK UIN Syarif Hidayatullah Jakarta.';
  const metaDescription = description || defaultDescription;
  const siteUrl = 'https://pbafitkuinjkt.id';
  const currentUrl = url ? `${siteUrl}${url}` : siteUrl;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      {image && <meta name="twitter:image" content={image} />}
      
      {/* Language Alternates */}
      <link rel="alternate" hrefLang="id" href={siteUrl} />
      <link rel="alternate" hrefLang="ar" href={`${siteUrl}/ar`} />
      <link rel="alternate" hrefLang="en" href={`${siteUrl}/en`} />
      <link rel="alternate" hrefLang="x-default" href={siteUrl} />
    </Helmet>
  );
};

export default SEO;

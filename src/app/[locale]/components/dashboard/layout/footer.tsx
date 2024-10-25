'use client';

import { useTranslation } from '@/app/i18n/client';
import { Namespaces } from '@/app/i18n/settings';
import { Divider, Link, Typography } from '@mui/material';
import RouterLink from 'next/link';
export default function Footer({ locale }: { locale: string }) {
  const { t } = useTranslation(locale, Namespaces.dashboard);
  return (
    <footer className="mt-10">
      <Divider className="mb-2" />
      <Typography variant="body2" className="text-gray-500">
        {t('common.forFurtherDetails.previous')}
        <Link
          target="_blank"
          component={RouterLink}
          href="https://github.com/zhou1323/chaiGO"
          variant="body2"
        >
          {t('common.forFurtherDetails.link')}
        </Link>
        {t('common.forFurtherDetails.orContact')}
        <Link href="mailto:chaigo.info@gmail.com" variant="body2">
          chaigo.info@gmail.com
        </Link>
        .
      </Typography>
    </footer>
  );
}

'use client';

import { Divider, Link, Typography } from '@mui/material';
import RouterLink from 'next/link';
export default function Footer() {
  return (
    <footer className="mt-10">
      <Divider className="mb-2" />
      <Typography variant="body2" className="text-gray-500">
        For further details, please visit this{' '}
        <Link
          target="_blank"
          component={RouterLink}
          href="https://github.com/zhou1323/chaiGO"
          variant="body2"
        >
          GitHub page
        </Link>{' '}
        or contact{' '}
        <Link href="mailto:chaigo.info@gmail.com" variant="body2">
          chaigo.info@gmail.com
        </Link>{' '}
        directly.
      </Typography>
    </footer>
  );
}

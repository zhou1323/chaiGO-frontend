'use client';

import SettingsPassword from '@/app/[locale]/components/dashboard/settings/settings-password';
import SettingsProfile from '@/app/[locale]/components/dashboard/settings/settings-profile';
import { Box, Stack, Tab, Tabs, Typography } from '@mui/material';
import * as React from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      className="w-full"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function SettingPage({
  params: { locale },
}: {
  params: { locale: string };
}): React.ReactNode {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Stack spacing={2} alignItems="start">
      <Stack direction="row">
        <Typography variant="h4" className="flex-auto font-bold">
          Settings
        </Typography>
      </Stack>
      <Box className="h-10 rounded-md bg-zinc-100 p-1">
        <Tabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ className: 'hidden' }}
        >
          {['Profile', 'Password'].map((label, index) => (
            <Tab
              key={index}
              label={label}
              disableRipple
              className={`min-h-8 min-w-20 rounded-sm px-3 py-1.5 text-sm font-semibold normal-case ${value === index ? 'bg-white text-[#09090b]' : 'bg-transparent text-[#71717a]'}`}
            />
          ))}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <SettingsProfile></SettingsProfile>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <SettingsPassword locale={locale}></SettingsPassword>
      </CustomTabPanel>
    </Stack>
  );
}

'use client';

import SettingsPassword from '@/components/dashboard/settings/settings-password';
import SettingsProfile from '@/components/dashboard/settings/settings-profile';
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
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function SettingPage() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row">
        <Typography variant="h4" className="flex-auto">
          Settings
        </Typography>
      </Stack>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Profile" />
            <Tab label="Password" />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <SettingsProfile></SettingsProfile>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <SettingsPassword></SettingsPassword>
        </CustomTabPanel>
      </Box>
    </Stack>
  );
}

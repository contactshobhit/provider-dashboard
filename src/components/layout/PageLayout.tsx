import React from 'react';
import Box from '@mui/material/Box';
import HeaderAppBar from '../HeaderAppBar';
import MainMenu from '../MainMenu';
import { MAIN_CONTENT_STYLES } from '../../constants/layout';

interface PageLayoutProps {
  children: React.ReactNode;
  sx?: object;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, sx }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <HeaderAppBar />
      <MainMenu />
      <Box
        component="main"
        sx={{
          ...MAIN_CONTENT_STYLES,
          ...sx,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default PageLayout;

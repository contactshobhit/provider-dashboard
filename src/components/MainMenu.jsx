import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import Button from '@mui/material/Button';
import { useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  { text: 'Dashboard', icon: <HomeOutlinedIcon />, path: '/dashboard' },
  { text: 'Search & Status', icon: <SearchOutlinedIcon />, path: '/pa/search' },
  { text: 'Support Chat', icon: <ChatBubbleOutlineRoundedIcon />, path: '/support/tickets' },
  { text: 'Peer-to-Peer Request', icon: <SupervisorAccountOutlinedIcon />, path: '/p2p/request' },
];

const drawerWidth = 240;

const MainMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <List>
        {/* Prominent Submit New PA Button */}
        <ListItem sx={{ justifyContent: 'center', py: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddBoxRoundedIcon />}
            fullWidth
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              boxShadow: 2,
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
            onClick={() => navigate('/pa/new')}
            aria-label="Submit New PA"
          >
            Submit New PA
          </Button>
        </ListItem>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={isActive}
                onClick={() => navigate(item.path)}
                sx={{
                  ...(isActive && {
                    bgcolor: 'action.selected',
                    fontWeight: 'bold',
                    borderLeft: 4,
                    borderColor: 'primary.main',
                    borderStyle: 'solid',
                    borderRadius: 0,
                  }),
                  pl: 3,
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default MainMenu;

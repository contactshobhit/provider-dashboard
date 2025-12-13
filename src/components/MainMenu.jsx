import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from '@mui/icons-material/Search';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  { text: 'Dashboard', icon: <HomeIcon />, path: '/dashboard' },
  { text: 'Submit New Prior Auth', icon: <AddBoxIcon />, path: '/pa/new' },
  { text: 'Search & Status', icon: <SearchIcon />, path: '/pa/search' },
  { text: 'Support Chat', icon: <ChatBubbleIcon />, path: '/support/tickets' },
  { text: 'Peer-to-Peer Request', icon: <SupervisorAccountIcon />, path: '/p2p/request' },
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
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              sx={location.pathname === item.path ? { bgcolor: 'action.selected', fontWeight: 'bold' } : {}}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default MainMenu;

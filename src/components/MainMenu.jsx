import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import Button from '@mui/material/Button';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import { useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  { text: 'Dashboard', icon: <HomeOutlinedIcon />, path: '/dashboard' },
  { text: 'PA Request Search & Status', icon: <SearchOutlinedIcon />, path: '/pa/search' },
  { text: 'Support Chat', icon: <ChatBubbleOutlineRoundedIcon />, path: '/support/tickets' },
  { text: 'Peer-to-Peer Request', icon: <SupervisorAccountOutlinedIcon />, path: '/pa/p2p' },
  { text: 'ADR Management', icon: <AssignmentTurnedInOutlinedIcon />, path: '/adr/management' },
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
            aria-label="Start PA Request"
          >
            START PA REQUEST
          </Button>
        </ListItem>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isPeerToPeer = item.text === 'Peer-to-Peer Request';
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
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={isPeerToPeer ? {
                    fontSize: 15,
                    noWrap: true,
                    sx: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 160 }
                  } : {}}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default MainMenu;

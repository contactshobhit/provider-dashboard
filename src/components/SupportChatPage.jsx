import React, { useState, useEffect } from 'react';
import HeaderAppBar from './HeaderAppBar';
import MainMenu from './MainMenu';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { fetchSupportTickets } from '../api/support';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';

const SupportChatPage = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSupportTickets()
      .then(res => {
        // Add mock conversation to the first ticket
        const mockMessages = [
          { sender: 'Provider', text: 'Hello, I need help with a claim.', time: '2025-12-12 09:00' },
          { sender: 'Support', text: 'Hi! Can you provide the claim number?', time: '2025-12-12 09:01' },
          { sender: 'Provider', text: 'It is CLM-123456.', time: '2025-12-12 09:02' },
          { sender: 'Support', text: 'Thank you. I am checking the details now.', time: '2025-12-12 09:03' },
          { sender: 'Provider', text: 'Thank you!', time: '2025-12-12 09:04' },
          { sender: 'Support', text: 'The claim is under review. We will update you soon.', time: '2025-12-12 09:05' },
        ];
        const ticketsWithMessages = res.tickets.map((t, i) => i === 0 ? { ...t, messages: mockMessages } : { ...t, messages: [] });
        setTickets(ticketsWithMessages);
        setSelectedTicket(ticketsWithMessages.length > 0 ? ticketsWithMessages[0] : null);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load tickets');
        setLoading(false);
      });
  }, []);

  const handleSend = () => {
    if (!message.trim() || !selectedTicket) return;
    setSelectedTicket((prev) => ({
      ...prev,
      messages: [...(prev.messages || []), { sender: 'Provider', text: message, time: new Date().toLocaleString() }],
    }));
    setMessage('');
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <HeaderAppBar />
      <MainMenu />
      <Box component="main" sx={{ flexGrow: 1, boxSizing: 'border-box', width: 'calc(100vw - 240px)', minWidth: 0, overflowX: 'auto', bgcolor: 'background.default', pl: '20px', pr: '20px', pt: 4, pb: 0, ml: '240px', marginLeft: 0, height: '100vh', display: 'flex', marginTop: '64px' }}>
        <Toolbar sx={{ minHeight: 48 }} />
        {/* Split Pane */}
        <Box sx={{ width: 350, minWidth: 350, maxWidth: 350, borderRight: 1, borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2, pb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Support Tickets
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} size="small" sx={{ minWidth: 0, px: 1.5, py: 0.5 }}>
              NEW TICKET
            </Button>
          </Stack>
          <Divider />
          <Box sx={{ px: 2, py: 1, display: 'flex', gap: 1 }}>
            <TextField
              size="small"
              placeholder="Search..."
              variant="outlined"
              sx={{ flex: 1 }}
              // value and onChange to be implemented
            />
            <TextField
              select
              size="small"
              label="Status"
              variant="outlined"
              sx={{ minWidth: 140 }}
              SelectProps={{ native: true }}
              // value and onChange to be implemented
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Awaiting Provider Response">Awaiting Provider Response</option>
            </TextField>
          </Box>
          <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {loading ? (
              <ListItem><ListItemText primary="Loading tickets..." /></ListItem>
            ) : error ? (
              <ListItem><ListItemText primary={error} /></ListItem>
            ) : tickets.length === 0 ? (
              <ListItem><ListItemText primary="No tickets found." /></ListItem>
            ) : (
              tickets.map((ticket) => {
                let chipColor = 'default';
                if (ticket.status === 'Pending') chipColor = 'info';
                else if (ticket.status === 'Resolved') chipColor = 'success';
                else if (ticket.status === 'Awaiting Provider Response') chipColor = 'warning';
                return (
                  <ListItem key={ticket.id} disablePadding>
                    <ListItemButton selected={selectedTicket && selectedTicket.id === ticket.id} onClick={() => setSelectedTicket({ ...ticket, messages: selectedTicket && selectedTicket.id === ticket.id ? selectedTicket.messages : [] })} alignItems="flex-start">
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 13 }}>
                          {ticket.id}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.5, fontSize: 15, color: 'text.primary' }} noWrap>
                          {ticket.subject}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                          <Chip label={ticket.status} color={chipColor} size="small" sx={{ fontWeight: 600, fontSize: 12 }} />
                          <Typography variant="caption" sx={{ color: 'text.disabled', ml: 1 }}>
                            {ticket.lastUpdate}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                );
              })
            )}
          </List>
        </Box>
        {/* Conversation Pane */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
          {/* Conversation Header */}
          {selectedTicket ? (
            <Card elevation={0} sx={{ borderRadius: 0, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', p: 0 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2, px: 3 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 13 }}>
                    {selectedTicket.id}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: 18 }}>
                    {selectedTicket.subject}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip label={selectedTicket.status} 
                    color={selectedTicket.status === 'Pending' ? 'info' : selectedTicket.status === 'Resolved' ? 'success' : selectedTicket.status === 'Awaiting Provider Response' ? 'warning' : 'default'}
                    size="small"
                    sx={{ fontWeight: 600, fontSize: 13 }}
                  />
                  {selectedTicket.status !== 'Resolved' && (
                    <Button variant="outlined" color="error" size="small">
                      CLOSE TICKET
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ p: 3 }}><Typography variant="h6">No ticket selected</Typography></Box>
          )}
          <Divider />
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
            {selectedTicket && selectedTicket.messages && selectedTicket.messages.length > 0 ? (
              selectedTicket.messages.map((msg, idx) => (
                <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'Provider' ? 'flex-end' : 'flex-start', width: '100%' }}>
                  <Paper
                    sx={{
                      p: 2,
                      mb: 2,
                      bgcolor: msg.sender === 'Provider' ? 'primary.lighter' : 'grey.100',
                      color: 'text.primary',
                      maxWidth: '70%',
                      borderRadius: 2,
                      boxShadow: 0,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, color: msg.sender === 'Provider' ? 'primary.dark' : 'grey.700' }}>{msg.sender}</Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>{msg.text}</Typography>
                    <Typography variant="caption" sx={{ mt: 1, color: 'text.disabled' }}>{msg.time}</Typography>
                  </Paper>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">No messages yet.</Typography>
            )}
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', alignItems: 'flex-end', p: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={6}
              placeholder="Type your message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              sx={{ mr: 1, background: 'white' }}
              InputProps={{ style: { fontSize: 16 } }}
            />
            <Button variant="text" color="primary" sx={{ minWidth: 0, p: 1 }}>
              <AttachFileIcon fontSize="small" />
            </Button>
            <Button variant="contained" color="primary" onClick={() => {
              if (!message.trim() || !selectedTicket) return;
              // Update ticket status to Pending and append message
              setSelectedTicket(prev => ({
                ...prev,
                status: 'Pending',
                messages: [...(prev.messages || []), { sender: 'Provider', text: message, time: new Date().toLocaleString() }],
              }));
              setTickets(ts => ts.map(t => t.id === selectedTicket.id ? {
                ...t,
                status: 'Pending',
                messages: [...(selectedTicket.messages || []), { sender: 'Provider', text: message, time: new Date().toLocaleString() }],
              } : t));
              setMessage('');
            }} disabled={!message.trim()} sx={{ ml: 1, px: 3, py: 1.2, fontWeight: 700, fontSize: 15 }}>
              SEND
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SupportChatPage;

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import NewTicketForm from './NewTicketForm';
import HeaderAppBar from './HeaderAppBar';
import MainMenu from './MainMenu';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { fetchSupportTickets } from '../api/support';
import { createSupportTicket } from '../api/supportTicketsApi';
import { fetchSupportTicketMessages } from '../api/supportTicketMessagesApi';
import Snackbar from '@mui/material/Snackbar';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import { SupportTicket, SupportMessage, CreateTicketRequest, TicketStatus } from '../types';

const getChipColor = (status: TicketStatus): 'info' | 'success' | 'warning' | 'default' => {
  if (status === 'Pending') return 'info';
  if (status === 'Resolved') return 'success';
  if (status === 'Awaiting Provider Response') return 'warning';
  return 'default';
};

const SupportChatPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilterType = searchParams.get('filterType') || '';
  const [ticketTypeFilter, setTicketTypeFilter] = useState<string>(initialFilterType);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [newTicketOpen, setNewTicketOpen] = useState<boolean>(false);
  const [newTicketLoading, setNewTicketLoading] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: '' });

  useEffect(() => {
    fetchSupportTickets()
      .then(async (res) => {
        const ticketsWithMessages = await Promise.all(
          res.tickets.map(async (t: SupportTicket) => {
            const messages = await fetchSupportTicketMessages(t.id);
            return { ...t, messages };
          })
        );
        setTickets(ticketsWithMessages);
        if (ticketTypeFilter) {
          const filtered = ticketsWithMessages.filter((t) =>
            (t.type || t.subject || '').toLowerCase().includes(ticketTypeFilter.toLowerCase())
          );
          setSelectedTicket(filtered.length > 0 ? filtered[0] ?? null : null);
        } else {
          setSelectedTicket(ticketsWithMessages.length > 0 ? ticketsWithMessages[0] ?? null : null);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load tickets');
        setLoading(false);
      });
  }, [ticketTypeFilter]);

  const handleSubmitTicket = async (ticket: CreateTicketRequest): Promise<void> => {
    setNewTicketLoading(true);
    try {
      const res = await createSupportTicket(ticket);
      if (res.success) {
        setTickets((ts) => [res.ticket, ...ts]);
        setSelectedTicket(res.ticket);
        setSnackbar({ open: true, message: `Ticket ${res.ticket.id} created successfully.` });
        setNewTicketOpen(false);
      }
    } finally {
      setNewTicketLoading(false);
    }
  };

  const handleSendMessage = (): void => {
    if (!message.trim() || !selectedTicket) return;
    const newMessage: SupportMessage = {
      sender: 'Provider',
      text: message,
      time: new Date().toLocaleString(),
    };
    setSelectedTicket((prev) =>
      prev
        ? {
            ...prev,
            status: 'Pending' as TicketStatus,
            messages: [...(prev.messages || []), newMessage],
          }
        : null
    );
    setTickets((ts) =>
      ts.map((t) =>
        t.id === selectedTicket.id
          ? {
              ...t,
              status: 'Pending' as TicketStatus,
              messages: [...(selectedTicket.messages || []), newMessage],
            }
          : t
      )
    );
    setMessage('');
  };

  const filteredTickets = tickets.filter(
    (ticket) =>
      !ticketTypeFilter || (ticket.type || ticket.subject || '').toLowerCase().includes(ticketTypeFilter.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <HeaderAppBar />
      <MainMenu />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          boxSizing: 'border-box',
          width: 'calc(100vw - 240px)',
          minWidth: 0,
          overflowX: 'auto',
          bgcolor: 'background.default',
          pl: '20px',
          pr: '20px',
          pt: 4,
          pb: 0,
          ml: '240px',
          marginLeft: 0,
          height: '100vh',
          display: 'flex',
          marginTop: '64px',
        }}
      >
        <Toolbar sx={{ minHeight: 48 }} />
        {/* Split Pane */}
        <Box
          sx={{
            width: 300,
            minWidth: 300,
            maxWidth: 300,
            borderRight: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 64px)',
            position: 'relative',
          }}
        >
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2, pb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Support Tickets
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="small"
              sx={{ minWidth: 0, px: 1.5, py: 0.5 }}
              onClick={() => setNewTicketOpen(true)}
            >
              NEW TICKET
            </Button>
            <NewTicketForm
              open={newTicketOpen}
              onClose={() => setNewTicketOpen(false)}
              paOptions={[]}
              loading={newTicketLoading}
              onSubmit={handleSubmitTicket}
            />
            <Snackbar
              open={snackbar.open}
              autoHideDuration={4000}
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              message={snackbar.message}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
          </Stack>
          <Divider />
          <Box sx={{ px: 2, py: 1, display: 'flex', gap: 1, width: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
              <TextField size="small" placeholder="Search..." variant="outlined" fullWidth />
              <TextField
                select
                size="small"
                label="Status"
                variant="outlined"
                fullWidth
                sx={{ minWidth: 180, maxWidth: '100%' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value || '')}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (selected) => (selected ? (selected as string) : 'All'),
                }}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="Awaiting Provider Response">Awaiting Provider Response</MenuItem>
              </TextField>
            </Box>
          </Box>
          {ticketTypeFilter && (
            <Box sx={{ px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={`Showing: ${ticketTypeFilter} Tickets`}
                color="primary"
                onDelete={() => {
                  setSearchParams({});
                  setTicketTypeFilter('');
                }}
                sx={{ fontWeight: 600 }}
              />
              <Button
                size="small"
                onClick={() => {
                  setSearchParams({});
                  setTicketTypeFilter('');
                }}
              >
                Clear Filter
              </Button>
            </Box>
          )}
          <List sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: 'background.paper', minHeight: 0 }}>
            {loading ? (
              <ListItem>
                <Typography>Loading tickets...</Typography>
              </ListItem>
            ) : error ? (
              <ListItem>
                <Typography>{error}</Typography>
              </ListItem>
            ) : filteredTickets.length === 0 ? (
              <ListItem>
                <Typography>No tickets found.</Typography>
              </ListItem>
            ) : (
              filteredTickets.map((ticket) => (
                <ListItem key={ticket.id} disablePadding>
                  <ListItemButton
                    selected={selectedTicket?.id === ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    alignItems="flex-start"
                  >
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', fontSize: 13 }}>
                        {ticket.id}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 500, mb: 0.5, fontSize: 15, color: 'text.primary' }}
                        noWrap
                      >
                        {ticket.subject}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip
                          label={ticket.status}
                          color={getChipColor(ticket.status)}
                          size="small"
                          sx={{ fontWeight: 600, fontSize: 12 }}
                        />
                        <Typography variant="caption" sx={{ color: 'text.disabled', ml: 1 }}>
                          {ticket.lastUpdate}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))
            )}
          </List>
        </Box>
        {/* Conversation Pane */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            height: 'calc(100vh - 64px)',
            position: 'relative',
            bgcolor: '#f8fafc',
          }}
        >
          {selectedTicket ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 3,
                py: 2,
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                minHeight: 72,
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'primary.main', fontSize: 16, mb: 0.5 }}>
                  {selectedTicket.id}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.primary', fontSize: 16 }}>
                  {selectedTicket.subject}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip
                  label={selectedTicket.status}
                  color={getChipColor(selectedTicket.status)}
                  size="small"
                  sx={{ fontWeight: 600, fontSize: 13 }}
                />
                {selectedTicket.status !== 'Resolved' && (
                  <Button variant="outlined" color="error" size="small">
                    CLOSE TICKET
                  </Button>
                )}
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              <Typography variant="h6">No ticket selected</Typography>
            </Box>
          )}
          {/* Message History */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              px: 3,
              pt: 2,
              pb: 0,
              bgcolor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
              boxSizing: 'border-box',
              paddingBottom: '92px',
            }}
          >
            {selectedTicket?.messages && selectedTicket.messages.length > 0 ? (
              selectedTicket.messages.map((msg, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: msg.sender === 'Provider' ? 'flex-end' : 'flex-start',
                    width: '100%',
                  }}
                >
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
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: msg.sender === 'Provider' ? 'primary.dark' : 'grey.700' }}
                    >
                      {msg.sender}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {msg.text}
                    </Typography>
                    <Typography variant="caption" sx={{ mt: 1, color: 'text.disabled' }}>
                      {msg.time}
                    </Typography>
                  </Paper>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No messages yet.
              </Typography>
            )}
          </Box>
          {/* Message Composer */}
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'background.paper',
              borderTop: 1,
              borderColor: 'divider',
              px: 3,
              py: 2,
              display: 'flex',
              alignItems: 'flex-end',
              gap: 1,
              zIndex: 2,
              minHeight: 76,
            }}
          >
            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={6}
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ background: 'white', borderRadius: 1, mr: 1 }}
              InputProps={{ style: { fontSize: 16 } }}
            />
            <Button variant="text" color="primary" sx={{ minWidth: 0, p: 1 }}>
              <AttachFileIcon fontSize="small" />
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSendMessage}
              disabled={!message.trim()}
              sx={{ ml: 1, px: 3, py: 1.2, fontWeight: 700, fontSize: 15, minWidth: 100 }}
            >
              SEND
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SupportChatPage;

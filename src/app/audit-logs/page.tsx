'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import { AuditEvent } from '@/types/audit.types';
import { getAllEvents, clearAllEvents } from '@/utils/auditStorage';

const EVENT_COLORS: Record<string, 'error' | 'warning' | 'info' | 'success' | 'default'> = {
  COPY_ATTEMPT: 'error',
  PASTE_ATTEMPT: 'error',
  CUT_ATTEMPT: 'error',
  RIGHT_CLICK_ATTEMPT: 'warning',
  TAB_BLUR: 'warning',
  TAB_FOCUS: 'info',
  WINDOW_BLUR: 'warning',
  WINDOW_FOCUS: 'info',
  FULLSCREEN_ENTER: 'success',
  FULLSCREEN_EXIT: 'error',
  HEARTBEAT: 'default',
  TIME_EXPIRED: 'error',
  PAGE_REFRESH: 'warning',
  TEST_START: 'success',
  TEST_SUBMIT: 'success',
};

export default function AuditLogsPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    const allEvents = await getAllEvents();
    setEvents(allEvents.sort((a, b) => b.timestamp - a.timestamp));
    setLoading(false);
  }, []);

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to clear all event logs?')) {
      await clearAllEvents();
      setEvents([]);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const suspiciousEvents = events.filter(e => 
    ['COPY_ATTEMPT', 'PASTE_ATTEMPT', 'CUT_ATTEMPT', 'RIGHT_CLICK_ATTEMPT', 'FULLSCREEN_EXIT', 'TAB_BLUR'].includes(e.type)
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold">
                📋 Audit Event Logs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete audit trail of candidate behavior during assessment
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<PlayArrowIcon />}
                href="/"
              >
                Take Assessment
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={loadEvents}
                disabled={loading}
              >
                Refresh
              </Button>
              <Tooltip title="Clear all logs">
                <IconButton
                  color="error"
                  onClick={handleClearAll}
                  disabled={events.length === 0}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Paper elevation={2} sx={{ p: 2, flex: 1, textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">{events.length}</Typography>
              <Typography variant="body2" color="text.secondary">Total Events</Typography>
            </Paper>
            <Paper elevation={2} sx={{ p: 2, flex: 1, textAlign: 'center' }}>
              <Typography variant="h4" color="error.main" fontWeight="bold">{suspiciousEvents.length}</Typography>
              <Typography variant="body2" color="text.secondary">Suspicious Events</Typography>
            </Paper>
            <Paper elevation={2} sx={{ p: 2, flex: 1, textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {events.filter(e => e.type === 'TEST_SUBMIT').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Submissions</Typography>
            </Paper>
          </Box>

          {suspiciousEvents.length > 0 && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <strong>{suspiciousEvents.length} suspicious events detected:</strong> {' '}
              {suspiciousEvents.filter(e => e.type === 'COPY_ATTEMPT').length} copy attempts, {' '}
              {suspiciousEvents.filter(e => e.type === 'PASTE_ATTEMPT').length} paste attempts, {' '}
              {suspiciousEvents.filter(e => e.type === 'RIGHT_CLICK_ATTEMPT').length} right-click attempts, {' '}
              {suspiciousEvents.filter(e => e.type === 'TAB_BLUR').length} tab switches
            </Alert>
          )}

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell><strong>Time</strong></TableCell>
                  <TableCell><strong>Event Type</strong></TableCell>
                  <TableCell><strong>Attempt ID</strong></TableCell>
                  <TableCell><strong>User ID</strong></TableCell>
                  <TableCell><strong>Question</strong></TableCell>
                  <TableCell><strong>Browser</strong></TableCell>
                  <TableCell><strong>Synced</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No events logged yet. Take an assessment to see events here.
                      </Typography>
                      <Button href="/" variant="contained" sx={{ mt: 2 }}>
                        Start Assessment
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  events.map((event) => (
                    <TableRow 
                      key={event.id} 
                      hover
                      sx={{ 
                        bgcolor: ['COPY_ATTEMPT', 'PASTE_ATTEMPT', 'CUT_ATTEMPT', 'RIGHT_CLICK_ATTEMPT'].includes(event.type) 
                          ? 'error.50' 
                          : 'inherit' 
                      }}
                    >
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                        {formatDate(event.timestamp)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={event.type}
                          size="small"
                          color={EVENT_COLORS[event.type] || 'default'}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        {event.attemptId.substring(0, 16)}...
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>
                        {event.userId}
                      </TableCell>
                      <TableCell>
                        {event.questionId || '-'}
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.85rem' }}>
                        {event.metadata.browser}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={event.synced ? 'Yes' : 'No'}
                          size="small"
                          color={event.synced ? 'success' : 'warning'}
                          variant="filled"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary">
              <strong>Event Schema:</strong> Each event contains type, timestamp, attemptId, questionId (if applicable), 
              and metadata (browser, focus state, fullscreen status). Logs are persisted locally in IndexedDB 
              and synced to backend every 30 seconds.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

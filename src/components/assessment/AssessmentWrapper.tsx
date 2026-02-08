'use client';

import React, { useState, useCallback } from 'react';
import { Snackbar, Alert, Box, Button, Typography, Paper } from '@mui/material';
import { FullscreenExit as FullscreenExitIcon, Timer as TimerIcon } from '@mui/icons-material';

import { useEventLogger } from '@/hooks/useEventLogger';
import { useAntiCheat } from '@/hooks/useAntiCheat';
import { useFullscreenGuard } from '@/hooks/useFullscreenGuard';
import { useAssessmentTimer } from '@/hooks/useAssessmentTimer';
import { AssessmentConfig, AuditEventType } from '@/types/audit.types';

interface AssessmentWrapperProps {
  config: AssessmentConfig;
  currentQuestionId?: string;
  onSubmit: () => void;
  children: React.ReactNode;
}

interface ToastState {
  open: boolean;
  message: string;
  severity: 'warning' | 'error' | 'info';
}

export function AssessmentWrapper({
  config,
  currentQuestionId,
  onSubmit,
  children,
}: AssessmentWrapperProps) {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'warning',
  });
  const [hasStarted, setHasStarted] = useState(false);

  const showWarning = useCallback((message: string) => {
    setToast({ open: true, message, severity: 'warning' });
  }, []);

  const { logEvent, syncEvents } = useEventLogger({
    config,
    currentQuestionId,
  });

  const handleLogEvent = useCallback((type: AuditEventType, extra?: Record<string, unknown>) => {
    logEvent(type, extra);
  }, [logEvent]);

  useAntiCheat({
    onLog: handleLogEvent,
    onWarning: showWarning,
    enabled: hasStarted,
  });

  const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreenGuard({
    onLog: handleLogEvent,
    onWarning: showWarning,
    enabled: hasStarted,
  });

  const handleTimeExpired = useCallback(async () => {
    await syncEvents();
    onSubmit();
  }, [syncEvents, onSubmit]);

  const { formattedTime, remainingTime, start: startTimer, hasExpired } = useAssessmentTimer({
    duration: config.duration,
    onLog: handleLogEvent,
    onTimeExpired: handleTimeExpired,
    heartbeatInterval: config.heartbeatInterval || 60,
    autoStart: false,
  });

  const handleStart = useCallback(async () => {
    await enterFullscreen();
    await logEvent('TEST_START');
    setHasStarted(true);
    startTimer();
  }, [enterFullscreen, logEvent, startTimer]);

  const handleSubmit = useCallback(async () => {
    await logEvent('TEST_SUBMIT');
    await syncEvents();
    await exitFullscreen();
    onSubmit();
  }, [logEvent, syncEvents, exitFullscreen, onSubmit]);

  const handleCloseToast = () => {
    setToast(prev => ({ ...prev, open: false }));
  };

  if (!hasStarted) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          p: 3,
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: 5,
            maxWidth: 500,
            textAlign: 'center',
            borderRadius: 3,
          }}
        >
          <TimerIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Ready to Begin?
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            This assessment will run in fullscreen mode. You have{' '}
            <strong>{Math.floor(config.duration / 60)} minutes</strong> to complete it.
          </Typography>
          
          <Box sx={{ mb: 3, p: 2, bgcolor: 'warning.light', borderRadius: 2 }}>
            <Typography variant="body2" color="warning.dark">
              ⚠️ The following actions are monitored:
              <br />• Copy, paste, cut attempts
              <br />• Tab switching
              <br />• Fullscreen exit
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={handleStart}
            sx={{
              px: 5,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
            }}
          >
            Start Assessment
          </Button>
        </Paper>
      </Box>
    );
  }

  const showFullscreenWarning = !isFullscreen && hasStarted;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="protected-content">
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          bgcolor: remainingTime < 300 ? 'error.dark' : 'primary.dark',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          zIndex: 1000,
          transition: 'background-color 0.3s',
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Assessment in Progress
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimerIcon />
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{
                fontFamily: 'monospace',
                animation: remainingTime < 60 ? 'pulse 1s infinite' : 'none',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                },
              }}
            >
              {formattedTime}
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            disabled={hasExpired}
          >
            Submit Test
          </Button>
        </Box>
      </Box>

      {showFullscreenWarning && (
        <Box
          sx={{
            position: 'fixed',
            top: 60,
            left: 0,
            right: 0,
            bgcolor: 'error.main',
            color: 'white',
            py: 1,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            zIndex: 999,
          }}
        >
          <FullscreenExitIcon />
          <Typography>Fullscreen mode exited. Please return to fullscreen.</Typography>
          <Button
            variant="contained"
            size="small"
            color="warning"
            onClick={enterFullscreen}
          >
            Re-enter Fullscreen
          </Button>
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
          mt: showFullscreenWarning ? '100px' : '60px',
          p: 3,
        }}
      >
        {children}
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

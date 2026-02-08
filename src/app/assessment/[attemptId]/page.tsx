'use client';

import React, { useState, useCallback, use } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
} from '@mui/material';
import { AssessmentWrapper } from '@/components/assessment/AssessmentWrapper';
import { AssessmentConfig } from '@/types/audit.types';

const SAMPLE_QUESTIONS = [
  {
    id: 'q1',
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctAnswer: 1,
  },
  {
    id: 'q2',
    question: 'Which data structure uses LIFO (Last In First Out) principle?',
    options: ['Queue', 'Stack', 'Array', 'Linked List'],
    correctAnswer: 1,
  },
  {
    id: 'q3',
    question: 'What is the purpose of the "virtual" keyword in C++?',
    options: [
      'Memory optimization',
      'Enable polymorphism',
      'Faster execution',
      'Static typing',
    ],
    correctAnswer: 1,
  },
  {
    id: 'q4',
    question: 'Which sorting algorithm has the best average case time complexity?',
    options: ['Bubble Sort', 'Quick Sort', 'Selection Sort', 'Insertion Sort'],
    correctAnswer: 1,
  },
  {
    id: 'q5',
    question: 'What does REST stand for?',
    options: [
      'Rapid Enterprise Software Technology',
      'Representational State Transfer',
      'Remote Execution Service Transfer',
      'Real-time Event Stream Technology',
    ],
    correctAnswer: 1,
  },
];

interface PageParams {
  attemptId: string;
}

export default function AssessmentPage({
  params: paramsPromise,
}: {
  params: Promise<PageParams>;
}) {
  const params = use(paramsPromise);
  const { attemptId } = params;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const config: AssessmentConfig = {
    attemptId,
    userId: 'demo-user-123',
    duration: 30 * 60,
    heartbeatInterval: 60,
    syncInterval: 30,
  };

  const handleAnswerChange = useCallback((questionId: string, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentQuestion < SAMPLE_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  }, [currentQuestion]);

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  }, [currentQuestion]);

  const handleSubmit = useCallback(() => {
    setIsSubmitted(true);
  }, []);

  if (isSubmitted) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        }}
      >
        <Paper elevation={8} sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h3" fontWeight="bold" color="success.main" gutterBottom>
            ✓ Assessment Submitted
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Your responses have been recorded.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Attempt ID: {attemptId}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            href="/"
          >
            Return Home
          </Button>
        </Paper>
      </Box>
    );
  }

  const currentQ = SAMPLE_QUESTIONS[currentQuestion];

  return (
    <AssessmentWrapper
      config={config}
      currentQuestionId={currentQ.id}
      onSubmit={handleSubmit}
    >
      <Container maxWidth="md">
        <Stepper
          activeStep={currentQuestion}
          sx={{ mb: 4 }}
          alternativeLabel
        >
          {SAMPLE_QUESTIONS.map((q, idx) => (
            <Step key={q.id} completed={answers[q.id] !== undefined}>
              <StepLabel
                onClick={() => setCurrentQuestion(idx)}
                sx={{ cursor: 'pointer' }}
              >
                Q{idx + 1}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Card elevation={4} sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="overline"
              color="primary"
              fontWeight="bold"
              sx={{ mb: 1, display: 'block' }}
            >
              Question {currentQuestion + 1} of {SAMPLE_QUESTIONS.length}
            </Typography>

            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <FormLabel
                component="legend"
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'text.primary',
                  mb: 3,
                }}
              >
                {currentQ.question}
              </FormLabel>

              <RadioGroup
                value={answers[currentQ.id] ?? ''}
                onChange={(e) => handleAnswerChange(currentQ.id, parseInt(e.target.value))}
              >
                {currentQ.options.map((option, idx) => (
                  <Paper
                    key={idx}
                    elevation={answers[currentQ.id] === idx ? 4 : 1}
                    sx={{
                      mb: 1.5,
                      p: 1,
                      borderRadius: 2,
                      border: answers[currentQ.id] === idx ? 2 : 1,
                      borderColor: answers[currentQ.id] === idx ? 'primary.main' : 'divider',
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.light',
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <FormControlLabel
                      value={idx}
                      control={<Radio />}
                      label={option}
                      sx={{ width: '100%', m: 0, py: 0.5 }}
                    />
                  </Paper>
                ))}
              </RadioGroup>
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>

              {currentQuestion < SAMPLE_QUESTIONS.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSubmit}
                >
                  Submit Assessment
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {Object.keys(answers).length} of {SAMPLE_QUESTIONS.length} questions answered
          </Typography>
        </Box>
      </Container>
    </AssessmentWrapper>
  );
}

// features/components/PredictionForm/steps/SubmissionPreviewStep.tsx
import React from 'react';
import { Box, Typography, Card, CardContent, Chip, Paper, LinearProgress } from '@mui/material';

import {
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  SportsSoccer as SportsSoccerIcon,
  Schedule as ScheduleIcon,
  Insights as InsightsIcon,
  Star as StarIcon,
  Info as InfoIcon,
  Label as LabelIcon,
  Public as PublicIcon,
  CheckCircle as CheckCircleIcon,
  Description as DescriptionIcon,
  PointOfSaleRounded as TargetIcon,
} from '@mui/icons-material';

import { Fixture } from '@/features/predictions';

interface SubmissionPreviewStepProps {
  fixture: Fixture | null;
  isPremium: boolean;
  analysis: string;
  accuracy: number;
  picks: Array<{
    market: string;
    selectionKey: string;
    selectionLabel: string;
    confidence: number;
  }>;
  // Removed: fixtureFromDate: Date | null;
}

// Helper functions for confidence levels
const getConfidenceMuiColor = (accuracy: number): 'success' | 'warning' | 'error' => {
  if (accuracy >= 80) return 'success';
  if (accuracy >= 60) return 'warning';
  return 'error';
};

const getConfidenceHexColor = (accuracy: number): string => {
  if (accuracy >= 80) return '#10b981';
  if (accuracy >= 60) return '#f59e0b';
  return '#ef4444';
};

const getAccuracyLevel = (accuracy: number) => {
  if (accuracy >= 80) return 'High Confidence';
  if (accuracy >= 60) return 'Moderate Confidence';
  return 'Low Confidence';
};

export const SubmissionPreviewStep: React.FC<SubmissionPreviewStepProps> = ({
  fixture,
  isPremium,
  analysis,
  accuracy,
  picks,
}) => {
  const formatKickoffTime = (kickoffUtc: string) => {
    const date = new Date(kickoffUtc);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
      }),
    };
  };

  const kickoffInfo = fixture?.kickoffUtc ? formatKickoffTime(fixture.kickoffUtc) : null;

  return (
    <Box className="">
      <div className="flex flex-col space-y-12">
        {/* Match & Analysis */}
        <div className="flex-1 space-y-6">
          {/* Match Details Card */}
          <Card
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              background: 'linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%)',
              position: 'relative',
              overflow: 'visible',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
              },
              '&:hover': {
                boxShadow: '0 8px 32px rgba(79, 70, 229, 0.08)',
                borderColor: 'rgba(79, 70, 229, 0.2)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              {/* Header with icon and gradient background */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 3,
                  pb: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                  }}
                >
                  <SportsSoccerIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Match Details
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                  >
                    <InfoIcon sx={{ fontSize: 14 }} />
                    Complete match information
                  </Typography>
                </Box>
              </Box>

              {/* Content Section */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Fixture Section */}
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <LabelIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      sx={{
                        letterSpacing: '0.5px',
                        color: 'primary.main',
                        textTransform: 'uppercase',
                      }}
                    >
                      Fixture
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    sx={{
                      pl: 3,
                      py: 1.5,
                      backgroundColor: 'rgba(79, 70, 229, 0.05)',
                      borderRadius: 2,
                      borderLeft: '3px solid',
                      borderColor: 'primary.main',
                    }}
                  >
                    {fixture
                      ? `${fixture.home} vs ${fixture.away} - ${fixture.league}`
                      : 'No fixture selected'}
                  </Typography>
                </Box>

                {/* Kickoff Time Section */}
                {kickoffInfo && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        backgroundColor: 'rgba(124, 58, 237, 0.1)',
                        color: 'primary.main',
                      }}
                    >
                      <ScheduleIcon sx={{ fontSize: 24 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                        Match Kickoff
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          mt: 0.5,
                        }}
                      >
                        <Typography variant="body2" fontWeight={500}>
                          {kickoffInfo.date}
                        </Typography>
                        <Chip
                          label={kickoffInfo.time}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(79, 70, 229, 0.1)',
                            color: 'primary.main',
                            fontWeight: 600,
                            '& .MuiChip-label': {
                              px: 1.5,
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                )}

                {/* Prediction Type Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      backgroundColor: isPremium
                        ? 'rgba(255, 193, 7, 0.1)'
                        : 'rgba(76, 175, 80, 0.1)',
                      color: isPremium ? 'warning.main' : 'success.main',
                    }}
                  >
                    {isPremium ? (
                      <StarIcon sx={{ fontSize: 24 }} />
                    ) : (
                      <PublicIcon sx={{ fontSize: 24 }} />
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                      Audience Type
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        mt: 0.5,
                      }}
                    >
                      <Chip
                        icon={isPremium ? <StarIcon /> : <InsightsIcon />}
                        label={isPremium ? 'PREMIUM' : 'FREE'}
                        color={isPremium ? 'warning' : 'success'}
                        variant="filled"
                        size="medium"
                        sx={{
                          fontWeight: 700,
                          boxShadow: isPremium
                            ? '0 2px 8px rgba(255, 193, 7, 0.3)'
                            : '0 2px 8px rgba(76, 175, 80, 0.3)',
                          '& .MuiChip-icon': {
                            color: 'white',
                          },
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {isPremium
                          ? 'Exclusive content for premium subscribers'
                          : 'Available to all users'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Status Indicator */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mt: 3,
                  pt: 2,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                >
                  <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                  {fixture ? 'Ready for prediction' : 'Select a fixture to continue'}
                </Typography>
                {fixture && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: 'success.main',
                      }}
                    />
                    <Typography variant="caption" fontWeight={600} color="success.main">
                      ACTIVE
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Card */}
        <div className="flex-1 space-y-6">
          <Card
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              background: 'linear-gradient(135deg, #ffffff 0%, #fafbff 100%)',
              position: 'relative',
              overflow: 'visible',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
              },
              '&:hover': {
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.08)',
                borderColor: 'rgba(59, 130, 246, 0.2)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              {/* Header with icon and gradient background */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  mb: 3,
                  pb: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <AnalyticsIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Match Analysis
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                  >
                    <InfoIcon sx={{ fontSize: 14 }} />
                    In-depth analysis & insights
                  </Typography>
                </Box>
              </Box>

              {/* Analysis Content Section */}
              <Box sx={{ mb: 3 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    backgroundColor: analysis
                      ? 'rgba(59, 130, 246, 0.02)'
                      : 'rgba(59, 130, 246, 0.04)',
                    border: '1px solid',
                    borderColor: analysis ? 'rgba(59, 130, 246, 0.1)' : 'rgba(156, 163, 175, 0.2)',
                    maxHeight: 240,
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                      width: 6,
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: 'rgba(59, 130, 246, 0.05)',
                      borderRadius: 3,
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      borderRadius: 3,
                      '&:hover': {
                        backgroundColor: 'rgba(59, 130, 246, 0.3)',
                      },
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1.5,
                    }}
                  >
                    <DescriptionIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    <Typography
                      variant="caption"
                      fontWeight={600}
                      sx={{
                        letterSpacing: '0.5px',
                        color: 'primary.main',
                        textTransform: 'uppercase',
                      }}
                    >
                      Detailed Analysis
                    </Typography>
                  </Box>

                  {analysis ? (
                    <Typography
                      variant="body2"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.7,
                        color: 'text.primary',
                        '& strong': {
                          color: 'primary.main',
                          fontWeight: 600,
                        },
                        '& em': {
                          color: 'text.secondary',
                          fontStyle: 'italic',
                        },
                      }}
                    >
                      {analysis}
                    </Typography>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <DescriptionIcon
                        sx={{
                          fontSize: 48,
                          color: 'action.disabled',
                          mb: 2,
                          opacity: 0.5,
                        }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: 'italic' }}
                      >
                        No analysis provided yet
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.disabled"
                        sx={{ display: 'block', mt: 0.5 }}
                      >
                        Add detailed insights for better prediction quality
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Box>

              {/* Confidence Section */}
              <Box sx={{ mt: 3 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    background:
                      'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)',
                    border: '1px solid',
                    borderColor: 'rgba(59, 130, 246, 0.15)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '100%',
                      background: `linear-gradient(90deg, ${getConfidenceHexColor(
                        accuracy
                      )} 0%, ${getConfidenceHexColor(
                        accuracy
                      )} ${accuracy}%, transparent ${accuracy}%)`,
                      opacity: 0.1,
                      zIndex: 0,
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 2,
                      }}
                    >
                      <TrendingUpIcon
                        sx={{
                          fontSize: 18,
                          color: getConfidenceHexColor(accuracy),
                        }}
                      />
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        sx={{
                          letterSpacing: '0.5px',
                          color: getConfidenceHexColor(accuracy),
                          textTransform: 'uppercase',
                        }}
                      >
                        Prediction Confidence
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                          Confidence Level
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            mt: 0.5,
                          }}
                        >
                          <TargetIcon sx={{ fontSize: 14 }} />
                          {getAccuracyLevel(accuracy)}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography
                          variant="h4"
                          fontWeight={800}
                          sx={{
                            background: `linear-gradient(90deg, ${getConfidenceHexColor(
                              accuracy
                            )} 0%, ${getConfidenceHexColor(accuracy)} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          {accuracy}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Prediction accuracy score
                        </Typography>
                      </Box>
                    </Box>

                    {/* Enhanced Progress Bar */}
                    <Box sx={{ position: 'relative', mb: 1 }}>
                      <Box
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(156, 163, 175, 0.2)',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${accuracy}%`,
                            background: `linear-gradient(90deg, ${getConfidenceHexColor(
                              accuracy
                            )} 0%, ${getConfidenceHexColor(accuracy)}80 100%)`,
                            borderRadius: 4,
                            boxShadow: `0 2px 8px ${getConfidenceHexColor(accuracy)}40`,
                            transition: 'width 0.6s ease',
                            position: 'relative',
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background:
                                'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                              animation: 'shimmer 2s infinite',
                            },
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mt: 0.5,
                        }}
                      >
                        <Typography variant="caption" color="text.disabled" fontWeight={500}>
                          Low
                        </Typography>
                        <Typography variant="caption" color="text.disabled" fontWeight={500}>
                          Medium
                        </Typography>
                        <Typography variant="caption" color="text.disabled" fontWeight={500}>
                          High
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </div>

        {/* Prediction Picks */}
        <div className="flex-1">
          <Card
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              background: 'linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)',
              height: '100%',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(59, 130, 246, 0.1)',
              },
            }}
          >
            <CardContent sx={{ p: 3.5 }}>
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 44,
                    height: 44,
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                    color: 'white',
                  }}
                >
                  <InsightsIcon sx={{ fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={700} color="primary">
                    Prediction Picks
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Your market selections
                  </Typography>
                </Box>
                <Chip
                  label={`${picks.length} picks`}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ ml: 'auto' }}
                />
              </Box>

              {/* Picks List */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {picks.map((pick, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      p: 2.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      backgroundColor: 'white',
                      '&:hover': {
                        backgroundColor: '#fafbff',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s ease',
                      },
                    }}
                  >
                    {/* Pick Header */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2.5,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.875rem',
                          }}
                        >
                          {index + 1}
                        </Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          Pick #{index + 1}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${pick.confidence}% confidence`}
                        color={getConfidenceMuiColor(pick.confidence)}
                        variant="filled"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>

                    {/* Pick Details */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {/* Market */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight={500}
                            sx={{ textTransform: 'uppercase' }}
                          >
                            Market
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {pick.market}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Selection */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          sx={{
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            backgroundColor: 'success.main',
                          }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight={500}
                            sx={{ textTransform: 'uppercase' }}
                          >
                            Selection
                          </Typography>
                          <Typography variant="body2" fontWeight={500}>
                            {pick.selectionLabel || pick.selectionKey}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Confidence Bar */}
                    <Box sx={{ mt: 3 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 1,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" fontWeight={500}>
                          Confidence Level
                        </Typography>
                        <Typography variant="caption" fontWeight={600} color="text.primary">
                          {pick.confidence}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={pick.confidence}
                        color={getConfidenceMuiColor(pick.confidence)}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  </Paper>
                ))}

                {/* Empty State */}
                {picks.length === 0 && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      borderRadius: 2,
                      borderStyle: 'dashed',
                      borderColor: 'divider',
                      backgroundColor: '#fafbff',
                    }}
                  >
                    <InsightsIcon
                      sx={{
                        fontSize: 48,
                        color: 'action.disabled',
                        mb: 2,
                        opacity: 0.5,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      No prediction picks added
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      Add market picks to create your prediction
                    </Typography>
                  </Paper>
                )}
              </Box>
            </CardContent>
          </Card>
        </div>
      </div>
    </Box>
  );
};

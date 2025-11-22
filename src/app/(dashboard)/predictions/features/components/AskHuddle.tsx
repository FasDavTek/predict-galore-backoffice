// features/components/AskHuddle.tsx
import React, { useState, useEffect, useRef } from "react";
import { useAskHuddleMutation } from "../api/predictionApi";
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  TextField,
  Avatar,
  InputAdornment,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import {
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy as AIIcon,
} from "@mui/icons-material";
import { HuddleMessage } from "../types/huddle.types";

interface ApiError {
  data?: {
    message?: string;
  };
  status?: number;
}

interface AskHuddleProps {
  open: boolean;
  onClose: () => void;
}

const AskHuddle: React.FC<AskHuddleProps> = ({ open, onClose }) => {
  const [prompt, setPrompt] = useState("");
  const [conversation, setConversation] = useState<HuddleMessage[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [askHuddle, { isLoading, error }] = useAskHuddleMutation();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const handleSend = async () => {
    const userMessage = prompt.trim();
    if (!userMessage) return;

    // Add user message to conversation immediately
    const newUserMessage: HuddleMessage = {
      type: "user",
      content: userMessage,
      timestamp: new Date().toISOString(),
    };

    setConversation((prev) => [...prev, newUserMessage]);
    setPrompt("");

    try {
      // Prepare API payload with default values
      const payload = {
        prompt: userMessage,
        sport: "Football",
        league: "Premier League",
        teams: [],
        toolsAllowed: true,
        lookbackGames: 5,
        asOfUtc: new Date().toISOString(),
      };

      // Dispatch the API call
      const response = await askHuddle(payload).unwrap();

      // Add assistant message to conversation
      const assistantMessage: HuddleMessage = {
        type: "assistant",
        content: response.data?.answer || "No response received",
        timestamp: new Date().toISOString(),
      };

      setConversation((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Failed to get AI response:", err);

      // Add error message to conversation
      const errorMessage: HuddleMessage = {
        type: "assistant",
        content:
          "Sorry, I encountered an error while processing your request. Please try again.",
        timestamp: new Date().toISOString(),
      };

      setConversation((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getErrorMessage = (error: unknown): string => {
    if (typeof error === "object" && error !== null) {
      const apiError = error as ApiError;
      if (apiError.data?.message) {
        return apiError.data.message;
      }
    }
    return "An error occurred";
  };

  // Handle drawer close with state reset
  const handleClose = () => {
    // Reset state synchronously when closing
    setPrompt("");
    setConversation([]);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 400,
          maxWidth: "90vw",
          background: "linear-gradient(135deg, #f8fdf5 0%, #ffffff 100%)",
          borderLeft: "2px solid",
          borderColor: "primary.light",
        },
      }}
    >
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          background: "linear-gradient(135deg, #6bc330 0%, #4ca020 100%)",
          color: "white",
          borderRadius: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "white", width: 40, height: 40 }}>
              <AIIcon sx={{ color: "#6bc330" }} />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Huddle AI Assistant
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Get expert sports insights
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          p: 2,
          gap: 2,
        }}
      >
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {getErrorMessage(error)}
          </Alert>
        )}

        {/* Chat Messages */}
        <Box
          ref={chatContainerRef}
          sx={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 1,
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": {
              width: 6,
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#e0e0e0",
              borderRadius: 3,
            },
          }}
        >
          {conversation.length === 0 && (
            <Box
              sx={{
                alignSelf: "center",
                textAlign: "center",
                py: 4,
                color: "text.secondary",
              }}
            >
              <AIIcon sx={{ fontSize: 48, color: "primary.light", mb: 2 }} />
              <Typography variant="body1" gutterBottom>
                Ask me anything about sports predictions and insights!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                I can help you analyze matches, provide statistics, and suggest
                predictions.
              </Typography>
            </Box>
          )}

          {conversation.map((message, index) => (
            <Box
              key={index}
              sx={{
                alignSelf: message.type === "user" ? "flex-end" : "flex-start",
                bgcolor: message.type === "user" ? "primary.light" : "grey.100",
                color: message.type === "user" ? "white" : "text.primary",
                px: 2,
                py: 1.5,
                borderRadius: 2,
                maxWidth: "85%",
                boxShadow: 1,
                border: message.type === "user" ? "none" : "1px solid",
                borderColor: "grey.300",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                {message.type === "assistant" && (
                  <Avatar
                    sx={{ width: 24, height: 24, bgcolor: "primary.main" }}
                  >
                    <AIIcon sx={{ fontSize: 14 }} />
                  </Avatar>
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, whiteSpace: "pre-wrap" }}
                  >
                    {message.content}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.5,
                      display: "block",
                      opacity: 0.7,
                      color:
                        message.type === "user" ? "white" : "text.secondary",
                    }}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </Typography>
                </Box>
                {message.type === "user" && (
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: "white",
                      color: "primary.main",
                    }}
                  >
                    👤
                  </Avatar>
                )}
              </Box>
            </Box>
          ))}

          {isLoading && (
            <Box
              sx={{
                alignSelf: "flex-start",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Avatar sx={{ width: 24, height: 24, bgcolor: "primary.main" }}>
                <AIIcon sx={{ fontSize: 14 }} />
              </Avatar>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 1.5,
                }}
              >
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">
                  Huddle AI is thinking...
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {/* Input Area */}
        <Box sx={{ pt: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="Ask Huddle AI about sports insights..."
            value={prompt}
            onChange={handlePromptChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleSend}
                    disabled={!prompt.trim() || isLoading}
                    color="primary"
                    edge="end"
                  >
                    {isLoading ? <CircularProgress size={20} /> : <SendIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "white",
              },
            }}
          />
        </Box>
      </Box>
    </Drawer>
  );
};

export default AskHuddle;

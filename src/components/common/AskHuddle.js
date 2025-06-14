import React, { useState } from "react";
import Image from "next/image";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Grid,
  TextField,
  Avatar,
  InputAdornment,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

const promptOptions = [
  "Past Match Scores",
  "Head-to-Head",
  "Upcoming Fixtures",
  "Team Form",
  "Top Scorers",
  "Player Stats",
  "League Standings",
];

const AskHuddle = () => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatStarted, setChatStarted] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setPrompt("");
    setChatHistory([]);
    setChatStarted(false);
  };

  // Updated to only set the prompt without sending
  const handlePromptClick = (value) => {
    setPrompt(value);
    // Remove the handleSend call here
    // Auto-focus the input field
    setTimeout(() => {
      const input = document.querySelector('#chat-input');
      if (input) input.focus();
    }, 0);
  };

  const handlePromptChange = (e) => setPrompt(e.target.value);

  const handleSend = (message) => {
    const userMessage = message || prompt.trim();
    if (!userMessage) return;

    setChatHistory((prev) => [
      ...prev,
      { sender: "user", message: userMessage },
    ]);
    setPrompt("");
    setChatStarted(true);

    // Simulated bot response
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "bot",
          message: `Here are some insights based on "${userMessage}". (Simulated Response)`,
        },
      ]);
    }, 800);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="text"
        sx={{
          position: "fixed",
          right: 0,
          top: "40%",
          transform: "translateY(-50%)",
          zIndex: 1300,
          padding: 0,
          margin: 0,
          minWidth: "auto",
          "&:hover": {
            transform: "translateY(-50%) translateX(-4px)",
            backgroundColor: "transparent",
          },
          "&:active": {
            transform: "translateY(-50%) translateX(-2px)",
          },
        }}
      >
        <Image
          src="/Docker.png"
          alt="Chat button"
          width={36}
          height={36}
          style={{
            objectFit: "contain",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
          }}
          priority
        />
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "linear-gradient(to bottom right, #fff, #f0f4ec)",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 0, mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Avatar
            sx={{
              bgcolor: "#6bc330",
              width: 48,
              height: 48,
              mx: "auto",
              mb: 1,
            }}
          >
            😊
          </Avatar>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Get Insights from Huddle
          </Typography>
        </DialogTitle>

        <DialogContent
          sx={{
            "&.MuiDialogContent-root": {
              overflowY: "hidden",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            },
          }}
        >
          {!chatStarted && (
            <>
              <Grid container spacing={2} mb={2} justifyContent="center">
                {promptOptions.map((option) => (
                  <Grid item xs={6} sm={4} key={option}>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{
                        backgroundColor: "#a9dfbf",
                        color: "#000",
                        textTransform: "none",
                        "&:hover": { backgroundColor: "#82c99f" },
                        fontWeight: 500,
                      }}
                      onClick={() => handlePromptClick(option)}
                    >
                      {option}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          <Box
            sx={{
              maxHeight: 240,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mb: 2,
              px: 1,
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {chatHistory.map((chat, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: chat.sender === "user" ? "flex-end" : "flex-start",
                  bgcolor: chat.sender === "user" ? "#e0f7fa" : "#dcedc8",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  maxWidth: "80%",
                  boxShadow: 1,
                  mb: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: "#333" }}
                >
                  {chat.message}
                </Typography>
              </Box>
            ))}
          </Box>

          <TextField
            id="chat-input"
            fullWidth
            placeholder="Type your message or select a prompt..."
            value={prompt}
            onChange={handlePromptChange}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => handleSend()}
                    disabled={!prompt.trim()}
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AskHuddle;
import React, { useState } from "react";
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
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";

const promptOptions = [
  "Past Match Scores",
  "Head-to-Head",
  "Upcoming Fixtures",
  "Team Form",
  "Top Scorers",
  "Player Stats",
  "League Standings",
  "See More",
];

const AskHuddle = () => {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setPrompt("");
    setChatHistory([]);
  };

  const handlePromptClick = (value) => {
    setPrompt(value);
    handleSend(value);
  };

  const handlePromptChange = (e) => setPrompt(e.target.value);

  //   const handleSend = async (message) => {
  //   const userMessage = message || prompt.trim();
  //   if (!userMessage) return;

  //   // Show user's message immediately
  //   setChatHistory((prev) => [...prev, { sender: "user", message: userMessage }]);
  //   setPrompt("");

  //   try {
  //     const res = await fetch("/api/huddle", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ message: userMessage }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) throw new Error(data.message || "Something went wrong.");

  //     setChatHistory((prev) => [...prev, { sender: "bot", message: data.reply }]);
  //   } catch (error) {
  //     setChatHistory((prev) => [
  //       ...prev,
  //       {
  //         sender: "bot",
  //         message: "❌ Failed to fetch response. Please try again later.",
  //       },
  //     ]);
  //     console.error("Error sending message:", error);
  //   }
  // };

  // simulate logic for chat temporarily

  const handleSend = (message) => {
    const userMessage = message || prompt.trim();
    if (!userMessage) return;

    // Simulate sending and receiving a reply
    setChatHistory((prev) => [
      ...prev,
      { sender: "user", message: userMessage },
    ]);
    setPrompt("");
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        { sender: "user", message: userMessage },
        {
          sender: "bot",
          message: `Here are some insights based on "${userMessage}". (Simulated Response)`,
        },
      ]);
    }, 800);
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={handleOpen}
        sx={{
          position: "fixed",
          right: 0,
          top: "40%",
          transform: "translateY(-50%)",
          zIndex: 1300,
          backgroundColor: "#6bc330",
          borderRadius: "32px 0 0 32px",
          padding: "12px 8px",
          width: "48px",
          height: "180px",
          minWidth: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#5aa52a",
          },
        }}
      >
        <Typography
          sx={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            color: "white",
            fontWeight: 600,
            fontSize: "14px",
          }}
        >
          Ask Huddle
        </Typography>

        <Box
          sx={{
            width: 24,
            height: 24,
            backgroundColor: "#f5f589",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 1,
          }}
        >
          <ChatBubbleOutlineIcon sx={{ fontSize: "16px", color: "#444" }} />
        </Box>
      </Button>

      {/* Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "linear-gradient(to bottom right, #fff, #f0f4ec)",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 0 }}>
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

        <DialogContent>
          {/* Prompt Buttons */}
          <Typography fontWeight={600} mb={1}>
            Select a Prompt to Fetch Insights
          </Typography>
          <Grid container spacing={1} mb={2}>
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

          {/* Chat Messages */}
          <Box
            sx={{
              maxHeight: "200px",
              overflowY: "auto",
              mb: 2,
              px: 1,
            }}
          >
            {chatHistory.map((chat, index) => (
              <Typography
                key={index}
                sx={{
                  mb: 1,
                  color: chat.sender === "user" ? "#333" : "#4caf50",
                  fontWeight: chat.sender === "bot" ? 500 : 400,
                }}
              >
                <strong>{chat.sender === "user" ? "You" : "Huddle"}:</strong>{" "}
                {chat.message}
              </Typography>
            ))}
          </Box>

          {/* Chat Input */}
          <TextField
            fullWidth
            placeholder="Select a prompt to get started..."
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

        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Button onClick={handleClose}>Close</Button>
          <Button
            variant="contained"
            disabled={!prompt.trim()}
            onClick={() => handleSend()}
          >
            Fetch
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AskHuddle;

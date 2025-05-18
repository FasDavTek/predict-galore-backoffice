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
  const [chatStarted, setChatStarted] = useState(false); // Track chat start

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setPrompt("");
    setChatHistory([]);
    setChatStarted(false); // Reset when closed
  };

  const handlePromptClick = (value) => {
    setPrompt(value);
    handleSend(value);
  };

  const handlePromptChange = (e) => setPrompt(e.target.value);

  const handleSend = (message) => {
    const userMessage = message || prompt.trim();
    if (!userMessage) return;

    setChatHistory((prev) => [...prev, { sender: "user", message: userMessage }]);
    setPrompt("");
    setChatStarted(true); // Mark chat as started

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
      {/* <Button
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
      </Button> */}


<svg 
  viewBox="0 0 56 262" 
  preserveAspectRatio="none" 
  onClick={handleOpen}
  style={{  
    width: "48px",
    height: "180px",
    position: "fixed",
    right: 0,
    top: "40%",
    zIndex: 1300,
    cursor: "pointer",
  }}
>
  {/* Background path */}
 <path
  d="M56,0
     Q56,20 46,30
     L10,30
     Q0,40 0,131
     Q0,222 10,232
     L46,232
     Q56,232 56,254  
     L56,262
     L48,262         
     Q56,262 56,254
     Z"
  fill="#4CAF50"
/>
  
  {/* Container for icon and text */}
  <foreignObject 
    x="0" 
    y="0" 
    width="56" 
    height="262"
  >
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      gap: "12px",
      textOrientation: "mixed"
    }}>
      {/* Icon */}
      <ChatBubbleOutlineIcon />
      
      {/* Vertical text */}
      <Typography>
        Ask Huddle
      </Typography>
    </Box>
  </foreignObject>
</svg>





    
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
          {!chatStarted && (
            <>
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
            }}
          >
            {/* chat history */}
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
                  {/* <strong>
                  {chat.sender === "user" ? "You" : "Huddle"}:
                  </strong>{" "} */}
                  
                  {chat.message}
                </Typography>
              </Box>
            ))}
          </Box>

          <TextField
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

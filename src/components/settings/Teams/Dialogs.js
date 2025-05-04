import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, Box, IconButton, Typography } from "@mui/material";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import { useState } from "react";

// Invite Members Dialog Component
export const InviteMembersDialog = ({ open, onClose, onSendInvites }) => {
    const [newMembers, setNewMembers] = useState([{ email: "", role: "Admin" }]);

    const addMemberField = () => {
        setNewMembers([...newMembers, { email: "", role: "Admin" }]);
    };

    const removeMemberField = (index) => {
        const updatedMembers = [...newMembers];
        updatedMembers.splice(index, 1);
        setNewMembers(updatedMembers);
    };

    const handleMemberChange = (index, field, value) => {
        const updatedMembers = [...newMembers];
        updatedMembers[index][field] = value;
        setNewMembers(updatedMembers);
    };

    const handleSubmit = () => {
        onSendInvites(newMembers);
        setNewMembers([{ email: "", role: "Admin" }]);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Members</DialogTitle>
            <DialogContent>
                <Typography variant="body2" sx={{ mb: 3 }}>
                    Add members to manage and access your system
                </Typography>

                {newMembers.map((member, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ mr: 2 }}>Email</Typography>
                            {index > 0 && (
                                <IconButton size="small" onClick={() => removeMemberField(index)}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Box>
                        <TextField
                            fullWidth
                            placeholder="user@example.com"
                            value={member.email}
                            onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>Role</Typography>
                        <Select
                            fullWidth
                            value={member.role}
                            onChange={(e) => handleMemberChange(index, 'role', e.target.value)}
                        >
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="Editor">Editor</MenuItem>
                            <MenuItem value="Viewer">Viewer</MenuItem>
                        </Select>
                    </Box>
                ))}

                <Button startIcon={<AddIcon />} onClick={addMemberField} sx={{ mt: 1 }}>
                    Add another member
                </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button 
                    variant="contained" 
                    onClick={handleSubmit}
                    disabled={newMembers.some(m => !m.email)}
                >
                    Send invites
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Edit Role Dialog Component
export const EditRoleDialog = ({ 
    open, 
    member, 
    onClose, 
    onSave 
}) => {
    const [role, setRole] = useState(member?.role || "");

    const handleSave = () => {
        onSave(role);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogContent>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    Editing role for: <strong>{member?.name}</strong>
                </Typography>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>New Role</Typography>
                <Select
                    fullWidth
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <MenuItem value="Super Admin">Super Admin</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Editor">Editor</MenuItem>
                    <MenuItem value="Viewer">Viewer</MenuItem>
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSave}>
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Delete Confirmation Dialog Component
export const DeleteMemberDialog = ({ 
    open, 
    member, 
    onClose, 
    onConfirm 
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Delete Team Member</DialogTitle>
            <DialogContent>
                <Typography sx={{ mb: 3 }}>
                    Are you sure you want to delete {member?.name}? They will lose all access.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button 
                    variant="contained" 
                    color="error"
                    onClick={onConfirm}
                >
                    Delete Member
                </Button>
            </DialogActions>
        </Dialog>
    );
};
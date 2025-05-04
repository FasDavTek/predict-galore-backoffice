import { Box, Button, Typography, Card, CardContent, Table, TableBody, TableRow, TableCell, Chip } from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

const MemberDetail = ({ member, onBack }) => {
    if (!member) {
        return (
            <Box>
                <Button variant="text" startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 2 }}>
                    Back 
                </Button>
                <Typography variant="h6">Member data not available</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 3 }}>
                Back to Team Members
            </Button>

            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>Member Details</Typography>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell>{member.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                <TableCell>{member.email}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Date Added</TableCell>
                                <TableCell>{member.date}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={member.role} 
                                        color={
                                            member.role === 'Super Admin' ? 'primary' :
                                            member.role === 'Admin' ? 'secondary' : 'default'
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </Box>
    );
};

export default MemberDetail;
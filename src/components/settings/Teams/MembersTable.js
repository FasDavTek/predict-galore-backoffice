import { 
    TableContainer, 
    Table, 
    TableHead, 
    TableBody, 
    TableRow, 
    TableCell, 
    Checkbox, 
    IconButton, 
    Paper,
    Typography
  } from "@mui/material";
  import { MoreVert as MoreVertIcon } from "@mui/icons-material";
  
  const MembersTable = ({ 
    members, 
    selectedMember, 
    onSelectMember, 
    onMenuOpen 
  }) => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date Added</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow 
                key={member.id} 
                hover
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedMember?.id === member.id}
                    onChange={() => onSelectMember(member)}
                  />
                </TableCell>
                <TableCell>
                  <Typography fontWeight="medium">{member.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.email}
                  </Typography>
                </TableCell>
                <TableCell>{member.date}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={(event) => onMenuOpen(event, member)}
                    aria-label="actions"
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };
  
  export default MembersTable;
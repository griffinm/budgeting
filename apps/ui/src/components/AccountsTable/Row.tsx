import { ConnectedAccountEntity } from "@budgeting/api/connected-accounts/dto/connected-account.entity";
import { TableRow, TableCell, Typography } from "@mui/material";
import { format as formatDate } from "date-fns";
import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import { formatCurrency } from "@budgeting/ui/utils/formatters";
interface Props {
  connectedAccount: ConnectedAccountEntity;
  onUpdate: (connectedAccount: ConnectedAccountEntity) => void;
}

export function AccountTableRow({ connectedAccount, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(connectedAccount.nickname || "");

  const renderShow = () => {
    return (
      <div
        onClick={() => setIsEditing(true)}
        className="p-2 flex flex-col hover:bg-gray-100 cursor-pointer transition-colors duration-100 rounded-sm">
        {connectedAccount.nickname || connectedAccount.plaidOfficialName}
        <Typography variant="caption">
          {connectedAccount.plaidSubtype}
        </Typography>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdate({ ...connectedAccount, accountId: connectedAccount.id, nickname });
    setIsEditing(false);
  }

  const renderEdit = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="p-2 flex justify-between">
          <TextField
            variant="standard"
            size="small"
            fullWidth
            placeholder="Nickname"
            value={nickname}
            autoFocus
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNickname(e.target.value)}
          />
          <Button
            color="secondary"
            onClick={() => {
              setNickname(connectedAccount.nickname || "");
              setIsEditing(false);
            }}
          >
            <Close />
          </Button>
          <Button
            color="primary"
            type="submit"
          >
            <Check />
          </Button>
        </div>
      </form>
    )
  }

  return (
    <TableRow>
      <TableCell>
        {isEditing ? renderEdit() : renderShow()}
      </TableCell>
      <TableCell>
        ****{connectedAccount.plaidMask}
      </TableCell>
      <TableCell>
        {formatDate(new Date(connectedAccount.updatedAt), "MMM d, yyyy")}
      </TableCell>
      <TableCell>
        {formatCurrency(connectedAccount.lastBalance)}
      </TableCell>
    </TableRow>
  )
}

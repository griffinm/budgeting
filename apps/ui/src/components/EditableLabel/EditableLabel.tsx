import { Check } from "@mui/icons-material";
import { Close } from "@mui/icons-material";
import { Button, TextField } from "@mui/material";
import { Typography, TypographyProps } from "@mui/material";
import { useState } from "react";

export function EditableLabel({
  value,
  onSave,
  labelTypographyProps,
}: {
  value?: string;
  onSave: (label: string) => void;
  labelTypographyProps?: TypographyProps;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(value);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newValue) {
      return;
    }
    onSave(newValue);
    setIsEditing(false);
  }

  return (
    <div>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="flex">
            <div className="flex-1">
              <TextField
                variant="standard"
                size="small"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                autoFocus
                fullWidth
              />
            </div>
            <Button
              color="secondary"
              onClick={() => setIsEditing(false)}
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
      ) : (
        <div className="flex cursor-pointer hover:bg-gray-100 rounded-md p-1 transition-colors" onClick={() => setIsEditing(true)}>
          <Typography {...labelTypographyProps}>{value}</Typography>
        </div>
      )}
    </div>
  )
}

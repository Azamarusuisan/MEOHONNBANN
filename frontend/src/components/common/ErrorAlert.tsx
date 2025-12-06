import { Alert, AlertTitle, Collapse, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface ErrorAlertProps {
  error: string | null
  onClose: () => void
  title?: string
}

const ErrorAlert = ({ error, onClose, title = 'エラー' }: ErrorAlertProps) => {
  return (
    <Collapse in={!!error}>
      <Alert
        severity="error"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ mb: 2 }}
      >
        <AlertTitle>{title}</AlertTitle>
        {error}
      </Alert>
    </Collapse>
  )
}

export default ErrorAlert

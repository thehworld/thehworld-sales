import { Alert, AlertTitle } from '@mui/material'
import React from 'react'

export default function Notification() {
  return (
    <div style={{
      margin:40
    }}>
        <hr />
        <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            This is an error alert — <strong>check it out!</strong>
        </Alert>
        <hr />
        <Alert severity="success">
            <AlertTitle>success</AlertTitle>
            This is an error alert — <strong>check it out!</strong>
        </Alert>
        <hr />
        <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            This is an error alert — <strong>check it out!</strong>
        </Alert>
    </div>
  )
}

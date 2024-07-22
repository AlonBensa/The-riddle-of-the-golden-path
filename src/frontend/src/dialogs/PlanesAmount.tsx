import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'

interface PlanesAmountProps {
    dialogOpen: boolean
    formData: { planesAmount: number }
    setFormData: (data: { planesAmount: number }) => void
    handleDialogClose: () => void
    handleDialogSubmit: () => void
}

export default function PlanesAmountDialog(props: PlanesAmountProps) {
    return (
        <Dialog open={props.dialogOpen} onClose={props.handleDialogClose}>
            <DialogTitle>
                Change Planes Amount
            </DialogTitle>
            <DialogContent>
                <TextField
                    label="Number of Planes"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={props.formData.planesAmount || ''}
                    onChange={(e) => props.setFormData({ ...props.formData, planesAmount: parseInt(e.target.value, 10) })}
                    sx={{mt: 2}}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleDialogClose}>Cancel</Button>
                <Button onClick={props.handleDialogSubmit}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
}

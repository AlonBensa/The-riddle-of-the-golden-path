import React, {useState} from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material'
import { PLANES_AMOUNT_DEFAULT } from '../pages/Home/Home'

interface PlanesAmountProps {
    dialogOpen: boolean
    handleDialogClose: () => void
    handleDialogSubmit: (planesAmount: number) => void
}

export default function PlanesAmountDialog(props: PlanesAmountProps) {
    const [planesAmount, setPlanesAmount] = useState<number>(PLANES_AMOUNT_DEFAULT);

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
                    value={planesAmount !== null && planesAmount !== undefined ? planesAmount : ''}
                    onChange={(e) => setPlanesAmount(parseInt(e.target.value, 10))}
                    sx={{mt: 2}}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleDialogClose}>Cancel</Button>
                <Button onClick={() => {
                    props.handleDialogSubmit(planesAmount);
                    props.handleDialogClose();
                }}>Submit</Button>
            </DialogActions>
        </Dialog>
    )
}
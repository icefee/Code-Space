import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Button, Checkbox, FormControlLabel } from '@mui/material'
import type { DialogProps } from '@mui/material'

interface SelctionEditProps extends DialogProps {
    sections: Section[];
    activeSections: number[];
    activeSectionsChange: (arg: number[]) => void;
}

const SectionEdit: React.FunctionComponent<SelctionEditProps> = ({ sections, activeSections, activeSectionsChange, open, onClose }) => {

    const handleSelectAll = (_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        activeSectionsChange(
            checked ? sections.map((_, index) => index) : []
        )
    }

    const handleSelect = (index: number, checked: boolean) => {
        activeSectionsChange(
            checked ? [
                ...activeSections,
                index
            ] : activeSections.filter(value => value !== index)
        )
    }

    return (
        <Dialog scroll="paper" open={open} onClose={onClose}>
            <DialogTitle>显示的栏目</DialogTitle>
            <DialogContent dividers>
                <Box>
                    <FormControlLabel
                        label="全部栏目"
                        control={
                            <Checkbox
                                checked={activeSections.length === sections.length}
                                indeterminate={activeSections.length > 0 && activeSections.length < sections.length}
                                onChange={handleSelectAll}
                            />
                        }
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                        {
                            sections.map(
                                ({ section }, sectionIndex) => (
                                    <FormControlLabel
                                        key={sectionIndex}
                                        label={section}
                                        control={<Checkbox checked={activeSections.includes(sectionIndex)}
                                            onChange={(_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => handleSelect(sectionIndex, checked)} />}
                                    />
                                )
                            )
                        }
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={_ => onClose({}, 'escapeKeyDown')}>关闭</Button>
            </DialogActions>
        </Dialog>
    )
}

export default SectionEdit

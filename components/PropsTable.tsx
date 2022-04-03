import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export type PropsItem = {
    name: string;
    type: React.ReactElement | string;
    defaultValue?: string;
    description?: string;
}

interface PropsTableProps {
    data: PropsItem[]
}

const PropsTable: React.FC<PropsTableProps> = ({ data }) => (
    <TableContainer component={Paper}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>名称</TableCell>
                    <TableCell>类型</TableCell>
                    <TableCell>默认值</TableCell>
                    <TableCell>描述</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map(({ name, type, defaultValue, description }) => (
                    <TableRow
                        key={name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell>{name}</TableCell>
                        <TableCell>{type}</TableCell>
                        <TableCell>{defaultValue || '-'}</TableCell>
                        <TableCell>{description || '-'}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
)

export default PropsTable;
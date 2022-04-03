import React from "react";
import PageBase, { PageProps } from '@components/PageBase';
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'

class ReactBMap extends PageBase {
    protected childRender(props: PageProps) {
        return (
            <Paper>
                <Alert severity="success">React-BMap</Alert>
            </Paper>
        )
    }
}

export default ReactBMap;

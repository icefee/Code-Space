import React, { useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { styled } from "@mui/material/styles";
import { Box, Tab, Stack, Collapse, IconButton, Tooltip } from "@mui/material";
import { CodeOutlined as CodeOutlinedIcon, ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import HlCode from "./HlCode";
import PropsTable from "./PropsTable";
import type { PropsItem } from "./PropsTable"
import css from './DocBase.module.css';
import { useCopyToClipboard } from "react-use";
import { useSnackbar } from "util/useSnackbar";

const StyledDiv = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default
}));

export interface DocBaseProps {
    demo: React.ReactNode;
    api: PropsItem[];
    code: string;
}

const DocBase: React.FC<DocBaseProps> = ({ demo, api, code }) => {
    const [active, setActive] = useState('1')
    const [showCode, setShowCode] = useState(false);
    const [, setClipboard] = useCopyToClipboard();
    const showSnackbar = useSnackbar();
    const handleChange = (event: React.SyntheticEvent, value: string) => {
        setActive(value);
    };
    const copyCode = () => {
        setClipboard(code)
        showSnackbar({
            message: '代码已经复制到剪切板',
            autoHideDuration: 3000
        })
    }
    return (
        <StyledDiv>
            <TabContext value={active}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="演示" value="1" />
                        <Tab label="Api" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <div className={css.demo}>{demo}</div>
                    <Collapse in={showCode} style={{ marginTop: 10 }}>
                        <HlCode language="javascript" code={code} />
                    </Collapse>
                    <Stack direction="row" spacing={1} mt={1} justifyContent="flex-end">
                        <Tooltip title="显示代码">
                            <IconButton color={showCode ? 'primary' : 'default'} onClick={() => setShowCode(!showCode)}>
                                <CodeOutlinedIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="复制代码">
                            <IconButton color={showCode ? 'primary' : 'default'} onClick={copyCode}>
                                <ContentCopyIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                </TabPanel>
                <TabPanel value="2">
                    <PropsTable data={api} />
                </TabPanel>
            </TabContext>
        </StyledDiv>
    )
}

export default DocBase;

import PageBase, { PageProps } from "@components/PageBase";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import PropsTable from "@components/PropsTable";

class Type extends PageBase {
    protected childRender(props: PageProps) {
        return (
            <Accordion defaultExpanded>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    id="point"
                >
                    <Typography>Point</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <PropsTable data={
                        [
                            {
                                name: 'lng',
                                type: 'number',
                                description: '地理经度'
                            },
                            {
                                name: 'lat',
                                type: 'number',
                                description: '地理维度'
                            }
                        ]
                    } />
                </AccordionDetails>
            </Accordion>
        )
    }
}

export default Type;

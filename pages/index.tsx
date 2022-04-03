import PageBase, { PageProps } from '@components/PageBase';
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'
import css from './index.module.css'

class Index extends PageBase {
  protected childRender(props: PageProps) {
    return (
      <div className={css.introduction}>
        <Paper>
          <Alert severity="success">常用的组件集成</Alert>
        </Paper>
      </div>
    )
  }
}

export default Index;

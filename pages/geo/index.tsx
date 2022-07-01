import React, { useEffect } from 'react'
import { TextField, Button } from '@mui/material'
import { useCopyToClipboard } from "react-use";
import css from './style.module.css';
import { SnackbarProvider, useSnackbar } from "util/useSnackbar";

export function CopyListener({ text }) {
    const [, setClipboard] = useCopyToClipboard();
    const showSnackbar = useSnackbar();
    useEffect(() => {
        if (text !== '') {
            setClipboard(text);
            showSnackbar({
                message: '转换结果已经复制到剪切板, 可直接粘贴',
                autoHideDuration: 3000
            })
        }
    }, [text])
    return null
}

class Geo extends React.Component {

    state = {
        origin: '',
        result: ''
    }

    public transformGeo(): void {
        const { origin } = this.state
        const dataList = origin.split(
            /\n/g
        )
        if (dataList.length > 0) {
            const result = dataList.map(
                line => line.replace(
                    /(\d{1,3}°)?(\d{1,2}′)?(\d{1,2}(\.\d+)?″)?/g,
                    v => {
                        const h = v.match(/^\d{1,3}(?=°)/)
                        const m = v.match(/((?<=°)|^)\d{1,3}(?=′)/)
                        const s = v.match(/((?<=(°|′))|^)\d{1,2}(\.\d+)?(?=″)/)
                        const valid: (arg: string[] | null) => number = v => v ? Number(v[0]) : 0;
                        const r = valid(h) + valid(m) / 60 + valid(s) / 3600;
                        return r > 0 ? String(r) : ''
                    }
                )
            ).join('\n')
            this.setState({
                result
            })
        }
    }

    public clearFields(): void {
        this.setState({
            origin: '',
            result: ''
        })
    }

    render() {
        return (
            <SnackbarProvider>
                <div className={css.container}>
                    <div className={css.header}>
                        <h3>经纬度转换(时分秒转小数)</h3>
                    </div>
                    <div className={css.fields}>
                        <TextField
                            multiline
                            label="经纬度"
                            placeholder="支持多行"
                            value={this.state.origin}
                            onChange={ev => this.setState({ origin: ev.target.value })}
                            rows={20}
                        />
                        <TextField
                            multiline
                            label="转换结果"
                            value={this.state.result}
                            rows={20}
                        />
                        <CopyListener text={this.state.result} />
                    </div>
                    <div className={css.actions}>
                        <Button variant="contained" onClick={this.transformGeo.bind(this)}>转换</Button>
                        <Button onClick={this.clearFields.bind(this)}>清空</Button>
                    </div>
                </div>
            </SnackbarProvider>
        )
    }
}

export default Geo;

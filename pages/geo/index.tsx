import React from 'react'
import { TextField, Button } from '@mui/material'
import css from './style.module.css'

class Geo extends React.Component {

    state = {
        origin: '',
        result: ''
    }

    public transformGeo(): void {
        const {  origin } = this.state
        const dataList = origin.split(
            /\n/g
        )
        if (dataList.length > 0) {
            const result = dataList.map(
                line => line.replace(
                    /\d{0,3}°\d{0,2}′\d{0,2}(\.\d+)?″/g,
                    v => {
                        const h = v.match(/^\d{0,3}/)
                        const m = v.match(/(?<=°)\d{0,3}(?=′)/)
                        const s = v.match(/(?<=′)\d{0,2}(\.\d+)?(?=″)/)
                        const valid: (arg: string[] | null) => number = v => v ? Number(v[0]) : 0;
                        return String(valid(h) + valid(m) / 60 + valid(s) / 3600)
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
            <div className={css.container}>
                <div className={css.header}>
                    <h3>经纬度转换(时分秒转小数)</h3>
                </div>
                <div className={css.fields}>
                    <TextField multiline label="经纬度" value={this.state.origin} onChange={ev => this.setState({ origin: ev.target.value})} rows={20} />
                    <TextField multiline label="转换结果" value={this.state.result} rows={20} />
                </div>
                <div className={css.actions}>
                    <Button variant="contained" onClick={this.transformGeo.bind(this)}>转换</Button>
                    <Button onClick={this.clearFields.bind(this)}>清空</Button>
                </div>
            </div>
        )
    }
}

export default Geo;

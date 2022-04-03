import React from 'react'
import hljs from 'highlight.js/lib/core'
import 'highlight.js/styles/agate.css'
import javascript from 'highlight.js/lib/languages/javascript'
// import dart from 'highlight.js/lib/languages/dart'
import handlebars from 'highlight.js/lib/languages/handlebars'
import xml from 'highlight.js/lib/languages/xml'
hljs.registerLanguage('javascript', javascript)
// hljs.registerLanguage('dart', dart)
hljs.registerLanguage('handlebars', handlebars)
hljs.registerLanguage('xml', xml)

interface HlCodeProps {
    className?: string;
    style?: React.CSSProperties;
    code: string;
    language: 'xml' | 'handlebars' | 'javascript';
}

interface HlCodeState {
    _code: string;
}

export default class HlCode extends React.PureComponent<HlCodeProps, HlCodeState> {

    public state: HlCodeState = {
        _code: '',
    }

    constructor(props: HlCodeProps) {
        super(props);
        this.state._code = hljs.highlight(props.code, { language: props.language }).value;
    }

    public render(): JSX.Element {
        const { language, code, ...rest } = this.props;
        return (
            <pre {...rest}>
                <code className={`language-${language} hljs`} dangerouslySetInnerHTML={{ __html: this.state._code }} ></code>
            </pre>
        )
    }
}

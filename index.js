import { html, render, useState, useEffect, useRef } from 'https://unpkg.com/htm/preact/standalone.module.js'

function App() {
    /**
     * @type {{current: HTMLParagraphElement}}
     */
    const pRef = useRef(null);

    const [display, setDisplay] = useState(false);
    const [text, setText] = useState('');

    const [para, setPara] = useState(0);

    const paragraphs = text.split('\n\n').filter(e => e.trim() !== '').map(e => e.split('\n').map((e, i, {length}) => i + 1 === length ? e : html`${e}<br />`));
    
    useEffect(() => {
        if (!display) return;

        const handler = event => {
            switch(event.key) {
                case 'Enter':
                case ' ':
                case 'ArrowDown':
                case 'ArrowRight':
                case 'PageDown':
                    if (para + 1 < paragraphs.length)
                        setPara(para + 1);
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                case 'Backspace':
                case 'PageUp':
                    if (para > 0)
                        setPara(para - 1);
                    break;
                case 'Home':
                    setPara(0);
                    break;
                case 'End':
                    setPara(paragraphs.length - 1);
                    break;
                default:
                    return;
            }
            event.preventDefault();
        };

        addEventListener('keydown', handler);
        return () => removeEventListener('keydown', handler)
    }, [display, para, paragraphs]);
    
    useEffect(() => {
        pRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'})
    })

    return display ? html`<div class="text-page">${
        paragraphs.map((e, i) => html`
            <p className=${`${i === para ? 'selected' : ''}`} ref=${i === para ? pRef : undefined}>${e}</p>
        `)
    }</div><div class="overlay" />` : html`<div class="prompt-page">
        <textarea value=${text} onInput=${event => setText(event.target.value)} />
        <button onClick=${() => setDisplay(true)}>Go</button>
    </div>`;
}

render(html`<${App} />`, document.body);

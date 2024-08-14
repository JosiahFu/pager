import { html, render, useState, useEffect, useRef } from 'https://unpkg.com/htm/preact/standalone.module.js'

function App() {
    /**
     * @type {{current: HTMLParagraphElement}}
     */
    const pRef = useRef(null);
    /**
     * @type {{current: HTMLTextAreaElement}}
     */
    const textareaRef = useRef(null);

    const [display, setDisplay] = useState(false);
    const [text, setText] = useState('');

    const [para, setPara] = useState(0);

    const paragraphs = text.split('\n\n').filter(e => e.trim() !== '').map(e => e.split('\n').map((e, i, {length}) => i + 1 === length ? e : html`${e}<br />`));

    useEffect(() => {
        if (!display)
            textareaRef.current?.focus();
    }, [display]);
    
    useEffect(() => {
        if (!display) return;

        const next = () => setPara(para => para + 1 < paragraphs.length ? para + 1 : para);

        const last = () => setPara(para => para > 0 ? para - 1 : para);

        const keydownHandler = event => {
            switch(event.key) {
                case 'Enter':
                case ' ':
                case 'ArrowDown':
                case 'ArrowRight':
                case 'PageDown':
                    next();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                case 'Backspace':
                case 'PageUp':
                    last();
                    break;
                case 'Home':
                    setPara(0);
                    break;
                case 'End':
                    setPara(paragraphs.length - 1);
                    break;
                case 'Escape':
                    setDisplay(false);
                    setPara(0);
                    break;
                default:
                    return;
            }
            event.preventDefault();
        };

        const wheelHandler = event => {
            if (event.deltaY < 0) {
                last();
            } else if (event.deltaY > 0) {
                next();
            }
        };

        window.addEventListener('keydown', keydownHandler);
        window.addEventListener('wheel', wheelHandler);

        return () => {
            window.removeEventListener('keydown', keydownHandler);
            window.removeEventListener('wheel', wheelHandler);
        };
    }, [display, paragraphs]);
    
    useEffect(() => {
        pRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'})
    });

    const handleInputKey = event => {
        if (event.ctrlKey && event.key == 'Enter') {
            event.preventDefault();
            setDisplay(true);
        }
    };

    return display ? html`<div class="text-page">${
        paragraphs.map((e, i) => html`
            <p className=${`${i === para ? 'selected' : ''}`} ref=${i === para ? pRef : undefined}>${e}</p>
        `)
    }</div><div class="overlay" />` : html`<div class="prompt-page">
        <textarea ref=${textareaRef} autofocus value=${text} onInput=${event => setText(event.target.value)} onKeydown=${handleInputKey} />
        <button onClick=${() => setDisplay(true)}>Go</button>
    </div>`;
}

render(html`<${App} />`, document.body);

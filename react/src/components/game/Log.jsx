import { useRef,useEffect } from "react";

const Log = ({ log }) => {
    const lastRef = useRef(null);

    useEffect(() => {
        lastRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [log]);
    return (
        <article className="log-section">
            <section className="log">
                {log.map((text, index) => (
                    <p key={index}>{text}</p>
                ))}
            <div ref={lastRef} />
            </section>
        </article>
    )
}

export default Log
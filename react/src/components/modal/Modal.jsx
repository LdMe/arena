
import "./Modal.css"
const Modal = ({ children,className="", onClose }) => {

    const handleStopPropagation = (e) => {
        e.stopPropagation();
    }
    return (
        <div className={"modal "+className} onClick={onClose}>
            <div className={"modal-body "+className} onClick={handleStopPropagation}>
                <div className="modal-header">
                    <button onClick={onClose} className="modal-button absolute right top">X</button>
                </div>
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal;
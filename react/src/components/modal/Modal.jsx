
import "./Modal.css"
const Modal = ({children,onClose}) =>{
    
    const handleStopPropagation = (e)=>{
        e.stopPropagation();
    }
    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-body" onClick={handleStopPropagation}>
                <div className="modal-header">
                    <button onClick={onClose} className="modal-button absolute right top">X</button>
                </div>
                {children}
            </div>
        </div>
    )
}

export default Modal;
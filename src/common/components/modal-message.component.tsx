import React, { useContext, useRef } from "react";
import { AppContext } from "../contexts/app.context";
import useOnClickOutside from "../hooks/click-outside.hook";
import cancelIcon from "../../public/images/icons/cancel.png";
import okIcon from "../../public/images/icons/ok.png";

function ModalMessageComponent(): React.JSX.Element {
  // Services
  const { message, setMessage } = useContext(AppContext);
  const modal = useRef(null);
  const handleClickOutsideFn = () => {
    setMessage((prev) => ({ ...prev, show: false }));
  };
  useOnClickOutside(
    modal,
    message.onClickOutClose ? handleClickOutsideFn : () => {}
  );

  return (
    <div className={`modal ${message.background ? "modal-bg" : ""} ${message.show ? "is-open" : "modal-close"}`}>
      <div ref={modal} className="modal-container">
        <div className="modal-header">
          <button
            className="close button-close tiny hover-three"
            onClick={
              message.onClose
                ? message.onClose
                : () => setMessage((prev) => ({ ...prev, show: false }))
            }
          >
            X
          </button>
          <p className="text-black huge">{message?.title}</p>
        </div>
        <div className="modal-content">
          {typeof message.description != "string" ? (
            message?.description
          ) : (
            <p className="text-black large">{message.description}</p>
          )}
        </div>
        <div className="modal-footer">
          {message.cancelTitle ? (
            <button
              className="button-cancel medium hover-three"
              onClick={
                message.onCancel
                  ? message.onCancel
                  : () => setMessage((prev) => ({ ...prev, show: false }))
              }
            >
              {message.cancelTitle}
              <img className="icons" src={cancelIcon} />
            </button>
          ) : (
            <></>
          )}
          {message.OkTitle ? (
            <button
              className="button-ok medium hover-three"
              onClick={
                message.onOk
                  ? message.onOk
                  : () => setMessage((prev) => ({ ...prev, show: false }))
              }
            >
              {message.OkTitle}
              <img className="icons" src={okIcon} />
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ModalMessageComponent);

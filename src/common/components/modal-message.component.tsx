import React, { useContext, useRef } from "react";
import { AppContext } from "../contexts/app.context";
import useOnClickOutside from "../hooks/click-outside.hook";

function ModalMessageComponent(): React.JSX.Element {
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
    <div className={`modal modal-bg ${message.show ? "is-open" : "modal-close"}` }>
      <div ref={modal} className="modal-container">
        <div className="modal-header">
          <div className="content-button-header">
            {
              message.titleBack && (
                <button
                  className="close button-back tiny hover-three"
                  onClick={
                    message.onBack
                      ? message.onBack
                      : () => setMessage((prev) => ({ ...prev, show: false }))
                  }
                >
                  {message.titleBack}
                </button>
              )
            }
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

          </div>
          <p >{message?.title}</p>
        </div>
        <div className="modal-content">
          {typeof message.description != "string" ? (
            message?.description
          ) : (
            <p className="text-black-2 large break-word">{message.description}</p>
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

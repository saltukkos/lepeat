import React, { useState, useRef } from 'react';
import {CToast, CToastBody, CToaster} from '@coreui/react';
import ToastContext from "./ToastContext";

const ToastProvider = ({ children }) => {
  const [toast, addToast] = useState(0);
  const toaster = useRef();

    const showToast = (message, color) => {
        addToast((
            <CToast autohide={true} delay={2000} color={color}>
                <CToastBody>{message}</CToastBody>
            </CToast>
        ));
    };

    return (
      <ToastContext.Provider value={{ showToast }}>
        <CToaster className="mb-1" ref={toaster} push={toast} placement="bottom-center" />
        {children}
      </ToastContext.Provider>
  );
};

export default ToastProvider;
import React from 'react';

type ColorTypes = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark' | 'light';

const initialState = {
  showToast: (data: string, color: ColorTypes = 'primary') => null,
};

const ToastContext = React.createContext(initialState);

export default ToastContext;
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { Provider } from 'react-redux';
import { appStore } from './app/store';
import { Toaster } from 'sonner';

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <Provider store={appStore}>
      <App className='dark:bg-[#0A0A0A]/80'/>
      <Toaster />
    </Provider>
  </StrictMode>
);

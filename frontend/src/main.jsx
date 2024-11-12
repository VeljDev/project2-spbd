import React from 'react';
import ReactDom from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from "@chakra-ui/react";
import App from './App.jsx';
import queryClient from './config/queryClient.js';
import theme from './theme/index.js';

ReactDom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={ theme }>
      <QueryClientProvider client={queryClient}>  
        <BrowserRouter>
          <App />
          <ReactQueryDevtools position="bottom" initialIsOpen={false} />
        </BrowserRouter>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);

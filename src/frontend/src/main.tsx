import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './pages/Home/Home'
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from '@tanstack/react-query';
import './index.css'

const queryClient = new QueryClient();
const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <Home />
    </PersistQueryClientProvider>
  </React.StrictMode>,
)

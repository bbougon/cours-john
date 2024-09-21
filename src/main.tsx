import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Artists from './domaine/Artists.tsx';
import {Layout} from "./components/Layout.tsx";
import {ArtistsProvider} from "./provider/ArtistsProvider.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ArtistsProvider>
      <Layout>
        <Artists />
      </Layout>
      </ArtistsProvider>
  </StrictMode>
);

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import {Layout} from "./components/Layout.tsx";
import {ArtistsProvider} from "./provider/ArtistsProvider.tsx";
import {BookmarkProvider} from "./provider/BookmarkProvider.tsx";
import Artists from "./domaine/class/Artists.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ArtistsProvider>
          <BookmarkProvider>
      <Layout>
        <Artists />
      </Layout>
          </BookmarkProvider>
      </ArtistsProvider>
  </StrictMode>
);

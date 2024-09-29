import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Layout } from './components/Layout.tsx';
import { ArtistsProvider } from './provider/ArtistsProvider.tsx';
import { BookmarksProvider } from './provider/BookmarksProvider.tsx';
import Artists from './domaine/class/Artists.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Bookmarks } from './domaine/bookmark/Bookmarks.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ArtistsProvider>
        <BookmarksProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Artists />} />
              <Route path="bookmarks" element={<Bookmarks />} />
            </Route>
          </Routes>
        </BookmarksProvider>
      </ArtistsProvider>
    </BrowserRouter>
  </StrictMode>
);

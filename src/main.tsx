import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Layout } from './components/Layout.tsx';
import { ArtistsProvider } from './provider/ArtistsProvider.tsx';
import { BookmarksProvider } from './provider/BookmarksProvider.tsx';
import Artists from './domaine/class/Artists.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Bookmarks } from './domaine/bookmark/Bookmarks.tsx';
import { LastVideos } from './domaine/last-videos/LastVideos.tsx';
import { LastVideosProvider } from './provider/LastVideosProvider.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { DisplayErrorComponent } from './components/DisplayErrorComponent.tsx';
import { About } from './views/About.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={DisplayErrorComponent}>
      <ArtistsProvider>
        <BookmarksProvider>
          <LastVideosProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Artists />} />
                  <Route path="bookmarks" element={<Bookmarks />} />
                  <Route path="last-videos" element={<LastVideos />} />
                  <Route path="about" element={<About />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </LastVideosProvider>
        </BookmarksProvider>
      </ArtistsProvider>
    </ErrorBoundary>
  </StrictMode>
);

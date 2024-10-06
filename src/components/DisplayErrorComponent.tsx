import { FallbackProps, useErrorBoundary } from 'react-error-boundary';
import { Header } from './Header.tsx';
import { Footer } from './Footer.tsx';

export type DisplayError = {
  message: string;
  reason: string[];
  additionalMessage: string[];
};

type DisplayErrorComponentPorperties = Omit<FallbackProps, 'error'> & {
  error: DisplayError;
};

export const DisplayErrorComponent = ({
  error,
}: DisplayErrorComponentPorperties) => {
  const { resetBoundary } = useErrorBoundary();
  return (
    <>
      <Header />

      <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <div
          className="col-start-2 mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <div className="flex items-center">
            <svg
              className="me-2 h-4 w-4 flex-shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Danger</span>
            <h3 className="text-lg font-medium">{error.message}</h3>
          </div>
          <div className="mb-4 mt-2 text-sm">
            <ul className="mt-1.5 list-inside list-disc">
              {error.reason.map((r) => (
                <li key={crypto.randomUUID()}>{r}</li>
              ))}
            </ul>
            <ul className="mt-1.5 list-inside list-disc">
              {error.additionalMessage.map((a) => (
                <li key={crypto.randomUUID()}>{a}</li>
              ))}
            </ul>
          </div>
          <div className="flex">
            <button
              onClick={resetBoundary}
              type="button"
              className="rounded-lg border border-red-800 bg-transparent px-3 py-1.5 text-center text-xs font-medium text-red-800 hover:bg-red-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-600 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-800"
              aria-label="Close"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

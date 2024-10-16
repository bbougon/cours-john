import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="m-4 h-10 rounded-lg bg-white shadow dark:bg-gray-800">
      <div className="mx-auto w-full max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2024{' '}
          <a href="https://cours-john.ajairu.fr/" className="hover:underline">
            Cours John™
          </a>
          . All Rights Reserved.
        </span>
        <ul className="mt-3 flex flex-wrap items-center text-sm font-medium text-gray-500 sm:mt-0 dark:text-gray-400">
          <li>
            <Link to="/about" className="me-4 hover:underline md:me-6">
              About
            </Link>
          </li>
          <li>
            <Link
              to="https://www.youtube.com/t/terms"
              target="_blank"
              className="me-4 hover:underline md:me-6"
            >
              Youtube Terms of Service
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
};

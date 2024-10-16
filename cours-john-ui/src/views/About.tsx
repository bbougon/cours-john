import { Link } from 'react-router-dom';

export const About = () => {
  return (
    <div className="relative isolate mt-12 overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width="200"
              height="200"
              x="50%"
              y="-1"
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y="-1" className="overflow-visible fill-gray-50">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth="0"
            />
          </svg>
          <rect
            width="100%"
            height="100%"
            strokeWidth="0"
            fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
          />
        </svg>
      </div>
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <p className="text-base font-semibold leading-7 text-indigo-600">
                About John Guitar Classes
              </p>
              <p className="mt-6 text-xl leading-8 text-gray-700">
                John Guitar Classes is a web application using the{' '}
                <Link
                  to="https://developers.google.com/youtube/v3/getting-started"
                  className="text-slate-400 underline decoration-solid hover:text-slate-500"
                >
                  Youtube API
                </Link>{' '}
                in order to provide an easy way to its students to search for
                guitar classes videos.
              </p>
            </div>
          </div>
        </div>
        <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
          <img
            className="w-[48rem] max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
            src="https://yt3.googleusercontent.com/sC9HMhx-k31NmgmF1ojr5UpGUFScwtR1fI2nxm6usUk9NAeymoMujkCiNJIg987eLGdEZqY_Heo=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj"
            alt=""
          />
        </div>
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
              <ul role="list" className="mt-8 space-y-8 text-gray-600">
                <li className="flex gap-x-3">
                  <svg
                    className="mr-2 h-12 w-12"
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    width="234.66667"
                    height="165.33333"
                    viewBox="0 0 234.66667 165.33333"
                  >
                    <defs id="defs6" />
                    <g
                      id="g8"
                      transform="matrix(1.3333333,0,0,-1.3333333,0,165.33333)"
                    >
                      <g id="g10" transform="scale(0.1)">
                        <path
                          d="m 1723.22,1046.37 c -20.24,76.22 -79.87,136.24 -155.6,156.61 C 1430.37,1240 880,1240 880,1240 c 0,0 -550.367,0 -687.621,-37.02 C 116.656,1182.61 57.0156,1122.59 36.7773,1046.37 0,908.227 0,620 0,620 0,620 0,331.777 36.7773,193.621 57.0156,117.41 116.656,57.3906 192.379,37.0117 329.633,0 880,0 880,0 c 0,0 550.37,0 687.62,37.0117 75.73,20.3789 135.36,80.3983 155.6,156.6093 C 1760,331.777 1760,620 1760,620 c 0,0 0,288.227 -36.78,426.37"
                          fill="#ed1d24"
                          fillOpacity="1"
                          fillRule="nonzero"
                          stroke="none"
                          id="path12"
                        />
                        <path
                          d="m 700,358.313 460,261.675 -460,261.7 z"
                          fill="#ffffff"
                          fillOpacity="1"
                          fillRule="nonzero"
                          stroke="none"
                          id="path14"
                        />
                      </g>
                    </g>
                  </svg>
                  <span>
                    <strong className="font-semibold text-gray-900">
                      Videos hosted on Youtube.
                    </strong>{' '}
                    All the videos are from this{' '}
                    <Link
                      to="https://www.youtube.com/@ik4dz"
                      target="_blank"
                      className="text-slate-400 underline decoration-solid hover:text-slate-500"
                    >
                      channel
                    </Link>
                    .
                    <br />
                    This website uses the{' '}
                    <Link
                      to="https://developers.google.com/youtube/terms/developer-policies#definition-youtube-api-services"
                      target="_blank"
                      className="text-slate-400 underline decoration-solid hover:text-slate-500"
                    >
                      Youtube API services
                    </Link>
                    .
                    <br />
                    <Link
                      to="http://www.google.com/policies/privacy"
                      target="_blank"
                      className="text-slate-400 underline decoration-solid hover:text-slate-500"
                    >
                      Google Privacy Policy
                    </Link>
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <svg
                    className="mr-2 h-12 w-12"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>
                    <strong className="font-semibold text-gray-900">
                      Source code hosted on github.
                    </strong>{' '}
                    The source code is hosted on github on this{' '}
                    <Link
                      to="https://github.com/bbougon/cours-john"
                      target="_blank"
                      className="text-slate-400 underline decoration-solid hover:text-slate-500"
                    >
                      repository
                    </Link>
                    .
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <svg
                    className="mr-2 h-12 w-12"
                    viewBox="0 0 128 113"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_236_138)">
                      <path
                        d="M34.593 94.0509H33.3844L27.3514 88.0179V86.8094L36.5743 77.5866H42.9639L43.8158 78.4385V84.8281L34.593 94.0509Z"
                        fill="#05BDBA"
                      />
                      <path
                        d="M27.3514 25.816V24.6074L33.3844 18.5744H34.593L43.8158 27.7972V34.1868L42.9639 35.0388H36.5743L27.3514 25.816Z"
                        fill="#05BDBA"
                      />
                      <path
                        d="M80.4594 74.6047H71.6824L70.9493 73.8717V53.3259C70.9493 49.6705 69.5129 46.8372 65.1046 46.7382C62.836 46.6787 60.2405 46.7382 57.4668 46.8471L57.0507 47.2731V73.8618L56.3176 74.5948H47.5406L46.8075 73.8618V38.7636L47.5406 38.0305H67.2939C74.9713 38.0305 81.1925 44.2517 81.1925 51.9291V73.8717L80.4594 74.6047Z"
                        fill="#014847"
                      />
                      <path
                        d="M35.8412 61.4491H0.73307L0 60.716V51.9192L0.73307 51.1861H35.8412L36.5743 51.9192V60.716L35.8412 61.4491Z"
                        fill="#05BDBA"
                      />
                      <path
                        d="M127.277 61.4491H92.1687L91.4356 60.716V51.9192L92.1687 51.1861H127.277L128.01 51.9192V60.716L127.277 61.4491Z"
                        fill="#05BDBA"
                      />
                      <path
                        d="M58.9428 27.0642V0.73307L59.6759 0H68.4727L69.2058 0.73307V27.0642L68.4727 27.7972H59.6759L58.9428 27.0642Z"
                        fill="#05BDBA"
                      />
                      <path
                        d="M58.9428 111.902V85.5711L59.6759 84.838H68.4727L69.2058 85.5711V111.902L68.4727 112.635H59.6759L58.9428 111.902Z"
                        fill="#05BDBA"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_236_138">
                        <rect width="128" height="112.635" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span>
                    <strong className="font-semibold text-gray-900">
                      Hosted on netlify.
                    </strong>{' '}
                    The website is hosted on{' '}
                    <Link
                      to="https://www.netlify.com/"
                      target="_blank"
                      className="text-slate-400 underline decoration-solid hover:text-slate-500"
                    >
                      netlify
                    </Link>{' '}
                    and deployed from Github.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="mr-2 h-16 w-16"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                    />
                  </svg>

                  <span>
                    <strong className="font-semibold text-gray-900">
                      User privacy.
                    </strong>{' '}
                    No personal information and / or data are stored or shared
                    on this website. We only use the browser local storage to
                    store the bookmarked videos.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

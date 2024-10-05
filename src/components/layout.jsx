export default function Layout({ children }) {
  return (
    <>
      <div
        className="flex flex-col justify-center items-center py-5 px-5"
        style={{
          minHeight: "91vh",
        }}
      >
        {children}
      </div>

      <footer className="text-center text-gray-600 text-sm flex flex-col justify-center items-center mb-2">
        <p>
          Made by{" "}
          <a
            className="font-semibold"
            target="_blank"
            rel="noopener"
            href="https://swaflix.xyz"
          >
            SWAFLIX
          </a>{" "}
          with{" "}
          <a
            className="font-semibold"
            target="_blank"
            rel="noopener"
            href="https://vitejs.dev/"
          >
            React+Vite
          </a>
        </p>
        <div className="flex items-center gap-2 mt-2">
          <a
            href="https://swaflix.xyz"
            target="_blank"
            rel="noopener"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
            >
              <path d="" />
            </svg>
          </a>

          <a
            href="https://gd.swaflix.xyz"
            target="_blank"
            rel="noopener"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 26.245 26.256"
              width={24}
              height={24}
            >
              <path
                d="M26.254 13.128c0 7.253-5.875 13.128-13.128 13.128S-.003 20.382-.003 13.128 5.872 0 13.125 0s13.128 5.875 13.128 13.128"
                fill="#000"
              />
              <path
                d="M14.876 13.128h-3.72V9.2h3.72c1.083 0 1.97.886 1.97 1.97s-.886 1.97-1.97 1.97m0-6.564H8.53v13.128h2.626v-3.938h3.72c2.538 0 4.595-2.057 4.595-4.595s-2.057-4.595-4.595-4.595"
                fill="#fff"
              />
            </svg>
          </a>
        </div>
      </footer>
    </>
  );
}

import { useState, useEffect } from "react"; // Added useEffect for URL handling
import { toast } from "react-hot-toast";
import { ERROR, PLAYLIST, SEGMENT } from "../constant";
import parseHls from "../lib/parseHls";
import RenderCustomHeaders from "./customHeader";
import Layout from "./layout";
import TextField from "@mui/material/TextField";

export default function HomePage({ seturl, setheaders }) {
  const [text, settext] = useState("");
  const [playlist, setplaylist] = useState();
  const [limitationrender, setlimitationrender] = useState(false);
  const [customHeadersRender, setcustomHeadersRender] = useState(false);
  const [customHeaders, setcustomHeaders] = useState({});

  // Fetch URL and title from query string if available
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFromQuery = params.get('url');
    const titleFromQuery = params.get('title');

    if (urlFromQuery) {
      settext(urlFromQuery); // Automatically set URL from query string
      validateAndSetUrl(urlFromQuery); // Auto trigger download
    }

    if (titleFromQuery) {
      document.title = `HLS Downloader - ${titleFromQuery}`; // Set page title with TMDb ID
    } else {
      document.title = "HLS Downloader"; // Default title if no title is found
    }
  }, []);

  function toggleLimitation() {
    setlimitationrender(!limitationrender);
  }

  function toggleCustomHeaders() {
    setcustomHeadersRender(!customHeadersRender);
  }

  function closeQualityDialog() {
    setplaylist();
  }

  async function validateAndSetUrl(urlToValidate) {
    const url = urlToValidate || text; // Use the passed URL or the current input
    toast.loading(`Validating...`, { duration: 800 });
    let data = await parseHls({ hlsUrl: url, headers: customHeaders });
    if (!data) {
      toast.error(`Invalid url, Content possibly not parsed!`);
      return;
    }
    if (data.type === ERROR) {
      toast.error(data.data);
    } else if (data.type === PLAYLIST) {
      if (!data.data.length) {
        toast.error(`No playlist found in the url`);
      } else {
        setplaylist(data.data);
      }
    } else if (data.type === SEGMENT) {
      seturl(url);
      setheaders(customHeaders);
    }
  }

  return (
    <>
      <Layout>
        <h1 className="text-3xl lg:text-4xl font-bold">HLS Downloader</h1>
        <h2 className="mt-2 max-w-xl text-center md:text-base text-sm">
          Download hls videos in your browser. Enter your{" "}
          <code className="border boder-gray-200 bg-gray-100 px-1 rounded-sm">
            .m3u8
          </code>{" "}
          uri to continue.
          <br />
          <span className="cursor-pointer underline" onClick={toggleLimitation}>
            See limitations
          </span>
          {" - "}
          <span
            className="cursor-pointer underline"
            onClick={() => {
              settext("https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8");
            }}
          >
            Try example
          </span>
        </h2>

        <div className="w-full max-w-3xl mt-5 mb-4">
          <TextField
            label="Paste hls url"
            fullWidth
            size="small"
            placeholder="Please note it should be a .m3u8 url"
            value={text}
            onChange={(e) => settext(e.target.value)}
            InputProps={{
              endAdornment: (
                <button
                  className="text-gray-900 hover:text-gray-700 w-max outline-none pl-4"
                  onClick={toggleCustomHeaders}
                >
                  Headers
                </button>
              ),
            }}
          />
        </div>

        <button
          className="px-4 py-1.5 bg-gray-900 hover:bg-gray-700 text-white rounded-md disabled:opacity-50"
          onClick={validateAndSetUrl}
          disabled={typeof SharedArrayBuffer === "undefined"}
        >
          {typeof SharedArrayBuffer === "undefined"
            ? "Browser doesn't support"
            : "Download"}
        </button>

        <i className="max-w-sm text-xs text-gray-500 text-center mt-2.5">
          * by clicking the above <b>Download</b> button you are agreed that you
          won't use this service for piracy.
        </i>

        {playlist && (
          <div>
            {/* Render playlist items here */}
            {playlist.map((item, index) => (
              <div key={index}>
                <a href={item.uri} target="_blank" rel="noopener noreferrer">
                  Download {item.uri}
                </a>
              </div>
            ))}
          </div>
        )}

        <RenderCustomHeaders
          open={customHeadersRender}
          onClose={toggleCustomHeaders}
          setheaders={setcustomHeaders}
        />
      </Layout>
    </>
  );
}

import { Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState, useEffect } from "react"; 
import { toast } from "react-hot-toast";
import { ERROR, PLAYLIST, SEGMENT } from "../constant";
import parseHls from "../lib/parseHls";
import RenderCustomHeaders from "./customHeader";
import Layout from "./layout";

// TMDb API key
const TMDB_API_KEY = '68e094699525b18a70bab2f86b1fa706';

export default function HomePage({ seturl, setheaders }) {
  const [text, settext] = useState("");
  const [playlist, setplaylist] = useState();
  const [title, setTitle] = useState(""); // For storing movie/series title
  const [limitationrender, setlimitationrender] = useState(false);
  const [customHeadersRender, setcustomHeadersRender] = useState(false);
  const [customHeaders, setcustomHeaders] = useState({});

  // Fetch URL and title from query string if available and auto trigger download
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFromQuery = params.get('url');
    const tmdbId = params.get('title'); // Assuming the 'title' param is used for TMDb ID
    if (urlFromQuery) {
      settext(urlFromQuery); 
      validateAndSetUrl(urlFromQuery); // Auto trigger download
    }
    if (tmdbId) {
      fetchTitleFromTmdb(tmdbId);
    }
  }, []);

  // Function to fetch title from TMDb
  async function fetchTitleFromTmdb(id) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`);
    const data = await response.json();
    if (data && data.title) {
      setTitle(data.title);
    } else {
      console.error("Unable to fetch title from TMDb");
    }
  }

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
    const url = urlToValidate || text; 
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
        {/* Display movie/series title */}
        {title && <h2 className="text-2xl mt-2">{title}</h2>}

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
      </Layout>

      <Dialog
        open={playlist !== undefined}
        fullWidth
        maxWidth="sm"
        onClose={closeQualityDialog}
      >
        <DialogTitle className="flex justify-between">
          <span className="text-xl font-bold">Select quality</span>
          <button className="text-sm" onClick={closeQualityDialog}>
            close
          </button>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-wrap justify-center items-center">
            {(playlist || []).map((item) => {
              return (
                <div
                  className="flex justify-between items-center mt-2"
                  key={item.bandwidth}
                >
                  <button
                    className="mr-2 px-2 py-1 rounded-md bg-black text-white"
                    onClick={() => {
                      seturl(item.uri);
                      setheaders(customHeaders);
                    }}
                  >
                    {item.name}
                  </button>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={limitationrender}
        onClose={toggleLimitation}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="flex justify-between">
          <span className="text-xl font-bold">Limitations</span>
          <button className="text-sm" onClick={toggleLimitation}>
            close
          </button>
        </DialogTitle>
        <DialogContent>
          <ol className="list-decimal list-inside text-gray-700">
            {limitations.map((limitation) => (
              <li
                key={limitation}
                dangerouslySetInnerHTML={{ __html: limitation }}
              />
            ))}
          </ol>
        </DialogContent>
      </Dialog>

      <Dialog
        open={customHeadersRender}
        onClose={toggleCustomHeaders}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="flex justify-between">
          <span className="text-xl font-bold">Custom headers</span>
          <button className="text-sm" onClick={toggleCustomHeaders}>
            close
          </button>
        </DialogTitle>
        <DialogContent>
          <RenderCustomHeaders
            customHeaders={customHeaders}
            setcustomHeader={setcustomHeaders}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

const limitations = [
  // Limitations list remains unchanged
];

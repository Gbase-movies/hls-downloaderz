import { Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { ERROR, PLAYLIST, SEGMENT } from "../constant";
import parseHls from "../lib/parseHls";
import RenderCustomHeaders from "./customHeader";
import Layout from "./layout";

export default function HomePage({ seturl, setheaders }) {
  const [text, settext] = useState("");
  const [playlist, setplaylist] = useState();
  const [limitationrender, setlimitationrender] = useState(false);
  const [customHeadersRender, setcustomHeadersRender] = useState(false);
  const [customHeaders, setcustomHeaders] = useState({});

  // Function to extract URL from query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const urlFromParams = queryParams.get("url");
    if (urlFromParams) {
      settext(urlFromParams); // Set the URL automatically
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

  async function validateAndSetUrl() {
    toast.loading(`Validating...`, { duration: 800 });
    let data = await parseHls({ hlsUrl: text, headers: customHeaders });
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
      seturl(text);
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
      </Layout>

      {/* Other dialogs for playlist, limitations, and custom headers */}
    </>
  );
}

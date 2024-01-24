import { useCallback, useEffect, useState, useContext } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { authdata } from "./context/ContextProvider";
import "bootstrap/dist/css/bootstrap.min.css";

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

export default function TextEditor() {
  const { loggedIn, setLoggedIn } = useContext(authdata);
  const documentId = localStorage.getItem("userId");
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const s = io("http://localhost:4001");
      setSocket(s);

      return () => {
        s.disconnect();
      };
    } catch (error) {
      console.error("Error connecting to socket:", error);
    }
  }, []);

  useEffect(() => {
    if (!socket || !quill) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    // Use the correct variable name: documentId instead of id
    socket.emit("get-document", {
      documentId,
    });
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      // Include both user ID and document ID when emitting "save-document" event
      socket.emit("save-document", {
        documentId,
        content: quill.getContents(),
      });
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  const wrapperRef = useCallback((wrapper) => {
    if (!wrapper) return;

    const editor = document.createElement("div");
    wrapper.innerHTML = "";
    wrapper.append(editor);

    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });

    // Use MutationObserver to detect changes in the wrapper and update Quill accordingly
    const observer = new MutationObserver(() => {
      q.update();
    });

    observer.observe(wrapper, { childList: true, subtree: true });

    q.disable();
    q.setText("Loading...");
    setQuill(q);

    // Cleanup the observer when the component is unmounted
    return () => {
      observer.disconnect();
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.clear();
      setLoggedIn(false);
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("userId")) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [loggedIn]);

  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      navigate("/login");
    }
  }, [loggedIn]);

  return (
    <>
      <nav class="d-flex justify-content-start z-1 w-100  sticky-top navbar navbar-light bg-light justify-content-between ">
        <a class="navbar-brand ms-5 fw-bold">Docs Editor</a>
        <form class="form-inline">
          <button
            className=" btn btn-outline-dark me-2 my-2 my-sm-0 me-5"
            onClick={handleLogout}
          >
            Logout
          </button>{" "}
        </form>
      </nav>

      <div className="container" ref={wrapperRef}></div>
    </>
  );
}

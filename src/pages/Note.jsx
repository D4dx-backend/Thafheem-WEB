import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NotePopup from "../components/NotePopup";
import { fetchNoteById } from "../api/apifunction";

const Note = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchNoteById(id);
        if (!mounted) return;
        setContent(data);
      } catch (e) {
        if (!mounted) return;
        setError(e.message || "Failed to load note");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const resolveHtml = () => {
    if (typeof content === "string") return content;
    if (content && typeof content === "object") {
      return content.NoteText || content.html || content.content || content.text || JSON.stringify(content);
    }
    return "<p>No content</p>";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#2A2C38]">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-medium text-[#2AA0BF]">Note {id}</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1.5 rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Back
          </button>
        </div>

        {loading && <div className="text-gray-600 dark:text-gray-300">Loading…</div>}
        {error && <div className="text-red-600 dark:text-red-400">{error}</div>}

        {!loading && !error && (
          <div
            className="prose prose-sm dark:prose-invert max-w-none text-gray-800 dark:text-white"
            dangerouslySetInnerHTML={{ __html: resolveHtml() }}
            style={{

              fontFamily: "NotoSansMalayalam, sans-serif",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Note;



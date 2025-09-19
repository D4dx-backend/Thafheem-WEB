import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams, useParams } from "react-router-dom";
import InterpretationNavbar from "../components/InterpretationNavbar";
import { fetchInterpretation, fetchInterpretationRange, listSurahNames, fetchSurahs } from "../api/apifunction";
import BookmarkService from "../services/bookmarkService";
import { useAuth } from "../context/AuthContext";

// This page renders block-wise interpretation for a surah/verse range
// URL expected (query params): ?surahId=114&range=1-6&ipt=1&lang=en
const InterpretationBlockwise = (props) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const routeParams = useParams();

  // Read params from query string or location.state
  const initialParams = useMemo(() => {
    const state = location.state || {};
    return {
      surahId: parseInt(
        props.surahId || searchParams.get("surahId") || state.surahId || routeParams.surahId || 1
      ),
      range: props.range || searchParams.get("range") || state.range || "1-7",
      ipt: parseInt(props.ipt || searchParams.get("ipt") || state.ipt || 1),
      lang: props.lang || searchParams.get("lang") || state.lang || "en",
    };
  }, [location.state, searchParams, routeParams]);

  const [surahId, setSurahId] = useState(initialParams.surahId);
  const [range, setRange] = useState(initialParams.range);
  const [iptNo, setIptNo] = useState(initialParams.ipt);
  const [lang, setLang] = useState(initialParams.lang);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [content, setContent] = useState([]);
  const [surahDisplayName, setSurahDisplayName] = useState("");
  const { user } = useAuth?.() || { user: null };
  const [isBookmarking, setIsBookmarking] = useState(false);
  const [surahOptions, setSurahOptions] = useState([]);
  const [rangeOptions, setRangeOptions] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // Decide between single verse vs range (e.g., "5" vs "1-7")
        const isSingle = /^\d+$/.test(range);
        const data = isSingle
          ? await fetchInterpretation(surahId, parseInt(range, 10), iptNo, lang)
          : await fetchInterpretationRange(surahId, range, iptNo, lang);

        // Normalize to array of items with a text/content field
        const items = Array.isArray(data) ? data : [data];
        setContent(items);
      } catch (err) {
        setError(err.message || "Failed to load interpretation");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [surahId, range, iptNo, lang]);

  // Load surah English name for navbar display
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const names = await listSurahNames();
        if (!mounted) return;
        setSurahOptions(names.map(n => ({ value: n.id, label: `${n.id}- ${n.english || 'Surah'}` })));
        const found = names.find((s) => s.id === Number(surahId));
        if (mounted) setSurahDisplayName(`${surahId}- ${found?.english || "Surah"}`);
      } catch (_) {
        if (mounted) setSurahDisplayName(`${surahId}- Surah`);
      }
    })();
    return () => { mounted = false; };
  }, [surahId]);

  // Build range options for current surah (1..total ayahs)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const surahs = await fetchSurahs();
        if (!mounted) return;
        const current = surahs.find(s => s.number === Number(surahId));
        const total = current?.ayahs || 286;
        const allAyahs = Array.from({ length: total }, (_, i) => String(i + 1));
        setRangeOptions(allAyahs);
      } catch (e) {
        // fallback to 1..50
        if (mounted) setRangeOptions(Array.from({ length: 50 }, (_, i) => String(i + 1)));
      }
    })();
    return () => { mounted = false; };
  }, [surahId]);

  const handleSelectSurah = () => {};
  const handleSelectRange = () => {};

  const handlePickSurah = (value) => {
    setSurahId(parseInt(value, 10));
  };

  const handlePickRange = (value) => {
    setRange(String(value));
  };

  const handlePrev = () => {
    // if range is a single ayah, decrement; if a-b, move to previous block
    const current = String(range);
    if (/^\d+$/.test(current)) {
      const v = Math.max(1, parseInt(current, 10) - 1);
      setRange(String(v));
    } else if (/^(\d+)-(\d+)$/.test(current)) {
      const [, aStr, bStr] = current.match(/(\d+)-(\d+)/) || [];
      const a = parseInt(aStr, 10);
      const b = parseInt(bStr, 10);
      const len = b - a + 1;
      const newA = Math.max(1, a - len);
      const newB = Math.max(len, b - len);
      setRange(`${newA}-${newB}`);
    }
  };

  const handleNext = () => {
    const current = String(range);
    if (/^\d+$/.test(current)) {
      setRange(String(parseInt(current, 10) + 1));
    } else if (/^(\d+)-(\d+)$/.test(current)) {
      const [, aStr, bStr] = current.match(/(\d+)-(\d+)/) || [];
      const a = parseInt(aStr, 10);
      const b = parseInt(bStr, 10);
      const len = b - a + 1;
      setRange(`${a + len}-${b + len}`);
    }
  };

  const handleBookmark = async () => {
    try {
      setIsBookmarking(true);
      // For blockwise page we bookmark the first ayah of the current range as interpretation
      const firstAyah = /^\d+/.exec(String(range))?.[0] || "1";
      const userId = BookmarkService.getEffectiveUserId(user);
      await BookmarkService.addAyahInterpretationBookmark(
        userId,
        surahId,
        parseInt(firstAyah, 10),
        surahDisplayName
      );
      if (typeof props.showSuccess === 'function') {
        props.showSuccess(`Saved interpretation for ${surahId}:${firstAyah}`);
      }
    } catch (e) {
      console.error("Failed to bookmark interpretation", e);
      if (typeof props.showError === 'function') {
        props.showError('Failed to save interpretation bookmark');
      }
    } finally {
      setTimeout(() => setIsBookmarking(false), 300);
    }
  };

  const handleShare = async () => {
    const shareText = `Interpretation ${iptNo} — Surah ${surahId} • Range ${range}`;
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: document.title || "Thafheem", text: shareText, url: shareUrl });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert("Link copied to clipboard");
      }
    } catch (e) {
      console.error("Share failed", e);
    }
  };

  const extractText = (item) => {
    if (item == null) return "";
    if (typeof item === "string") return item;
    // Common possible fields
    const preferredKeys = [
      "interpret_text",
      "interpretation",
      "text",
      "content",
      "meaning",
      "body",
      "desc",
      "description",
    ];
    for (const key of preferredKeys) {
      if (typeof item[key] === "string" && item[key].trim().length > 0) return item[key];
    }
    // Fallback: first long string field
    for (const [k, v] of Object.entries(item)) {
      if (typeof v === "string" && v.trim().length > 20) return v;
    }
    // Final fallback
    try { return JSON.stringify(item); } catch { return String(item); }
  };

  return (
    <>
      <InterpretationNavbar
        interpretationNumber={iptNo}
        surahName={surahDisplayName}
        verseRange={range.replace(/-/g, " - ")}
        backTo={location.state?.from || undefined}
        onClose={props.onClose || location.state?.onClose}
        onSelectSurah={handleSelectSurah}
        onSelectRange={handleSelectRange}
        onBookmark={handleBookmark}
        onShare={handleShare}
        bookmarking={isBookmarking}
        surahOptions={surahOptions}
        rangeOptions={rangeOptions}
        onPickSurah={handlePickSurah}
        onPickRange={handlePickRange}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-[#2A2C38]">
        {/* Header controls (read-only display) */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
          <span>Surah: {surahId}</span>
          <span>• Range: {range}</span>
          <span>• Interpretation: {iptNo}</span>
          <span>• Lang: {lang}</span>
        </div>

        {loading && (
          <div className="text-center py-8 text-gray-600 dark:text-gray-300">Loading interpretation…</div>
        )}

        {error && (
          <div className="text-red-600 dark:text-red-400 py-4">{error}</div>
        )}

        {!loading && !error && content.length === 0 && (
          <div className="text-center py-10 text-gray-600 dark:text-gray-300">No interpretation found for this selection.</div>
        )}

        {/* Content */}
        <div className="space-y-6">
          {content.map((item, idx) => (
            <div
              key={idx}
              className="bg-gray-50 p-6 rounded-lg border-l-4 dark:bg-[#2A2C38] dark:border-[#2A2C38] border-white"
            >
              <p className="text-gray-800 dark:text-white leading-relaxed text-justify whitespace-pre-wrap">
                {extractText(item)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default InterpretationBlockwise;

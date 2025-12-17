import React, { useMemo } from "react";
import {
  useLocation,
  useSearchParams,
  useParams,
  useNavigate,
} from "react-router-dom";
import BlockInterpretationModal from "../components/BlockInterpretationModal";

// This page renders block-wise interpretation as a modal overlay
// URL expected (query params): ?surahId=114&range=1-6&ipt=1&lang=en
const InterpretationBlockwise = (props) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const routeParams = useParams();
  const navigate = useNavigate();

  // Read params from query string or location.state
  const initialParams = useMemo(() => {
    const state = location.state || {};
    return {
      surahId: parseInt(
        props.surahId ||
        searchParams.get("surahId") ||
        state.surahId ||
        routeParams.surahId ||
        1
      ),
      range: props.range || searchParams.get("range") || state.range || "1-7",
      // Keep interpretation token as-is (e.g. "199A"), don't coerce to number
      ipt: props.ipt || searchParams.get("ipt") || state.ipt || "1",
      lang: props.lang || searchParams.get("lang") || state.lang || "mal",
      footnoteId: props.footnoteId || searchParams.get("footnoteId") || state.footnoteId || null,
      interpretationId: props.interpretationId || searchParams.get("interpretationId") || state.interpretationId || null,
    };
  }, [
    location.state,
    searchParams,
    routeParams,
    props.surahId,
    props.range,
    props.ipt,
    props.lang,
    props.footnoteId,
    props.interpretationId,
  ]);

  const handleClose = () => {
    // If onClose prop is provided (e.g., from BlockWise), use it instead of navigating
    if (props.onClose) {
      props.onClose();
      return;
    }
    
    // Otherwise, navigate back to previous page or home
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <BlockInterpretationModal
      surahId={initialParams.surahId}
      range={initialParams.range}
      interpretationNo={initialParams.ipt}
      language={initialParams.lang}
      footnoteId={initialParams.footnoteId}
      interpretationId={initialParams.interpretationId}
      onClose={handleClose}
      blockRanges={props.blockRanges}
    />
  );
};

export default InterpretationBlockwise;

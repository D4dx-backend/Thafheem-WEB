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
      ipt: parseInt(props.ipt || searchParams.get("ipt") || state.ipt || 1),
      lang: props.lang || searchParams.get("lang") || state.lang || "mal",
    };
  }, [
    location.state,
    searchParams,
    routeParams,
    props.surahId,
    props.range,
    props.ipt,
    props.lang,
  ]);

  const handleClose = () => {
    // Navigate back to previous page or home
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
      onClose={handleClose}
    />
  );
};

export default InterpretationBlockwise;

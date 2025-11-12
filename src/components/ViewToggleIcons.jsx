import ayahwiseIcon from "../assets/ayahwise.png";
import blockwiseIcon from "../assets/blockwise.png";

const baseImageProps = {
  alt: "",
  draggable: false,
  "aria-hidden": "true",
};

export const AyahViewIcon = ({ className }) => (
  <img src={ayahwiseIcon} className={className} {...baseImageProps} />
);

export const BlockViewIcon = ({ className }) => (
  <img src={blockwiseIcon} className={className} {...baseImageProps} />
);

export default {
  AyahViewIcon,
  BlockViewIcon,
};


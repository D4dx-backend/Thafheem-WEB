import { useEffect } from 'react';

/**
 * Ensures English footnote chips display sequential numbers (1,2,3...) per context.
 * Only affects UI text content; underlying data attributes remain untouched.
 */
const useSequentialEnglishFootnotes = ({
  enabled = false,
  context = '',
  dependencies = [],
} = {}) => {
  useEffect(() => {
    if (!enabled || !context) {
      return undefined;
    }

    const selector = `[data-footnote-context="${context}"] .english-footnote-link`;
    const nodes = Array.from(document.querySelectorAll(selector));

    if (nodes.length === 0) {
      return undefined;
    }

    const previousValues = nodes.map((node) => {
      const original =
        node.getAttribute('data-original-footnote-number') ||
        node.textContent?.trim() ||
        '';
      node.setAttribute('data-original-footnote-number', original);
      return { node, original };
    });

    let counter = 1;
    nodes.forEach((node) => {
      node.textContent = String(counter);
      node.setAttribute('data-display-footnote-number', String(counter));
      counter += 1;
    });

    return () => {
      previousValues.forEach(({ node, original }) => {
        if (node.isConnected && original !== undefined) {
          node.textContent = original;
          node.removeAttribute('data-display-footnote-number');
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, context, ...dependencies]);
};

export default useSequentialEnglishFootnotes;



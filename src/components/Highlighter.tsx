import "./Hightlighter.scss";

import clsx from "clsx";

export default function Highlighter({ needle, haystack }: { needle: string; haystack: string }) {
  type Chunk = { highlight: boolean; text: string };

  const chunks: Chunk[] = [];

  // similar to `fuzzysearch` matching
  let n = 0;
  let h = 0;
  while (h < haystack.length) {
    const nch = needle.charAt(n);
    const hch = haystack.charAt(h++);

    let highlight;
    if (nch && nch.toLowerCase() === hch.toLowerCase()) {
      highlight = false;
      n++;
    } else {
      highlight = true;
    }

    const chunk = chunks[chunks.length - 1];
    if (chunk && chunk.highlight === highlight) {
      chunk.text += hch;
    } else {
      chunks.push({ highlight, text: hch });
    }
  }

  return (
    <div className="Highlighter">
      {chunks.map(({ highlight, text }, index) => (
        <span key={index} className={clsx({ highlight })}>
          {text}
        </span>
      ))}
    </div>
  );
}

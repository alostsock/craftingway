/**
 * Slightly modified from https://github.com/bevacqua/fuzzysearch
 *
 * Note that every character in `needle` must be present in `haystack`. Returns
 * a score such that 0 < score <= 2.0
 */
export function fuzzysearch(needle: string, haystack: string): number {
  const nlen = needle.length;
  const hlen = haystack.length;

  if (nlen > hlen) {
    return 0;
  }

  if (nlen === hlen) {
    return needle === haystack ? 2.0 : 0;
  }

  const matchOffsets = [];

  // the inner loop should only terminate if there isn't a match,
  // since haystack.length > needle.length
  outer: for (let n = 0, h = 0; n < nlen; n++) {
    const nch = needle.charCodeAt(n);

    while (h < hlen) {
      if (haystack.charCodeAt(h++) === nch) {
        matchOffsets.push(h);
        continue outer;
      }
    }

    return 0;
  }

  let distance_between_matches = 0;
  for (let i = matchOffsets.length - 1; i > 0; i--) {
    distance_between_matches += matchOffsets[i] - matchOffsets[i - 1] - 1;
  }

  // each bonus should be between 0 and 1
  const length_bonus = nlen / hlen;
  const distance_bonus = 1 - distance_between_matches / hlen;

  // arbitrary weights lol
  const score = 0.6 * length_bonus + 1.4 * distance_bonus;
  return score;
}

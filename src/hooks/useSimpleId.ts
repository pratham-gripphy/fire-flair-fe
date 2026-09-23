import { useState } from 'react';

let seq = 0;

/** Short, colon-free id generator for SVG gradient references. React's own
 *  useId() includes colons, which some browsers fail to resolve inside
 *  `url(#id)` gradient refs - so coin/emblem SVGs use this instead. */
export function useSimpleId(prefix = 'ffid') {
  const [id] = useState(() => `${prefix}${seq++}`);
  return id;
}

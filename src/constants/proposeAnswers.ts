export interface AnswerProposal {
  qid: string;
  value: string;
}

/**
 * Free text -> proposed Question Card answers.
 *
 * No language model is wired up here: this is a keyword/phrase matcher
 * against the Questions library, honestly labelled as such (a dummy flow
 * for now). A live adapter would swap this function's body for a real
 * model call and keep the same { qid, value } output shape, so nothing
 * downstream changes. This function only ever proposes - the caller is
 * always responsible for confirming proposals before they touch the profile.
 */
export function proposeAnswersFromText(text: string): AnswerProposal[] {
  const t = text.toLowerCase();
  const proposals: AnswerProposal[] = [];

  const yes = (qid: string, phrases: string[]) => {
    if (phrases.some((p) => t.includes(p))) proposals.push({ qid, value: 'Yes' });
  };

  yes('q_car', ['own car', 'have a car', 'my car', 'drive myself']);
  yes('q_licence', ['driving licence', "driver's licence", 'driving license']);
  yes('q_kit', ['own equipment', 'own kit', 'cocktail equipment', 'bar equipment']);
  yes('q_shaker', ['own shaker', 'cocktail shaker']);
  yes('q_tools', ['own bar tools', 'own tools']);
  yes('q_insurance', ['insurance', 'insured']);
  yes('q_weekend', ['weekends', 'weekend events', 'weekend work']);
  yes('q_evening', ['evenings', 'evening events', 'evening work']);
  yes('q_lastmin', ['last minute', 'last-minute', 'short notice']);
  yes('q_weddings', ['wedding']);
  yes('q_corporate', ['corporate event', 'corporate work', 'corporate booking']);
  yes('q_private', ['private part', 'private event']);
  yes('q_festivals', ['festival']);

  if (t.includes('anywhere')) {
    proposals.push({ qid: 'q_travel', value: 'Anywhere' });
  } else {
    const travel = t.match(/(\d+)\s*mile/);
    if (travel) {
      const miles = Number(travel[1]);
      const opt = miles <= 10 ? 'Up to 10 miles' : miles <= 25 ? 'Up to 25 miles' : miles <= 50 ? 'Up to 50 miles' : 'Anywhere';
      proposals.push({ qid: 'q_travel', value: opt });
    }
  }

  const locMatch = t.match(/based in ([a-z\s]+?)(?:[.,]|$)/);
  if (locMatch) proposals.push({ qid: 'q_2027', value: `Based in ${locMatch[1].trim()}` });

  const yearsMatch = t.match(/(\d+)\s*years?/);
  if (yearsMatch && (t.includes('wedding') || t.includes('corporate') || t.includes('experience'))) {
    proposals.push({ qid: 'q_goal', value: `${yearsMatch[1]} years' experience in events` });
  }

  const favMatch = t.match(/favourite cocktail is ([a-z\s]+?)(?:[.,]|$)/);
  if (favMatch) proposals.push({ qid: 'q_favourite', value: favMatch[1].trim() });

  // De-duplicate by qid, keep the first match.
  const seen = new Set<string>();
  return proposals.filter((p) => {
    if (seen.has(p.qid)) return false;
    seen.add(p.qid);
    return true;
  });
}

/** A static, ready-made bio for testing the flow end to end without typing
 *  one out - deliberately worded to trigger several proposals at once. */
export const SAMPLE_PROMPT =
  "I've been working as a bartender for 6 years, mostly weddings and corporate events, plus a few festivals. " +
  'I own my own cocktail shaker and bar tools, and I have a car and a driving licence, so I can travel anywhere. ' +
  "I'm available for weekend and evening work, including last-minute bookings. I'm based in London. My favourite cocktail is a Negroni.";

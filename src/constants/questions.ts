export type QuestionGroupKey = 'logistics' | 'availability' | 'experience' | 'cocktails' | 'aspirations';

export type QuestionType = 'yesno' | 'choice' | 'text';

export interface Question {
  id: string;
  group: QuestionGroupKey;
  type: QuestionType;
  text: string;
  options?: string[];
  placeholder?: string;
}

/** +1 XP for answering a Question Card, once. */
export const QUESTION_XP = 1;

export const QUESTION_GROUPS: { key: QuestionGroupKey; label: string }[] = [
  { key: 'logistics', label: 'Equipment' },
  { key: 'availability', label: 'Availability' },
  { key: 'experience', label: 'Experience' },
  { key: 'cocktails', label: 'Bar & Cocktails' },
  { key: 'aspirations', label: 'Dream Opportunities' },
];

interface QuestionGroupColorDef {
  bg: string;
  ink: string;
  sub: string;
  rule: string;
}

/** One colour per question category, so it reads as a distinct identity
 *  while swiping card to card. */
export const QUESTION_GROUP_COLOR: Record<QuestionGroupKey, QuestionGroupColorDef> = {
  logistics: { bg: 'linear-gradient(165deg,#2B2E33,#15171A)', ink: '#F1F2F4', sub: '#B9C4CC', rule: 'rgba(185,196,204,.30)' },
  availability: { bg: 'linear-gradient(165deg,#132435,#080F18)', ink: '#EAF2FA', sub: '#8FB9DE', rule: 'rgba(143,185,222,.32)' },
  experience: { bg: 'linear-gradient(165deg,#152A21,#081712)', ink: '#EAF4EE', sub: '#8FC7A6', rule: 'rgba(143,199,166,.30)' },
  cocktails: { bg: 'linear-gradient(165deg,#3A2712,#1B1108)', ink: '#FBF0DE', sub: '#E0B274', rule: 'rgba(224,178,116,.34)' },
  aspirations: { bg: 'linear-gradient(165deg,#241533,#0F0919)', ink: '#F3EDFA', sub: '#C4A3E8', rule: 'rgba(196,163,232,.32)' },
};

export function questionGroupColor(key: QuestionGroupKey): QuestionGroupColorDef {
  return QUESTION_GROUP_COLOR[key];
}

/** Internal profile data - never published on the public card. Answering
 *  one helps FireFlair match the person to work, nothing more. */
export const QUESTIONS: Question[] = [
  { id: 'q_car', group: 'logistics', type: 'yesno', text: 'Do you have a car?' },
  { id: 'q_licence', group: 'logistics', type: 'yesno', text: 'Do you have a driving licence?' },
  { id: 'q_kit', group: 'logistics', type: 'yesno', text: 'Do you have cocktail equipment?' },
  { id: 'q_shaker', group: 'logistics', type: 'yesno', text: 'Do you own a cocktail shaker?' },
  { id: 'q_tools', group: 'logistics', type: 'yesno', text: 'Do you have your own bar tools?' },
  { id: 'q_insurance', group: 'logistics', type: 'yesno', text: 'Do you have event insurance?' },
  { id: 'q_travel', group: 'logistics', type: 'choice', text: 'How far are you willing to travel?', options: ['Up to 10 miles', 'Up to 25 miles', 'Up to 50 miles', 'Anywhere'] },

  { id: 'q_weekend', group: 'availability', type: 'yesno', text: 'Are you available for weekend events?' },
  { id: 'q_evening', group: 'availability', type: 'yesno', text: 'Are you available for evening events?' },
  { id: 'q_lastmin', group: 'availability', type: 'yesno', text: 'Are you available for last-minute bookings?' },

  { id: 'q_weddings', group: 'experience', type: 'yesno', text: 'Do you have experience working weddings?' },
  { id: 'q_corporate', group: 'experience', type: 'yesno', text: 'Do you have experience working corporate events?' },
  { id: 'q_private', group: 'experience', type: 'yesno', text: 'Do you have experience working private parties?' },
  { id: 'q_festivals', group: 'experience', type: 'yesno', text: 'Do you have experience working festivals?' },

  { id: 'q_favourite', group: 'cocktails', type: 'text', text: 'What is your favourite cocktail?', placeholder: 'Negroni' },
  { id: 'q_signature', group: 'cocktails', type: 'text', text: 'What is your signature cocktail?', placeholder: 'Something of your own' },
  { id: 'q_bartype', group: 'cocktails', type: 'text', text: 'What type of bar do you enjoy working in?', placeholder: 'Busy cocktail bars' },
  { id: 'q_eventtype', group: 'cocktails', type: 'text', text: 'What type of events do you enjoy?', placeholder: 'Weddings, launches…' },

  { id: 'q_brands', group: 'aspirations', type: 'text', text: 'What brands would you love to work with?', placeholder: 'Diageo, Campari…' },
  { id: 'q_venues', group: 'aspirations', type: 'text', text: 'What venues would you love to work at?', placeholder: "Annabel's, Sketch…" },
  { id: 'q_dreambook', group: 'aspirations', type: 'text', text: 'What event would be your dream booking?', placeholder: 'Describe it' },
  { id: 'q_2027', group: 'aspirations', type: 'text', text: 'Where would you like to work in 2027?', placeholder: 'A city, a country, a venue' },
  { id: 'q_skill', group: 'aspirations', type: 'text', text: 'What skill would you like to learn?', placeholder: 'Anything' },
  { id: 'q_qual', group: 'aspirations', type: 'text', text: 'What qualification would you like to obtain?', placeholder: 'WSET 3…' },
  { id: 'q_goal', group: 'aspirations', type: 'text', text: 'What is your biggest professional goal?', placeholder: "Where you're heading" },
  { id: 'q_worktype', group: 'aspirations', type: 'text', text: 'What type of work are you looking for?', placeholder: 'Regular shifts, one-offs…' },
  { id: 'q_unusual', group: 'aspirations', type: 'text', text: 'What is something unusual you can do?', placeholder: 'Surprise us' },
];

export function questionsIn(group: QuestionGroupKey): Question[] {
  return QUESTIONS.filter((q) => q.group === group);
}

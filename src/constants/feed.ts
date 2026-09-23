export interface FeedItem {
  id: string;
  title: string;
  when: string;
  where: string;
  note: string;
  spaces?: number;
}

/** Demo content for the home feed - events and training near you. Static
 *  for now; swap for a real feed API without touching the components. */
export const FEED: { events: FeedItem[]; training: FeedItem[] } = {
  events: [
    { id: 'fe_1', title: 'London Cocktail Week', when: '3–9 October', where: 'Across London', note: 'Bar takeovers and brand activations all week.' },
    { id: 'fe_2', title: 'Winter Wedding Showcase', when: '18 October', where: 'Charlotte House', note: 'Meet planners booking for next season.' },
    { id: 'fe_3', title: 'Hospitality Expo', when: '5 November', where: 'ExCeL', note: 'Suppliers, brands and recruiters.' },
  ],
  training: [
    { id: 'ft_1', title: 'WSET Level 2 - Spirits', when: '12 October', where: 'Central London', note: 'Two-day course, certificate on completion.', spaces: 8 },
    { id: 'ft_2', title: 'Flair Bartending Basics', when: '26 October', where: 'Northbank Studio', note: 'Working flair you can use in service.', spaces: 12 },
    { id: 'ft_3', title: 'Personal Licence Day', when: '9 November', where: 'Enfield', note: 'Everything needed to apply.', spaces: 20 },
  ],
};

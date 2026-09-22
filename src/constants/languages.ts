const FLAGS: Record<string, string> = {
  English: '🇬🇧', Spanish: '🇪🇸', French: '🇫🇷', German: '🇩🇪', Italian: '🇮🇹',
  Portuguese: '🇵🇹', Mandarin: '🇨🇳', Chinese: '🇨🇳', Japanese: '🇯🇵', Arabic: '🇸🇦',
  Polish: '🇵🇱', Romanian: '🇷🇴', Russian: '🇷🇺', Hindi: '🇮🇳', Greek: '🇬🇷',
  Dutch: '🇳🇱', Turkish: '🇹🇷', Ukrainian: '🇺🇦', Swedish: '🇸🇪', Korean: '🇰🇷',
};

export const flagFor = (language: string) => FLAGS[language.trim()] ?? '🏳';

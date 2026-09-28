import { CARD_COLOURS, THEMES } from '../../constants/theme';
import type { CardTheme } from '../../types/store';

interface CardColourPickerProps {
  value: CardTheme;
  onChange: (theme: CardTheme) => void;
}

/** Row of round swatches under the editable card - picks the card's colour. */
export function CardColourPicker({ value, onChange }: CardColourPickerProps) {
  return (
    <div role="radiogroup" aria-label="Card colour" className="mt-4 flex justify-center gap-2.5">
      {CARD_COLOURS.map((key) => {
        const on = key === value;
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={THEMES[key].name}
            title={THEMES[key].name}
            onClick={() => onChange(key)}
            className="h-8 w-8 rounded-full border-2 transition-transform hover:scale-105"
            style={{
              background: THEMES[key].swatch,
              borderColor: on ? '#C9A227' : 'rgba(26,26,28,.15)',
              boxShadow: on ? '0 0 0 2px rgba(201,162,39,.25)' : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

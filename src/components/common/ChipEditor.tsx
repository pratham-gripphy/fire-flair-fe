import { useState } from 'react';
import { X } from 'lucide-react';
import { flagFor } from '../../constants/languages';

interface ChipEditorProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  flags?: boolean;
  ink: string;
  rule: string;
}

/** Tag-input used on a card: type a value, hit Enter/comma to add a chip. */
export function ChipEditor({ values, onChange, placeholder, flags, ink, rule }: ChipEditorProps) {
  const [text, setText] = useState('');

  const add = () => {
    const v = text.trim().replace(/,$/, '');
    if (!v) return;
    if (!values.includes(v)) onChange([...values, v]);
    setText('');
  };

  return (
    <div>
      {values.length > 0 && (
        <div className="mb-1.5 flex flex-wrap gap-1.5">
          {values.map((v, i) => (
            <span key={v + i} className="ff-tagchip" style={{ color: ink, borderColor: rule }}>
              {flags && <span className="text-xs">{flagFor(v)}</span>}
              {v}
              <button onClick={() => onChange(values.filter((_, j) => j !== i))} aria-label={`Remove ${v}`} style={{ color: ink }}>
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
      <input
        className="ff-cardin"
        value={text}
        placeholder={placeholder}
        style={{ color: ink, borderBottomColor: rule }}
        onChange={(e) => setText(e.target.value)}
        onBlur={add}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            add();
          }
        }}
      />
    </div>
  );
}

import { useRef, type ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { CardFrame } from '../common/CardFrame';
import { Portrait } from '../common/Portrait';
import { Level } from '../common/Level';
import { CatIcon, type CatKind } from '../common/CatIcon';
import { ChipEditor } from '../common/ChipEditor';
import { Logo } from '../common/Logo';
import { Wordmark } from '../common/Wordmark';
import { CARD_DOMAIN, THEMES, TIERS } from '../../constants/theme';
import type { CardTheme, ProfileDraft, Tier } from '../../types/store';

interface EditableProfileCardProps {
  draft: ProfileDraft;
  onChange: (patch: Partial<ProfileDraft>) => void;
  themeKey?: CardTheme;
  tag?: string;
  tier?: Tier;
  level?: number;
}

interface RowProps {
  kind: CatKind;
  label: string;
  iconColor: string;
  borderColor: string;
  children: ReactNode;
}

function Row({ kind, label, iconColor, borderColor, children }: RowProps) {
  return (
    <div className="border-b py-2.5" style={{ borderColor }}>
      <div className="mb-1 flex items-center gap-[7px]">
        <CatIcon kind={kind} size={13} color={iconColor} />
        <span className="ff-label" style={{ color: iconColor, fontSize: 8.5 }}>
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}

/** A FireFlair ID card you type straight onto - name, professions and the
 *  rest of the categories are all editable inline, on the card itself. */
export function EditableProfileCard({ draft, onChange, themeKey = 'onyx', tag = '-----', tier = 'standard', level = 3 }: EditableProfileCardProps) {
  const t = THEMES[themeKey] ?? THEMES.onyx;
  const tr = TIERS[tier] ?? TIERS.standard;
  const { ink, sub, rule } = t;
  const photoRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof ProfileDraft>(key: K) => (value: ProfileDraft[K]) => onChange({ [key]: value } as Partial<ProfileDraft>);

  return (
    <CardFrame tier={tier} theme={t} corners className="relative mx-auto max-w-[340px] px-4 pt-7">
      <span className="absolute top-[9px] right-[9px] z-[4]">
        <Logo size={32} />
      </span>

      <div className="mt-1 flex justify-center">
        <input
          ref={photoRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onChange({ photo: URL.createObjectURL(f) });
          }}
        />
        <button onClick={() => photoRef.current?.click()} className="relative" aria-label="Add your photo">
          <Portrait src={draft.photo} name={draft.name} size={92} ring={tr.ring[0]} ink={tr.ink} />
          {!draft.photo && (
            <span className="absolute right-0 bottom-0 grid h-6 w-6 place-items-center rounded-full text-ink" style={{ background: tr.ring[0] }}>
              <Plus size={14} />
            </span>
          )}
        </button>
      </div>

      <input
        className="ff-cardin font-display mt-3 text-center text-lg tracking-[0.13em] uppercase"
        value={draft.name}
        placeholder="Your name"
        onChange={(e) => onChange({ name: e.target.value })}
        style={{ color: ink, borderBottomColor: rule }}
      />

      <div className="mt-2">
        <div className="mb-1 flex items-center justify-center gap-1.5">
          <CatIcon kind="profession" size={12} color={sub} />
          <span className="ff-label" style={{ color: sub, fontSize: 8 }}>
            Professions · up to 3 on your card
          </span>
        </div>
        <ChipEditor values={draft.professions} onChange={set('professions')} placeholder="Add a profession, then Enter" ink={ink} rule={rule} />
      </div>

      <div className="my-2.5 flex items-center justify-center gap-3">
        <Level n={level} color={sub} />
        <span className="h-1 w-1 rotate-45" style={{ background: sub }} />
        <span className="font-display text-[11px] tracking-[0.08em]" style={{ color: sub }}>
          {CARD_DOMAIN}/{tag}
        </span>
      </div>

      <Row kind="skills" label="Skills" iconColor={sub} borderColor={rule}>
        <ChipEditor values={draft.skills} onChange={set('skills')} placeholder="Add a skill, then Enter" ink={ink} rule={rule} />
      </Row>
      <Row kind="interests" label="Interests" iconColor={sub} borderColor={rule}>
        <ChipEditor values={draft.interests} onChange={set('interests')} placeholder="Add an interest" ink={ink} rule={rule} />
      </Row>
      <Row kind="location" label="Work locations" iconColor={sub} borderColor={rule}>
        <ChipEditor values={draft.locations} onChange={set('locations')} placeholder="Add an area you work" ink={ink} rule={rule} />
      </Row>
      <Row kind="languages" label="Languages" iconColor={sub} borderColor={rule}>
        <ChipEditor values={draft.languages} onChange={set('languages')} placeholder="Add a language" flags ink={ink} rule={rule} />
      </Row>

      <div className="-mx-4 flex items-center gap-[9px] border-t px-4 py-2.5" style={{ background: t.dark ? 'rgba(0,0,0,.45)' : '#141416', borderColor: rule }}>
        <Logo size={20} />
        <Wordmark size={12} />
        <span className="font-display text-gold-lt/80 ml-auto text-[9px] tracking-[0.06em]">
          {CARD_DOMAIN}/{tag}
        </span>
      </div>
    </CardFrame>
  );
}

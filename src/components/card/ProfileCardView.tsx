import { Pencil, Share2 } from 'lucide-react';
import { CardFrame } from '../common/CardFrame';
import { Coin } from '../common/Coin';
import { Portrait } from '../common/Portrait';
import { Level } from '../common/Level';
import { CardRule } from '../common/CardRule';
import { CardMeta } from '../common/CardMeta';
import { CardFoot } from '../common/CardFoot';
import { CatIcon, type CatKind } from '../common/CatIcon';
import { Button } from '../common/Button';
import { flagFor } from '../../constants/languages';
import { CARD_DOMAIN, THEMES, TIERS } from '../../constants/theme';
import type { Profile } from '../../types/store';

interface ProfileCardViewProps {
  profile: Profile;
  tag?: string;
  onEdit: () => void;
  onShare: () => void;
}

const top3 = (values: string[]) => values.filter(Boolean).slice(0, 3);

/** The saved, read-only view of a person's card — what shows once an
 *  account exists. Edit / Share live as their own actions below the card,
 *  not inside its frame. */
export function ProfileCardView({ profile, tag = '-----', onEdit, onShare }: ProfileCardViewProps) {
  const t = THEMES[profile.theme] ?? THEMES.onyx;
  const tr = TIERS[profile.tier] ?? TIERS.standard;
  const { ink, sub } = t;

  const professions = top3(profile.professions);
  const skills = top3(profile.skills);
  const interests = top3(profile.interests);
  const locations = top3(profile.locations);
  const languages = profile.languages.slice(0, 5);
  const address = `${CARD_DOMAIN}/${tag}`;

  const allRows: { kind: CatKind; label: string; value: string }[] = [
    { kind: 'profession', label: professions.length > 1 ? 'Professions' : 'Profession', value: professions.join(' · ') },
    { kind: 'skills', label: 'Skills', value: skills.join(' · ') },
    { kind: 'interests', label: 'Interests', value: interests.join(' · ') },
    { kind: 'location', label: locations.length > 1 ? 'Locations' : 'Location', value: locations.join(' · ') },
  ];
  const rows = allRows.filter((r) => r.value);

  return (
    <div className="mx-auto w-full max-w-[340px]">
      <CardFrame tier={profile.tier} theme={t} corners className="relative px-4 pt-7">
        <span className="absolute top-[9px] right-[9px] z-[4]">
          <Coin size={32} tier={profile.tier} />
        </span>

        <div className="flex justify-center">
          <Portrait src={profile.photo} name={profile.name} size={94} tier={profile.tier} ink={tr.ink} />
        </div>

        <div className="font-display mt-2.5 text-center text-[19px] tracking-[0.13em] uppercase" style={{ color: ink }}>
          {profile.name || 'Your name'}
        </div>
        {professions[0] && (
          <div className="mt-0.5 text-center text-[14.5px] italic" style={{ fontFamily: 'var(--font-serif)', color: sub }}>
            {professions[0]}
          </div>
        )}

        <div className="my-1.5 flex items-center justify-center gap-2.5">
          <Level n={profile.level} color={sub} />
        </div>
        <CardRule color={t.rule} margin="6px 0 2px" />

        <div>
          {rows.map((r) => (
            <CardMeta key={r.kind} kind={r.kind} label={r.label} value={r.value} theme={t} />
          ))}
          {languages.length > 0 && (
            <div className="flex items-center gap-[9px] py-1.5">
              <CatIcon kind="languages" size={13} color={sub} />
              <span className="ff-label flex-none" style={{ color: sub, width: 60, fontSize: 8, letterSpacing: '.16em' }}>
                Languages
              </span>
              <span className="text-[15px] tracking-[2px]">
                {languages.map((l) => (
                  <span key={l} className="mr-[3px]">
                    {flagFor(l)}
                  </span>
                ))}
              </span>
            </div>
          )}
        </div>

        <CardFoot tier={profile.tier} theme={t} address={address} />
      </CardFrame>

      <div className="mt-4 flex gap-3">
        <Button variant="ghost" className="flex-1" onClick={onEdit}>
          <Pencil size={15} strokeWidth={1.7} /> Edit card
        </Button>
        <Button variant="primary" className="flex-1" onClick={onShare}>
          <Share2 size={15} strokeWidth={1.7} /> Share card
        </Button>
      </div>
    </div>
  );
}

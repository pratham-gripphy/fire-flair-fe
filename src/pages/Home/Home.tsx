import { useState } from 'react';
import { ChevronRight, Mail, Phone, ShieldCheck } from 'lucide-react';
import { useStore } from '../../hooks/useStore';
import { Coin } from '../../components/common/Coin';
import { Wordmark } from '../../components/common/Wordmark';
import { Corners } from '../../components/common/Corners';
import { Button } from '../../components/common/Button';
import { Field } from '../../components/common/Field';
import { EditableProfileCard } from '../../components/card/EditableProfileCard';
import { ProfileCardView } from '../../components/card/ProfileCardView';
import type { Profile, ProfileDraft } from '../../types/store';

const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
const isValidPhone = (value: string) => value.replace(/\D/g, '').length >= 9;

const draftOf = (profile: Profile): ProfileDraft => ({
  name: profile.name,
  photo: profile.photo,
  professions: profile.professions,
  skills: profile.skills,
  interests: profile.interests,
  locations: profile.locations,
  languages: profile.languages,
});

export function Home() {
  const { state, dispatch } = useStore();
  const { profile } = state;

  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [editing, setEditing] = useState(false);
  const [editDraft, setEditDraft] = useState<ProfileDraft | null>(null);

  const updateDraft = (patch: Partial<ProfileDraft>) => dispatch({ type: 'PROFILE_PATCH', patch });

  const startEditing = () => {
    setEditDraft(draftOf(profile));
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditDraft(null);
    setEditing(false);
  };

  const saveEditing = () => {
    if (editDraft) dispatch({ type: 'PROFILE_PATCH', patch: editDraft });
    setEditDraft(null);
    setEditing(false);
  };

  const shareCard = async () => {
    const shareData = {
      title: `${profile.name || 'My'} FireFlair card`,
      text: `Check out ${profile.name.split(' ')[0] || 'my'} FireFlair card.`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // the user cancelled the native share sheet — nothing to do
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(shareData.url);
      dispatch({ type: 'TOAST', toast: 'Card link copied to clipboard.' });
    } catch {
      dispatch({ type: 'TOAST', toast: 'Could not copy the link — copy it from the address bar.' });
    }
  };

  const started = profile.started || profile.accountCreated;
  const cardReady = profile.name.trim().length > 0 && profile.professions.length > 0;
  const awaitingSave = cardReady && !profile.cardSaved && !profile.accountCreated;
  const awaitingContact = profile.cardSaved && !profile.accountCreated;
  const contactReady = isValidPhone(phone) || isValidEmail(email);

  const createAccount = () => {
    dispatch({ type: 'CREATE_ACCOUNT', phone: phone.trim(), email: email.trim() });
  };

  if (!started) {
    return (
      <div className="mx-auto max-w-[420px] text-center">
        <div className="ff-frame ff-lattice p-8">
          <Corners />
          <div className="mb-3 flex justify-center">
            <Coin size={56} tier="gold" />
          </div>
          <div className="mb-3">
            <Wordmark size={18} tone="#7E611D" />
          </div>
          <h1 className="ff-h1">
            Let&apos;s build your
            <br />
            professional identity
          </h1>
          <p className="ff-lede mt-2.5 mb-0">Your profession, on a card worth sharing. No account to create until you&apos;re ready.</p>
        </div>
        <div className="h-4" />
        <Button variant="primary wide" onClick={() => dispatch({ type: 'START_BUILDING' })}>
          Build my card <ChevronRight size={15} />
        </Button>
      </div>
    );
  }

  // Card already exists — show the read-only view with Edit / Share actions.
  if (profile.accountCreated && !editing) {
    return (
      <div className="mx-auto max-w-[420px]">
        <div className="mb-6 text-center">
          <h1 className="ff-h1">Your card</h1>
          <p className="ff-lede mt-2 mb-0">Welcome back, {profile.name.split(' ')[0] || 'friend'}.</p>
        </div>
        <ProfileCardView profile={profile} onEdit={startEditing} onShare={shareCard} />
      </div>
    );
  }

  // Editing an already-saved card — edits apply to a local draft until saved.
  if (profile.accountCreated && editing && editDraft) {
    return (
      <div className="mx-auto max-w-[420px]">
        <h1 className="ff-h1 text-center">Edit your card</h1>
        <p className="ff-body mt-2 mb-4 text-center">Make your changes, then save or cancel.</p>

        <EditableProfileCard
          draft={editDraft}
          onChange={(patch) => setEditDraft((d) => (d ? { ...d, ...patch } : d))}
          themeKey={profile.theme}
          tier={profile.tier}
          level={profile.level}
        />

        <div className="mt-5 flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={cancelEditing}>
            Cancel
          </Button>
          <Button variant="primary" className="flex-1" onClick={saveEditing}>
            Save changes
          </Button>
        </div>
      </div>
    );
  }

  // First-time build, before the account exists.
  return (
    <div className="mx-auto max-w-[420px]">
      <h1 className="ff-h1 text-center">Build your card</h1>
      <p className="ff-body mt-2 mb-4 text-center">
        Type straight onto it. Add as many professions as you have — your card shows the first three.
      </p>

      <EditableProfileCard draft={profile} onChange={updateDraft} themeKey={profile.theme} tier={profile.tier} level={profile.level} />

      {awaitingSave && (
        <div className="mt-5 flex animate-[ffup_.22s_ease-out] gap-3">
          <Button variant="ghost" className="flex-1" onClick={() => dispatch({ type: 'RESET_CARD' })}>
            Cancel
          </Button>
          <Button variant="primary" className="flex-1" onClick={() => dispatch({ type: 'SAVE_CARD' })}>
            Save card
          </Button>
        </div>
      )}

      {awaitingContact && (
        <div className="mt-6 animate-[ffup_.22s_ease-out]">
          <div className="ff-rule mb-5" />
          <h2 className="ff-h2 text-center">Almost there</h2>
          <p className="ff-body ff-muted mt-1 mb-4 text-center">
            Your card is saved. Add a phone number or an email to create your account.
          </p>

          <Field label="Mobile number" hint="We only use this to save and secure your account.">
            <div className="flex items-center gap-2">
              <Phone size={15} className="text-gold-dk shrink-0" />
              <input
                className="ff-input"
                type="tel"
                placeholder="+44 7700 900000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </Field>

          <div className="ff-body ff-muted mb-4 text-center text-xs tracking-[0.2em] uppercase">or</div>

          <Field label="Email address">
            <div className="flex items-center gap-2">
              <Mail size={15} className="text-gold-dk shrink-0" />
              <input
                className="ff-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </Field>

          <Button variant="primary wide" disabled={!contactReady} onClick={createAccount}>
            <ShieldCheck size={15} /> Create my account
          </Button>
        </div>
      )}
    </div>
  );
}

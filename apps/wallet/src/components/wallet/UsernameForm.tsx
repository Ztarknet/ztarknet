'use client';

import { useZtarknet } from '@/providers/ztarknet-provider';
import { Button } from '@workspace/ui/components/button';
import { AlertCircle, Check, CheckCircle2, Info, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface UsernameFormProps {
  accountAddress: string | null;
  onUsernameChanged?: (newUsername: string) => void;
  optimisticUsername?: string | null;
}

export function UsernameForm({
  accountAddress,
  onUsernameChanged,
  optimisticUsername,
}: UsernameFormProps) {
  const { username, claimUsername, isUsernameClaimed, refreshUsername } = useZtarknet();
  const displayUsername = optimisticUsername || username;
  const [newUsername, setNewUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  useEffect(() => {
    const validateUsername = async () => {
      if (!newUsername) {
        setValidationError('');
        return;
      }

      if (newUsername.length < 3) {
        setValidationError('Username must be at least 3 characters');
        return;
      }

      if (newUsername.length > 20) {
        setValidationError('Username must be 20 characters or less');
        return;
      }

      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(newUsername)) {
        setValidationError('Username can only contain letters, numbers, and underscores');
        return;
      }

      setIsCheckingUsername(true);
      try {
        const isClaimed = await isUsernameClaimed(newUsername);
        if (isClaimed) {
          setValidationError('Username is already taken');
        } else {
          setValidationError('');
        }
      } catch (err) {
        console.error('Failed to check username:', err);
      } finally {
        setIsCheckingUsername(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      validateUsername();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [newUsername, isUsernameClaimed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newUsername) {
      setError('Please enter a username');
      return;
    }

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const claimedUsername = newUsername;
      const txHash = await claimUsername(claimedUsername);
      if (txHash) {
        setSuccess(`Username claimed! Tx: ${txHash.slice(0, 20)}...`);
        setNewUsername('');

        if (onUsernameChanged) {
          onUsernameChanged(claimedUsername);
        }

        setTimeout(() => {
          refreshUsername();
        }, 1000);
      } else {
        setError('Failed to claim username');
      }
    } catch (err) {
      console.error('Failed to claim username:', err);
      setError(err instanceof Error ? err.message : 'Failed to claim username');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!accountAddress) {
    return (
      <div className="text-center text-muted py-8">
        <p className="text-sm">Select an account to manage username</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayUsername && (
        <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-accent/60">
            Current Username
          </span>
          <p className="text-sm font-semibold text-foreground mt-0.5">{displayUsername}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-accent/60 mb-1.5 block">
            {displayUsername ? 'Change Username' : 'Claim Username'}
          </span>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/10 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
          />

          {isCheckingUsername && (
            <div className="flex items-center gap-1.5 text-xs text-muted mt-1.5">
              <Loader2 className="w-3 h-3 animate-spin" />
              Checking...
            </div>
          )}

          {validationError && !isCheckingUsername && (
            <div className="flex items-center gap-1.5 text-xs text-red-400 mt-1.5">
              <AlertCircle className="w-3 h-3" />
              {validationError}
            </div>
          )}

          {newUsername && !validationError && !isCheckingUsername && (
            <div className="flex items-center gap-1.5 text-xs text-green-400 mt-1.5">
              <Check className="w-3 h-3" />
              Available
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-green-500/5 border border-green-500/20">
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
            <p className="text-sm text-green-400">{success}</p>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || !!validationError || !newUsername || isCheckingUsername}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Claiming...
              </>
            ) : displayUsername ? (
              'Change Username'
            ) : (
              'Claim Username'
            )}
          </Button>
        </div>
      </form>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/5">
        <Info className="w-4 h-4 text-muted shrink-0 mt-0.5" />
        <p className="text-xs text-muted">Usernames are permanent and cannot be deleted.</p>
      </div>
    </div>
  );
}

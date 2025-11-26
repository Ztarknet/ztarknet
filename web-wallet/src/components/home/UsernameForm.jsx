import React, { useState, useEffect } from 'react';
import { useZtarknetConnector } from '@/context/ZtarknetConnector';

export function UsernameForm({ accountAddress }) {
  const { username, claimUsername, isUsernameClaimed, refreshUsername } = useZtarknetConnector();
  const [newUsername, setNewUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  useEffect(() => {
    // Validate username as user types
    const validateUsername = async () => {
      if (!newUsername) {
        setValidationError('');
        return;
      }

      // Check length (e.g., 3-20 characters)
      if (newUsername.length < 3) {
        setValidationError('Username must be at least 3 characters');
        return;
      }

      if (newUsername.length > 20) {
        setValidationError('Username must be 20 characters or less');
        return;
      }

      // Check format (alphanumeric and underscores only)
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(newUsername)) {
        setValidationError('Username can only contain letters, numbers, and underscores');
        return;
      }

      // Check if username is already claimed
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

  const handleSubmit = async (e) => {
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
      const txHash = await claimUsername(newUsername);
      if (txHash) {
        setSuccess(`Username claimed successfully! Transaction hash: ${txHash}`);
        setNewUsername('');

        // Refresh username after a short delay
        setTimeout(() => {
          refreshUsername();
        }, 1000);
      } else {
        setError('Failed to claim username');
      }
    } catch (err) {
      console.error('Failed to claim username:', err);
      setError(err.message || 'Failed to claim username');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!accountAddress) {
    return (
      <div className="text-center text-muted py-8">
        <p>Select an account to manage username</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 min-w-0">
      {/* Current Username */}
      {username && (
        <div className="p-4 rounded-lg bg-[rgba(255,107,26,0.1)] border border-[rgba(255,137,70,0.2)]">
          <div className="text-sm text-muted mb-1">Current Username</div>
          <div className="text-lg font-semibold text-foreground">{username}</div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {username ? 'Change Username' : 'Claim Username'}
          </label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Enter username"
            className="w-full p-3 rounded-lg bg-[rgba(8,8,12,0.6)] border border-[rgba(255,137,70,0.2)] text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
          />

          {/* Validation Feedback */}
          {isCheckingUsername && (
            <div className="text-xs text-muted mt-2 flex items-center gap-2">
              <svg
                className="animate-spin"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Checking availability...
            </div>
          )}

          {validationError && !isCheckingUsername && (
            <div className="text-xs text-red-400 mt-2">
              {validationError}
            </div>
          )}

          {newUsername && !validationError && !isCheckingUsername && (
            <div className="text-xs text-green-400 mt-2 flex items-center gap-1">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Username is available
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm break-all">
            {success}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !!validationError || !newUsername || isCheckingUsername}
          className="w-full py-3 px-4 rounded-full font-semibold tracking-wide border transition-all duration-200 cursor-pointer border-[rgba(255,107,26,0.3)] text-foreground hover:border-accent hover:bg-[rgba(255,107,26,0.15)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {isSubmitting ? 'Claiming...' : username ? 'Change Username' : 'Claim Username'}
        </button>
      </form>

      <div className="p-4 rounded-lg bg-[rgba(255,107,26,0.05)] border border-[rgba(255,137,70,0.1)]">
        <p className="text-xs text-muted">
          <strong className="text-foreground">Note:</strong> Usernames are permanent and cannot be deleted once claimed. Choose carefully!
        </p>
      </div>
    </div>
  );
}

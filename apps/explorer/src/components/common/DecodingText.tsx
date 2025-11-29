'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

// Hex characters for the scramble effect
const HEX_CHARS = '0123456789abcdef';

interface DecodingTextProps {
  /** The final text to reveal */
  text: string;
  /** Whether the component is in loading state (shows scrambling) */
  isLoading?: boolean;
  /** Duration of the decode animation in ms (default: 1000) */
  decodeDuration?: number;
  /** Speed of character scrambling in ms (default: 50) */
  scrambleSpeed?: number;
  /** Additional CSS classes */
  className?: string;
  /** Whether to truncate the text with ellipsis */
  truncate?: boolean;
}

/**
 * A text component that displays a scrambling/decoding effect
 * Perfect for displaying hashes, addresses, and other crypto data
 */
export function DecodingText({
  text,
  isLoading = false,
  decodeDuration = 800,
  scrambleSpeed = 40,
  className = '',
  truncate = false,
}: DecodingTextProps) {
  const [displayText, setDisplayText] = useState<string>('');
  const [isDecoding, setIsDecoding] = useState<boolean>(false);
  const previousTextRef = useRef<string>('');
  const animationFrameRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random hex string of given length
  const generateRandomHex = useCallback((length: number): string => {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
    }
    return result;
  }, []);

  // Scramble effect while loading
  useEffect(() => {
    if (isLoading) {
      // Show scrambling effect
      const scrambleLength = 64; // Standard hash length
      
      intervalRef.current = setInterval(() => {
        setDisplayText(generateRandomHex(scrambleLength));
      }, scrambleSpeed);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isLoading, scrambleSpeed, generateRandomHex]);

  // Decode animation when text arrives
  useEffect(() => {
    if (!isLoading && text && text !== previousTextRef.current) {
      // Clear any existing intervals
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      setIsDecoding(true);
      const startTime = Date.now();
      const textLength = text.length;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / decodeDuration, 1);
        
        // Number of characters that should be revealed
        const revealedCount = Math.floor(progress * textLength);
        
        // Build the display string
        let result = '';
        for (let i = 0; i < textLength; i++) {
          if (i < revealedCount) {
            // Revealed character
            result += text[i];
          } else {
            // Still scrambling - use random hex char
            result += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
          }
        }
        
        setDisplayText(result);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayText(text);
          setIsDecoding(false);
          previousTextRef.current = text;
        }
      };

      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    } else if (!isLoading && text && text === previousTextRef.current) {
      // Same text, no animation needed
      setDisplayText(text);
    }
  }, [text, isLoading, decodeDuration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const baseClasses = truncate ? 'overflow-hidden text-ellipsis whitespace-nowrap' : '';
  const decodingClasses = isDecoding || isLoading ? 'text-accent/70' : '';

  return (
    <span className={`${baseClasses} ${decodingClasses} ${className}`}>
      {displayText || (isLoading ? generateRandomHex(64) : text)}
    </span>
  );
}

/**
 * Simpler version that just shows scrambling while loading
 * and instantly shows the real value when loaded
 */
export function ScrambleText({
  text,
  isLoading = false,
  scrambleSpeed = 50,
  className = '',
  length = 64,
}: {
  text: string;
  isLoading?: boolean;
  scrambleSpeed?: number;
  className?: string;
  length?: number;
}) {
  const [scrambledText, setScrambledText] = useState<string>('');

  const generateRandomHex = useCallback((len: number): string => {
    let result = '';
    for (let i = 0; i < len; i++) {
      result += HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
    }
    return result;
  }, []);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setScrambledText(generateRandomHex(length));
      }, scrambleSpeed);

      return () => clearInterval(interval);
    }
  }, [isLoading, scrambleSpeed, length, generateRandomHex]);

  if (isLoading) {
    return <span className={`text-accent/50 ${className}`}>{scrambledText}</span>;
  }

  return <span className={className}>{text}</span>;
}


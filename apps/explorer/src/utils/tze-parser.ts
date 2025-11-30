import type {
  CompactSizeResult,
  StarkVerifyPrecondition,
  StarkVerifyWitness,
  TzeData,
} from '../types/transaction';

// Re-export types for convenience
export type { TzeData, StarkVerifyPrecondition, StarkVerifyWitness, CompactSizeResult };

// TZE parsing helpers
export function parseTZEData(hexString: string, isInput = false): TzeData | null {
  if (!hexString || !hexString.toLowerCase().startsWith('ff')) {
    return null;
  }

  try {
    // Remove 'ff' prefix and parse
    const data = hexString.slice(2);
    let offset = 0;

    // Parse 4-byte big-endian u32 for tze_id
    const tzeId = Number.parseInt(data.slice(offset, offset + 8), 16);
    offset += 8; // 4 bytes = 8 hex chars

    // The remaining data is the payload (precondition or witness)
    const payload = data.slice(offset);
    const payloadLen = payload.length / 2; // Convert hex chars to bytes

    return {
      tzeId,
      payload,
      payloadLen,
      isInput,
    };
  } catch (e) {
    console.error('Error parsing TZE data:', e);
    return null;
  }
}

export function parseCompactSize(hexString: string, offset: number): CompactSizeResult {
  const firstByte = Number.parseInt(hexString.slice(offset, offset + 2), 16);

  if (firstByte < 0xfd) {
    return { value: firstByte, offset: offset + 2 };
  }
  if (firstByte === 0xfd) {
    const value = Number.parseInt(hexString.slice(offset + 2, offset + 6), 16);
    return { value, offset: offset + 6 };
  }
  if (firstByte === 0xfe) {
    const value = Number.parseInt(hexString.slice(offset + 2, offset + 10), 16);
    return { value, offset: offset + 10 };
  }
  const value = Number.parseInt(hexString.slice(offset + 2, offset + 18), 16);
  return { value, offset: offset + 18 };
}

export function getTZETypeName(tzeId: number): string {
  switch (tzeId) {
    case 0:
      return 'demo';
    case 1:
      return 'stark_verify';
    default:
      return `unknown_${tzeId}`;
  }
}

export function getTZEModeName(tzeId: number, tzeMode: number): string {
  if (tzeId === 1) {
    // stark_verify
    switch (tzeMode) {
      case 0:
        return 'Initialize';
      case 1:
        return 'Verify';
      default:
        return `Mode ${tzeMode}`;
    }
  }
  return `Mode ${tzeMode}`;
}

export function parseStarkVerifyPrecondition(payload: string): StarkVerifyPrecondition {
  // Skip first 4 bytes (appears to be additional metadata/flags)
  const offset = 8; // 4 bytes = 8 hex chars

  // Right-pad payload with zeros if it's not long enough
  // Expected length: 96 bytes (192 hex chars) = root (32) + os_program_hash (32) + bootloader_program_hash (32)
  const expectedLength = offset + 192;
  let paddedPayload = payload;

  if (payload.length < expectedLength) {
    paddedPayload = payload + '0'.repeat(expectedLength - payload.length);
  }

  // Parse the fields (now guaranteed to exist)
  return {
    root: paddedPayload.slice(offset, offset + 64),
    osProgramHash: paddedPayload.slice(offset + 64, offset + 128),
    bootloaderProgramHash: paddedPayload.slice(offset + 128, offset + 192),
  };
}

export function parseStarkVerifyWitness(payload: string): StarkVerifyWitness | null {
  // Witness: 1 byte with_pedersen + 1 byte proof_format + variable proof_data
  if (payload.length < 4) return null; // At least 2 bytes

  const withPedersen = Number.parseInt(payload.slice(0, 2), 16) === 1;
  const proofFormat = Number.parseInt(payload.slice(2, 4), 16);
  const proofData = payload.slice(4);

  return {
    withPedersen,
    proofFormat: proofFormat === 0 ? 'JSON' : 'Binary',
    proofData,
    proofSizeMB: (proofData.length / 2 / 1024 / 1024).toFixed(2),
  };
}

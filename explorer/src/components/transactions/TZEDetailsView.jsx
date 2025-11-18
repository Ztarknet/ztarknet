import React, { useState, useEffect } from 'react';
import { getRawTransaction } from '@services/rpc';
import { copyToClipboard } from '@utils/formatters';
import {
  parseTZEData,
  getTZETypeName,
  getTZEModeName,
  parseStarkVerifyPrecondition,
  parseStarkVerifyWitness
} from '@utils/tze-parser';
import { getVerifier } from '@services/zindex/starks';
import { getTzeInputsByPrevOutput } from '@services/zindex/tze_graph';

export function TZEDetailsView({ tx }) {
  const [expandedProof, setExpandedProof] = useState(false);
  const [oldStateRoot, setOldStateRoot] = useState(null);
  const [loadingOldState, setLoadingOldState] = useState(false);
  const [verifierName, setVerifierName] = useState(null);
  const [loadingVerifier, setLoadingVerifier] = useState(false);
  const [nextVerifyTx, setNextVerifyTx] = useState(null);
  const [loadingNextVerify, setLoadingNextVerify] = useState(false);

  // Parse TZE data from inputs and outputs
  let tzeInputData = null;
  let tzeOutputData = null;
  let spendingTzeInput = null;

  // Check inputs for TZE data
  if (tx.vin) {
    for (const input of tx.vin) {
      if (input.scriptSig && input.scriptSig.hex && input.scriptSig.hex.toLowerCase().startsWith('ff')) {
        tzeInputData = parseTZEData(input.scriptSig.hex, true);
        spendingTzeInput = input; // Save the input reference
        if (tzeInputData) break;
      }
    }
  }

  // Check outputs for TZE data
  if (tx.vout) {
    for (const output of tx.vout) {
      if (output.scriptPubKey && output.scriptPubKey.hex && output.scriptPubKey.hex.toLowerCase().startsWith('ff')) {
        tzeOutputData = parseTZEData(output.scriptPubKey.hex, false);
        if (tzeOutputData) break;
      }
    }
  }

  // Fetch old state root from previous transaction if this is a STARK Verify
  useEffect(() => {
    async function fetchOldState() {
      if (!spendingTzeInput || !spendingTzeInput.txid || spendingTzeInput.vout === undefined) {
        setOldStateRoot(null);
        return;
      }

      try {
        setLoadingOldState(true);

        // Fetch the previous transaction
        const prevTx = await getRawTransaction(spendingTzeInput.txid);

        // Get the output being spent
        const prevOutput = prevTx.vout[spendingTzeInput.vout];

        if (prevOutput && prevOutput.scriptPubKey && prevOutput.scriptPubKey.hex) {
          const prevTzeData = parseTZEData(prevOutput.scriptPubKey.hex, false);
          if (prevTzeData) {
            const prevPrecondition = parseStarkVerifyPrecondition(prevTzeData.payload);
            if (prevPrecondition) {
              setOldStateRoot(prevPrecondition.root);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching old state root:', error);
      } finally {
        setLoadingOldState(false);
      }
    }

    fetchOldState();
  }, [tx.txid]);

  // Fetch verifier name from starks API
  useEffect(() => {
    async function fetchVerifier() {
      if (!tx.txid) {
        setVerifierName(null);
        return;
      }

      try {
        setLoadingVerifier(true);
        const { getStarkProofsByTransaction } = await import('@services/zindex/starks');

        console.log('[TZE Details] Fetching proofs for tx:', tx.txid);
        // Get STARK proofs for this transaction
        const proofsData = await getStarkProofsByTransaction(tx.txid);
        console.log('[TZE Details] Proofs data:', proofsData);

        // The API returns an array directly (not { proofs: [...] })
        if (proofsData && Array.isArray(proofsData) && proofsData.length > 0) {
          const proof = proofsData[0];
          console.log('[TZE Details] First proof:', proof);

          // Fetch verifier details using verifier_id from proof
          if (proof.verifier_id) {
            console.log('[TZE Details] Fetching verifier with ID:', proof.verifier_id);
            const verifierData = await getVerifier(proof.verifier_id);
            console.log('[TZE Details] Verifier data:', verifierData);
            if (verifierData && verifierData.verifier_name) {
              setVerifierName(verifierData.verifier_name);
            }
          } else {
            console.log('[TZE Details] No verifier_id in proof');
          }
        } else {
          console.log('[TZE Details] No proofs found in response');
        }
      } catch (error) {
        console.error('[TZE Details] Error fetching verifier:', error);
      } finally {
        setLoadingVerifier(false);
      }
    }

    fetchVerifier();
  }, [tx.txid]);

  // Check if TZE output is spent (find next verify transaction)
  useEffect(() => {
    async function fetchNextVerify() {
      if (!tx.txid || !tzeOutputData) {
        console.log('[TZE Details] Skipping next verify check - txid:', tx.txid, 'tzeOutputData:', !!tzeOutputData);
        setNextVerifyTx(null);
        return;
      }

      try {
        setLoadingNextVerify(true);

        // Find the vout index of the TZE output
        let tzeVout = null;
        if (tx.vout) {
          for (let i = 0; i < tx.vout.length; i++) {
            const output = tx.vout[i];
            if (output.scriptPubKey && output.scriptPubKey.hex && output.scriptPubKey.hex.toLowerCase().startsWith('ff')) {
              tzeVout = i;
              break;
            }
          }
        }

        console.log('[TZE Details] Found TZE vout:', tzeVout, 'for tx:', tx.txid);

        if (tzeVout !== null) {
          // Query zindex to find if this output is spent
          console.log('[TZE Details] Querying for spending inputs of:', { txid: tx.txid, vout: tzeVout });
          const spendingInputs = await getTzeInputsByPrevOutput({
            txid: tx.txid,
            vout: tzeVout
          });
          console.log('[TZE Details] Spending inputs response:', spendingInputs);

          // The API returns an array directly (not { inputs: [...] })
          if (spendingInputs && Array.isArray(spendingInputs) && spendingInputs.length > 0) {
            // Get the first spending transaction
            const spendingInput = spendingInputs[0];
            console.log('[TZE Details] Found next verify tx:', spendingInput.txid);
            setNextVerifyTx(spendingInput.txid);
          } else {
            console.log('[TZE Details] No spending inputs found');
          }
        }
      } catch (error) {
        console.error('[TZE Details] Error fetching next verify transaction:', error);
      } finally {
        setLoadingNextVerify(false);
      }
    }

    fetchNextVerify();
  }, [tx.txid, tzeOutputData]);

  if (!tzeOutputData) {
    return <div className="p-4 bg-red-600/10 border border-red-600/30 rounded-lg text-red-200 text-sm">Unable to parse TZE data</div>;
  }

  const { tzeId, payload } = tzeOutputData;

  // Determine mode based on transaction structure:
  // - If spending a TZE input → STARK Verify mode (1)
  // - If NOT spending a TZE input → Initialize mode (0)
  const tzeMode = tzeInputData ? 1 : 0;

  const typeName = getTZETypeName(tzeId);
  const modeName = getTZEModeName(tzeId, tzeMode);

  // Parse extension-specific data
  let extensionView = null;

  // Determine description based on mode
  let modeDescription = '';
  if (tzeId === 1) { // stark_verify
    if (tzeMode === 0) {
      modeDescription = 'Initialized a new STARK program channel';
    } else if (tzeMode === 1) {
      modeDescription = 'Verified STARK proof, resulting in a new program state';
    }
  }

  if (tzeId === 1) { // stark_verify
    if (tzeMode === 0) { // Initialize
      const precondition = parseStarkVerifyPrecondition(payload);
      if (precondition) {
        extensionView = (
          <div className="p-0">
            <div className="flex flex-col gap-2 mb-4">
              <span className="text-xs text-[rgba(255,137,70,0.64)] font-semibold uppercase tracking-wider">Genesis State</span>
              <code className="font-mono text-[0.85rem] text-foreground break-all cursor-pointer py-2 px-3 bg-black/30 rounded-md border border-[rgba(255,107,26,0.1)] transition-all duration-200 hover:bg-black/50 hover:border-[rgba(255,107,26,0.3)]" onClick={() => copyToClipboard(precondition.root)} title="Click to copy">
                {precondition.root}
              </code>
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <span className="text-xs text-[rgba(255,137,70,0.64)] font-semibold uppercase tracking-wider">OS Program Hash</span>
              <code className="font-mono text-[0.85rem] text-foreground break-all cursor-pointer py-2 px-3 bg-black/30 rounded-md border border-[rgba(255,107,26,0.1)] transition-all duration-200 hover:bg-black/50 hover:border-[rgba(255,107,26,0.3)]" onClick={() => copyToClipboard(precondition.osProgramHash)} title="Click to copy">
                {precondition.osProgramHash}
              </code>
            </div>
            <div className="flex flex-col gap-2 mb-0">
              <span className="text-xs text-[rgba(255,137,70,0.64)] font-semibold uppercase tracking-wider">Bootloader Program Hash</span>
              <code className="font-mono text-[0.85rem] text-foreground break-all cursor-pointer py-2 px-3 bg-black/30 rounded-md border border-[rgba(255,107,26,0.1)] transition-all duration-200 hover:bg-black/50 hover:border-[rgba(255,107,26,0.3)]" onClick={() => copyToClipboard(precondition.bootloaderProgramHash)} title="Click to copy">
                {precondition.bootloaderProgramHash}
              </code>
            </div>
          </div>
        );
      }
    } else if (tzeMode === 1) { // STARK Verify
      // Parse precondition from input (old state) - this is in the previous tx output being spent
      // For now, we need to look up the previous transaction to get the old state
      // Since we don't have that readily available, we'll show what we can

      // Parse precondition from output (new state)
      const newStatePrecondition = parseStarkVerifyPrecondition(payload);

      // Parse witness from input (contains the proof)
      let witness = null;
      if (tzeInputData) {
        witness = parseStarkVerifyWitness(tzeInputData.payload);
      }

      if (newStatePrecondition) {
        extensionView = (
          <div className="p-0">
            <div className="flex flex-col gap-2 mb-4">
              <span className="text-xs text-[rgba(255,137,70,0.64)] font-semibold uppercase tracking-wider">Old State Root</span>
              {loadingOldState ? (
                <code className="font-mono text-[0.85rem] text-foreground break-all cursor-pointer py-2 px-3 bg-black/30 rounded-md border border-[rgba(255,107,26,0.1)] transition-all duration-200 hover:bg-black/50 hover:border-[rgba(255,107,26,0.3)]">Loading...</code>
              ) : oldStateRoot ? (
                <code className="font-mono text-[0.85rem] text-foreground break-all cursor-pointer py-2 px-3 bg-black/30 rounded-md border border-[rgba(255,107,26,0.1)] transition-all duration-200 hover:bg-black/50 hover:border-[rgba(255,107,26,0.3)]" onClick={() => copyToClipboard(oldStateRoot)} title="Click to copy">
                  {oldStateRoot}
                </code>
              ) : (
                <code className="font-mono text-[0.85rem] text-foreground break-all cursor-pointer py-2 px-3 bg-black/30 rounded-md border border-[rgba(255,107,26,0.1)] transition-all duration-200 hover:bg-black/50 hover:border-[rgba(255,107,26,0.3)]">Unable to fetch</code>
              )}
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <span className="text-xs text-[rgba(255,137,70,0.64)] font-semibold uppercase tracking-wider">New State Root</span>
              <code className="font-mono text-[0.85rem] text-foreground break-all cursor-pointer py-2 px-3 bg-black/30 rounded-md border border-[rgba(255,107,26,0.1)] transition-all duration-200 hover:bg-black/50 hover:border-[rgba(255,107,26,0.3)]" onClick={() => copyToClipboard(newStatePrecondition.root)} title="Click to copy">
                {newStatePrecondition.root}
              </code>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <span className="text-xs text-[rgba(255,137,70,0.64)] font-semibold uppercase tracking-wider">OS Program Hash</span>
              <code className="font-mono text-[0.85rem] text-foreground break-all cursor-pointer py-2 px-3 bg-black/30 rounded-md border border-[rgba(255,107,26,0.1)] transition-all duration-200 hover:bg-black/50 hover:border-[rgba(255,107,26,0.3)]" onClick={() => copyToClipboard(newStatePrecondition.osProgramHash)} title="Click to copy">
                {newStatePrecondition.osProgramHash}
              </code>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <span className="text-xs text-[rgba(255,137,70,0.64)] font-semibold uppercase tracking-wider">Bootloader Program Hash</span>
              <code className="font-mono text-[0.85rem] text-foreground break-all cursor-pointer py-2 px-3 bg-black/30 rounded-md border border-[rgba(255,107,26,0.1)] transition-all duration-200 hover:bg-black/50 hover:border-[rgba(255,107,26,0.3)]" onClick={() => copyToClipboard(newStatePrecondition.bootloaderProgramHash)} title="Click to copy">
                {newStatePrecondition.bootloaderProgramHash}
              </code>
            </div>

            {witness && witness.proofData && (
              <div className="flex flex-col gap-2 mb-0">
                <span className="text-xs text-[rgba(255,137,70,0.64)] font-semibold uppercase tracking-wider">Proof</span>
                <div className="flex flex-col gap-2.5">
                  <code
                    className={`font-mono text-xs text-foreground break-all cursor-pointer py-3 px-3 bg-black/30 rounded-md border border-[rgba(255,107,26,0.1)] transition-all duration-200 hover:bg-black/50 hover:border-[rgba(255,107,26,0.3)] leading-relaxed overflow-y-auto ${
                      expandedProof ? 'max-h-[600px]' : 'max-h-[200px]'
                    }`}
                    onClick={() => copyToClipboard(witness.proofData)}
                    title="Click to copy"
                  >
                    {expandedProof
                      ? witness.proofData
                      : `${witness.proofData.slice(0, 120)}...${witness.proofData.slice(-120)}`
                    }
                  </code>
                  <div className="flex items-center justify-end gap-3">
                    <span className="text-xs text-muted font-mono">{witness.proofSizeMB} MB</span>
                    <button
                      className="py-1.5 px-4 bg-[rgba(255,107,26,0.1)] border border-[rgba(255,107,26,0.3)] rounded-md text-accent text-xs font-semibold cursor-pointer transition-all duration-200 hover:bg-[rgba(255,107,26,0.2)] hover:border-[rgba(255,107,26,0.5)] font-sans"
                      onClick={() => setExpandedProof(!expandedProof)}
                    >
                      {expandedProof ? 'Collapse' : 'Expand'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }
    }
  }

  // Fallback for demo or unknown extensions
  if (!extensionView) {
    extensionView = (
      <div className="p-0">
        <p className="m-0 text-muted text-sm italic">Extension details view coming soon</p>
      </div>
    );
  }

  const TZE_BADGE_STYLES = {
    stark_verify: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    demo: 'bg-blue-500/15 text-blue-300 border-blue-500/30'
  };

  return (
    <div className="mt-0 p-0">
      <div className="h-px my-8 mb-6" style={{
        background: 'linear-gradient(to right, transparent, rgba(255, 107, 26, 0.3), transparent)'
      }}></div>

      <div className="flex items-center gap-3 mb-5">
        <h3 className="text-base font-semibold text-accent m-0 font-mono uppercase tracking-wider">TZE Details</h3>
        <span className={`inline-block py-1 px-3 rounded-md text-xs font-semibold uppercase tracking-wide font-mono border ${TZE_BADGE_STYLES[typeName] || TZE_BADGE_STYLES.demo}`}>
          {typeName}
        </span>
      </div>

      <div className="p-5 bg-[rgba(12,13,17,0.4)] rounded-[10px] border border-[rgba(255,107,26,0.15)]">
        {/* Verifier Field - shown for both Initialize and Verify modes */}
        <div className="flex flex-col gap-2 pb-2">
          <div className="flex justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-[rgba(255,137,70,0.64)] font-medium font-mono uppercase tracking-wider">Verifier</span>
              {loadingVerifier ? (
                <span className="font-mono text-sm text-muted">Loading...</span>
              ) : verifierName ? (
                <a
                  href={`#/verifier/${verifierName}`}
                  className="font-mono text-sm text-accent-strong font-semibold hover:text-accent transition-colors duration-200 no-underline"
                >
                  {verifierName}
                </a>
              ) : (
                <span className="font-mono text-sm text-muted italic">Not available</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {tzeMode === 1 && spendingTzeInput && spendingTzeInput.txid && (
                <a
                  href={`#/tx/${spendingTzeInput.txid}`}
                  className="inline-flex items-center gap-1.5 py-1.5 px-3 text-sm font-medium text-accent no-underline rounded-md border border-[rgba(255,107,26,0.3)] bg-[rgba(255,107,26,0.05)] transition-all duration-200 hover:bg-[rgba(255,107,26,0.15)] hover:border-[rgba(255,107,26,0.5)] hover:-translate-x-0.5 whitespace-nowrap"
                  title="View the previous STARK Verify transaction"
                >
                  ← View Prev Verify
                </a>
              )}
              {nextVerifyTx && (
                <a
                  href={`#/tx/${nextVerifyTx}`}
                  className="inline-flex items-center gap-1.5 py-1.5 px-3 text-sm font-medium text-accent no-underline rounded-md border border-[rgba(255,107,26,0.3)] bg-[rgba(255,107,26,0.05)] transition-all duration-200 hover:bg-[rgba(255,107,26,0.15)] hover:border-[rgba(255,107,26,0.5)] hover:translate-x-0.5 whitespace-nowrap"
                  title="View the next STARK Verify transaction"
                >
                  View Next Verify →
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pb-4 mb-4 border-b border-[rgba(255,107,26,0.1)]">
          <div className="flex justify-between items-center gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-[rgba(255,137,70,0.64)] font-medium font-mono uppercase tracking-wider">Mode</span>
              <span className="font-mono text-sm text-accent-strong font-semibold">{modeName}</span>
            </div>
          </div>
          {modeDescription && (
            <p className="m-0 text-muted text-sm italic">{modeDescription}</p>
          )}
        </div>

        {extensionView}
      </div>
    </div>
  );
}

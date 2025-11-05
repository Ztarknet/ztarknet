import React, { useState, useEffect } from 'react';
import { rpcCall } from '@services/rpc';
import { copyToClipboard } from '@utils/formatters';
import {
  parseTZEData,
  getTZETypeName,
  getTZEModeName,
  parseStarkVerifyPrecondition,
  parseStarkVerifyWitness
} from '@utils/tze-parser';

export function TZEDetailsView({ tx }) {
  const [expandedProof, setExpandedProof] = useState(false);
  const [oldStateRoot, setOldStateRoot] = useState(null);
  const [loadingOldState, setLoadingOldState] = useState(false);

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

        // Fetch the previous transaction (verbose=1 for decoded JSON)
        const prevTx = await rpcCall('getrawtransaction', [spendingTzeInput.txid, 1]);

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

  if (!tzeOutputData) {
    return <div className="tze-details-error">Unable to parse TZE data</div>;
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
          <div className="tze-extension-view">
            <div className="tze-field">
              <span className="tze-field-label">Genesis State</span>
              <code className="tze-field-value" onClick={() => copyToClipboard(precondition.root)} title="Click to copy">
                {precondition.root}
              </code>
            </div>
            <div className="tze-field">
              <span className="tze-field-label">OS Program Hash</span>
              <code className="tze-field-value" onClick={() => copyToClipboard(precondition.osProgramHash)} title="Click to copy">
                {precondition.osProgramHash}
              </code>
            </div>
            <div className="tze-field">
              <span className="tze-field-label">Bootloader Program Hash</span>
              <code className="tze-field-value" onClick={() => copyToClipboard(precondition.bootloaderProgramHash)} title="Click to copy">
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
          <div className="tze-extension-view">
            <div className="tze-field">
              <span className="tze-field-label">Old State Root</span>
              {loadingOldState ? (
                <code className="tze-field-value">Loading...</code>
              ) : oldStateRoot ? (
                <code className="tze-field-value" onClick={() => copyToClipboard(oldStateRoot)} title="Click to copy">
                  {oldStateRoot}
                </code>
              ) : (
                <code className="tze-field-value">Unable to fetch</code>
              )}
            </div>

            <div className="tze-field">
              <span className="tze-field-label">New State Root</span>
              <code className="tze-field-value" onClick={() => copyToClipboard(newStatePrecondition.root)} title="Click to copy">
                {newStatePrecondition.root}
              </code>
            </div>

            <div className="tze-field">
              <span className="tze-field-label">OS Program Hash</span>
              <code className="tze-field-value" onClick={() => copyToClipboard(newStatePrecondition.osProgramHash)} title="Click to copy">
                {newStatePrecondition.osProgramHash}
              </code>
            </div>

            <div className="tze-field">
              <span className="tze-field-label">Bootloader Program Hash</span>
              <code className="tze-field-value" onClick={() => copyToClipboard(newStatePrecondition.bootloaderProgramHash)} title="Click to copy">
                {newStatePrecondition.bootloaderProgramHash}
              </code>
            </div>

            {witness && witness.proofData && (
              <div className="tze-field">
                <span className="tze-field-label">Proof</span>
                <div className="tze-proof-container">
                  <code
                    className={`tze-proof-data ${expandedProof ? 'expanded' : ''}`}
                    onClick={() => copyToClipboard(witness.proofData)}
                    title="Click to copy"
                  >
                    {expandedProof
                      ? witness.proofData
                      : `${witness.proofData.slice(0, 120)}...${witness.proofData.slice(-120)}`
                    }
                  </code>
                  <div className="tze-proof-actions">
                    <span className="tze-proof-size">{witness.proofSizeMB} MB</span>
                    <button
                      className="tze-proof-toggle"
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
      <div className="tze-extension-view">
        <p className="tze-description">Extension details view coming soon</p>
      </div>
    );
  }

  return (
    <div className="tze-details-container">
      <div className="tze-separator"></div>

      <div className="tze-header">
        <h3 className="title">TZE Details</h3>
        <span className={`tze-badge tze-badge-${typeName}`}>{typeName}</span>
      </div>

      <div className="tze-combined-view">
        <div className="tze-mode-field">
          <div>
            <span className="tze-field-label">Mode</span>
            <span className="tze-field-value">{modeName}</span>
          </div>
          {modeDescription && (
            <p className="tze-description">{modeDescription}</p>
          )}
        </div>

        {extensionView}
      </div>
    </div>
  );
}

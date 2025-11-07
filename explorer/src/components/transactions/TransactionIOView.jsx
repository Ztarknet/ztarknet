import React from 'react';
import { formatZEC } from '@utils/formatters';

export function TransactionIOView({ tx }) {
  const numInputs = tx.vin ? tx.vin.length : 0;
  const numOutputs = tx.vout ? tx.vout.length : 0;

  const handleInputClick = (input) => {
    if (input.txid && !input.coinbase) {
      window.location.hash = `#/tx/${input.txid}`;
    }
  };

  return (
    <div className="tx-io-container">
      {/* Inputs */}
      <div className="tx-io-column">
        <h3 className="tx-io-title">Inputs ({numInputs})</h3>
        <div className="tx-io-list">
          {tx.vin && tx.vin.map((input, idx) => (
            <div
              key={idx}
              className={`tx-io-item ${!input.coinbase ? 'tx-io-item-clickable' : ''}`}
              onClick={() => handleInputClick(input)}
              style={!input.coinbase ? { cursor: 'pointer' } : {}}
            >
              <div className="tx-io-header">
                <span className="tx-io-index">#{idx}</span>
              </div>
              {input.coinbase ? (
                <div className="tx-io-field">
                  <span className="tx-io-label">Coinbase</span>
                  <code className="tx-io-value">{input.coinbase}</code>
                </div>
              ) : (
                <>
                  <div className="tx-io-field">
                    <span className="tx-io-label">Previous Output</span>
                    <code className="tx-io-value">{input.txid}:{input.vout}</code>
                  </div>
                </>
              )}
              <div className="tx-io-field">
                <span className="tx-io-label">Sequence</span>
                <span className="tx-io-value">{input.sequence}</span>
              </div>
              {input.scriptSig && (
                <div className="tx-io-field">
                  <span className="tx-io-label">Script Size</span>
                  <span className="tx-io-value">{input.scriptSig.hex ? input.scriptSig.hex.length / 2 : 0} bytes</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Outputs */}
      <div className="tx-io-column">
        <h3 className="tx-io-title">Outputs ({numOutputs})</h3>
        <div className="tx-io-list">
          {tx.vout && tx.vout.map((output, idx) => (
            <div key={idx} className="tx-io-item">
              <div className="tx-io-header">
                <span className="tx-io-index">#{output.n}</span>
              </div>
              <div className="tx-io-field">
                <span className="tx-io-label">Value</span>
                <span className="tx-io-value highlight zec-value">{formatZEC(output.value || 0)} ZEC</span>
              </div>
              {output.scriptPubKey && (
                <>
                  <div className="tx-io-field">
                    <span className="tx-io-label">Script</span>
                    <code className="tx-io-value">{output.scriptPubKey.hex}</code>
                  </div>
                  {output.scriptPubKey.addresses && output.scriptPubKey.addresses.length > 0 && (
                    <div className="tx-io-field">
                      <span className="tx-io-label">Address{output.scriptPubKey.addresses.length > 1 ? 'es' : ''}</span>
                      {output.scriptPubKey.addresses.map((addr, addrIdx) => (
                        <code key={addrIdx} className="tx-io-value">{addr}</code>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

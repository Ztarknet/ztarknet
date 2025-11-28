import React, { useState, useEffect } from 'react';
import { formatZEC } from '@utils/formatters';
import { GlowingEffect } from '@/components/common/GlowingEffect';
import { getOutputSpenders } from '@/services/zindex/tx_graph';

export function TransactionIOView({ tx }) {
  const [spenders, setSpenders] = useState({});
  const [loadingSpenders, setLoadingSpenders] = useState(false);

  const numInputs = tx.vin ? tx.vin.length : 0;
  const numOutputs = tx.vout ? tx.vout.length : 0;

  // Fetch spending info for outputs
  useEffect(() => {
    if (!tx.txid) return;

    setLoadingSpenders(true);
    getOutputSpenders(tx.txid)
      .then(data => {
        // Build a map of vout index -> spending txid
        // API returns array with { txid, vout, spent_by_txid, ... }
        const spenderMap = {};
        if (Array.isArray(data)) {
          data.forEach(spender => {
            if (spender.vout !== undefined && spender.spent_by_txid) {
              spenderMap[spender.vout] = spender.spent_by_txid;
            }
          });
        }
        setSpenders(spenderMap);
      })
      .catch(err => {
        console.error('Failed to fetch output spenders:', err);
        setSpenders({});
      })
      .finally(() => setLoadingSpenders(false));
  }, [tx.txid]);

  const handleInputClick = (input) => {
    if (input.txid && !input.coinbase) {
      window.location.hash = `#/tx/${input.txid}`;
    }
  };

  const handleOutputClick = (output) => {
    const spendingTxid = spenders[output.n];
    if (spendingTxid) {
      window.location.hash = `#/tx/${spendingTxid}`;
    }
  };

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
      {/* Inputs */}
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-semibold text-accent m-0 font-mono uppercase tracking-wider">Inputs ({numInputs})</h3>
        <div className="flex flex-col gap-4">
          {tx.vin && tx.vin.map((input, idx) => (
            <div
              key={idx}
              className={`reveal-on-scroll relative p-4 border border-[rgba(255,137,70,0.2)] rounded-lg flex flex-col gap-2.5 ${
                !input.coinbase ? 'transition-all duration-200 hover:-translate-x-1 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(255,107,26,0.2)] cursor-pointer' : 'transition-all duration-200'
              }`}
              onClick={() => handleInputClick(input)}
              style={{
                background: 'radial-gradient(circle at bottom left, rgba(255, 107, 26, 0.04), rgba(8, 8, 12, 0.85) 70%)'
              }}
            >
              <GlowingEffect proximity={64} spread={30} />
              <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,137,70,0.1)]">
                <span className="text-xs font-mono font-bold text-accent">#{idx}</span>
              </div>
              {input.coinbase ? (
                <div className="flex flex-col gap-1">
                  <span className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)]">Coinbase</span>
                  <code className="text-[0.85rem] text-foreground font-mono break-all leading-tight">{input.coinbase}</code>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  <span className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)]">Previous Output</span>
                  <code className="text-[0.85rem] text-foreground font-mono break-all leading-tight">{input.txid}:{input.vout}</code>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <span className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)]">Sequence</span>
                <span className="text-[0.85rem] text-foreground font-mono break-all leading-tight">{input.sequence}</span>
              </div>
              {input.scriptSig && (
                <div className="flex flex-col gap-1">
                  <span className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)]">Script Size</span>
                  <span className="text-[0.85rem] text-foreground font-mono break-all leading-tight">{input.scriptSig.hex ? input.scriptSig.hex.length / 2 : 0} bytes</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Outputs */}
      <div className="flex flex-col gap-4">
        <h3 className="text-base font-semibold text-accent m-0 font-mono uppercase tracking-wider">Outputs ({numOutputs})</h3>
        <div className="flex flex-col gap-4">
          {tx.vout && tx.vout.map((output, idx) => {
            const isSpent = spenders[output.n] !== undefined;
            return (
            <div
              key={idx}
              className={`reveal-on-scroll relative p-4 border border-[rgba(255,137,70,0.2)] rounded-lg flex flex-col gap-2.5 transition-all duration-200 hover:translate-x-1 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(255,107,26,0.2)] ${
                isSpent ? 'cursor-pointer' : ''
              }`}
              style={{
                background: 'radial-gradient(circle at bottom right, rgba(255, 107, 26, 0.04), rgba(8, 8, 12, 0.85) 70%)'
              }}
              onClick={() => handleOutputClick(output)}
            >
              <GlowingEffect proximity={64} spread={30} />
              <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,137,70,0.1)]">
                <span className="text-xs font-mono font-bold text-accent">#{output.n}</span>
                {!loadingSpenders && (
                  <span className={`text-[0.65rem] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${
                    isSpent
                      ? 'bg-[rgba(255,107,26,0.15)] text-[rgba(255,137,70,0.8)]'
                      : 'bg-[rgba(76,175,80,0.15)] text-[rgba(76,175,80,0.9)]'
                  }`}>
                    {isSpent ? 'Spent' : 'Unspent'}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)]">Value</span>
                <span className="text-[0.85rem] text-accent-strong font-semibold font-mono break-all leading-tight min-w-[120px] inline-block text-left">{formatZEC(output.value || 0)} ZEC</span>
              </div>
              {output.scriptPubKey && (
                <>
                  <div className="flex flex-col gap-1">
                    <span className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)]">Script</span>
                    <code className="text-[0.85rem] text-foreground font-mono break-all leading-tight">{output.scriptPubKey.hex}</code>
                  </div>
                  {output.scriptPubKey.addresses && output.scriptPubKey.addresses.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[0.7rem] font-mono uppercase tracking-wider text-[rgba(255,137,70,0.64)]">Address{output.scriptPubKey.addresses.length > 1 ? 'es' : ''}</span>
                      {output.scriptPubKey.addresses.map((addr, addrIdx) => (
                        <a
                          key={addrIdx}
                          href={`#/account/${addr}`}
                          className="inline-flex items-center gap-1.5 font-mono text-[0.85rem] text-accent-strong font-semibold hover:text-accent transition-colors duration-200 no-underline group break-all leading-tight"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {addr}
                          <svg
                            className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </a>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          );
          })}
        </div>
      </div>
    </div>
  );
}

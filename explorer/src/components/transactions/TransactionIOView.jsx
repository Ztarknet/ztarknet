import React from 'react';
import { formatZEC } from '@utils/formatters';
import { GlowingEffect } from '@/components/common/GlowingEffect';

export function TransactionIOView({ tx }) {
  const numInputs = tx.vin ? tx.vin.length : 0;
  const numOutputs = tx.vout ? tx.vout.length : 0;

  const handleInputClick = (input) => {
    if (input.txid && !input.coinbase) {
      window.location.hash = `#/tx/${input.txid}`;
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
              className={`relative p-4 border border-[rgba(255,137,70,0.2)] rounded-lg flex flex-col gap-2.5 ${
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
          {tx.vout && tx.vout.map((output, idx) => (
            <div
              key={idx}
              className="relative p-4 border border-[rgba(255,137,70,0.2)] rounded-lg flex flex-col gap-2.5 transition-all duration-200 hover:translate-x-1 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(255,107,26,0.2)]"
              style={{
                background: 'radial-gradient(circle at bottom right, rgba(255, 107, 26, 0.04), rgba(8, 8, 12, 0.85) 70%)'
              }}
            >
              <GlowingEffect proximity={64} spread={30} />
              <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,137,70,0.1)]">
                <span className="text-xs font-mono font-bold text-accent">#{output.n}</span>
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
                        <code key={addrIdx} className="text-[0.85rem] text-foreground font-mono break-all leading-tight">{addr}</code>
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

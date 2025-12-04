'use client';

import { getOutputSpenders } from '@/services/zindex/tx_graph';
import type { RpcTransaction, Vin, Vout, ZindexTransaction } from '@/types/transaction';
import { formatZEC } from '@/utils/formatters';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface TransactionIOViewProps {
  tx: RpcTransaction | ZindexTransaction;
}

interface OutputSpender {
  vout: number;
  spent_by_txid?: string;
}

export function TransactionIOView({ tx }: TransactionIOViewProps) {
  const router = useRouter();
  const [spenders, setSpenders] = useState<Record<number, string>>({});
  const [loadingSpenders, setLoadingSpenders] = useState<boolean>(false);

  const numInputs = tx.vin ? tx.vin.length : 0;
  const numOutputs = tx.vout ? tx.vout.length : 0;

  // Fetch spending info for outputs
  useEffect(() => {
    if (!tx.txid) return;

    setLoadingSpenders(true);
    getOutputSpenders(tx.txid)
      .then((data: OutputSpender[]) => {
        const spenderMap: Record<number, string> = {};
        if (Array.isArray(data)) {
          data.forEach((spender: OutputSpender) => {
            if (spender.vout !== undefined && spender.spent_by_txid) {
              spenderMap[spender.vout] = spender.spent_by_txid;
            }
          });
        }
        setSpenders(spenderMap);
      })
      .catch((err: unknown) => {
        if (err instanceof Error) {
          console.error('Failed to fetch output spenders:', err.message);
        } else {
          console.error('Failed to fetch output spenders:', err);
        }
        setSpenders({});
      })
      .finally(() => setLoadingSpenders(false));
  }, [tx.txid]);

  const handleInputClick = (input: Vin) => {
    if (input.txid && !input.coinbase) {
      router.push(`/tx/${input.txid}`);
    }
  };

  const handleOutputClick = (output: Vout) => {
    const spendingTxid = spenders[output.n];
    if (spendingTxid) {
      router.push(`/tx/${spendingTxid}`);
    }
  };

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
      {/* Inputs */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-accent m-0 font-mono uppercase tracking-wider">
          Inputs ({numInputs})
        </h3>
        <div className="flex flex-col gap-3">
          {tx.vin?.map((input: Vin, idx: number) => (
            <div
              key={input.txid ? `${input.txid}-${input.vout}` : `coinbase-${idx}`}
              className={`p-4 bg-white/[0.02] border border-white/5 rounded-lg flex flex-col gap-2 ${
                !input.coinbase ? 'cursor-pointer hover:border-white/10 transition-colors' : ''
              }`}
              onClick={() => handleInputClick(input)}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !input.coinbase) {
                  e.preventDefault();
                  handleInputClick(input);
                }
              }}
              role={!input.coinbase ? 'button' : undefined}
              tabIndex={!input.coinbase ? 0 : undefined}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-xs font-mono font-medium text-accent">#{idx}</span>
              </div>
              {input.coinbase ? (
                <div className="flex flex-col gap-1 mt-1">
                  <span className="field-label">Coinbase</span>
                  <code className="text-sm text-foreground/80 font-mono break-all leading-tight">
                    {input.coinbase}
                  </code>
                </div>
              ) : (
                <div className="flex flex-col gap-1 mt-1">
                  <span className="field-label">Previous Output</span>
                  <code className="text-sm text-foreground/80 font-mono break-all leading-tight">
                    {input.txid}:{input.vout}
                  </code>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <span className="field-label">Sequence</span>
                <span className="text-sm text-foreground/80 font-mono break-all leading-tight">
                  {input.sequence}
                </span>
              </div>
              {input.scriptSig && (
                <div className="flex flex-col gap-1">
                  <span className="field-label">Script Size</span>
                  <span className="text-sm text-foreground/80 font-mono break-all leading-tight">
                    {input.scriptSig.hex ? input.scriptSig.hex.length / 2 : 0} bytes
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Outputs */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-accent m-0 font-mono uppercase tracking-wider">
          Outputs ({numOutputs})
        </h3>
        <div className="flex flex-col gap-3">
          {tx.vout?.map((output: Vout) => {
            const isSpent = spenders[output.n] !== undefined;
            return (
              <div
                key={output.n}
                className={`p-4 bg-white/[0.02] border border-white/5 rounded-lg flex flex-col gap-2 transition-colors ${
                  isSpent ? 'cursor-pointer hover:border-white/10' : ''
                }`}
                onClick={() => handleOutputClick(output)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && isSpent) {
                    e.preventDefault();
                    handleOutputClick(output);
                  }
                }}
                role={isSpent ? 'button' : undefined}
                tabIndex={isSpent ? 0 : undefined}
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-xs font-mono font-medium text-accent">#{output.n}</span>
                  {!loadingSpenders && (
                    <span
                      className={`text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded border ${
                        isSpent
                          ? 'bg-amber-500/10 text-amber-400/80 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400/80 border-emerald-500/20'
                      }`}
                    >
                      {isSpent ? 'Spent' : 'Unspent'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1 mt-1">
                  <span className="field-label">Value</span>
                  <span className="text-sm text-accent font-semibold font-mono break-all leading-tight">
                    {formatZEC(output.value || 0)} ZEC
                  </span>
                </div>
                {output.scriptPubKey && (
                  <>
                    <div className="flex flex-col gap-1">
                      <span className="field-label">Script</span>
                      <code className="text-sm text-foreground/80 font-mono break-all leading-tight">
                        {output.scriptPubKey.hex}
                      </code>
                    </div>
                    {output.scriptPubKey.addresses && output.scriptPubKey.addresses.length > 0 && (
                      <div className="flex flex-col gap-1">
                        <span className="field-label">
                          Address{output.scriptPubKey.addresses.length > 1 ? 'es' : ''}
                        </span>
                        {output.scriptPubKey.addresses.map((addr: string) => (
                          <Link
                            key={addr}
                            href={`/account/${addr}`}
                            className="text-sm text-accent hover:text-accent-strong font-mono break-all leading-tight transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {addr}
                          </Link>
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

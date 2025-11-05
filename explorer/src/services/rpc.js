const RPC_ENDPOINT = 'https://rpc.regtest.ztarknet.cash';

// RPC helper function
export async function rpcCall(method, params = []) {
  try {
    const response = await fetch(RPC_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '1.0',
        id: 'explorer',
        method: method,
        params: params,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.result;
  } catch (error) {
    console.error('RPC Error:', error);
    throw error;
  }
}

export { RPC_ENDPOINT };

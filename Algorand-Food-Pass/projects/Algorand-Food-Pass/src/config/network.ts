export function getAlgodConfig() {
  return {
    network: 'testnet',
    algodServer: 'https://testnet-api.algonode.cloud',
    algodPort: '',
    explorerBase: 'https://lora.algokit.io/testnet',
  } as const
}

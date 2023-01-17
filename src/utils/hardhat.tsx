import { providers } from 'ethers'

export const impersonate = async (
  address: `0x${string}`,
  provider: providers.JsonRpcProvider
) => {
  await provider.send('hardhat_impersonateAccount', [address])
  await provider.send('hardhat_setBalance', [address, '0x10000000000000000000'])
  const signer = await provider.getSigner(address)
  return signer
}

export const advanceTime = async (
  to: number,
  provider: providers.JsonRpcProvider
) => {
  await provider.send('evm_setNextBlockTimestamp', [to])
  await provider.send('evm_mine', [])
}

export const mineBlock = async (provider: providers.JsonRpcProvider) => {
  await provider.send('evm_mine', [])
}

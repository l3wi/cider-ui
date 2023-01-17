import { BigNumber, constants, ethers, utils } from 'ethers'
import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useContext
} from 'react'
import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractRead,
  useContractReads,
  useProvider
} from 'wagmi'
import fetch from 'isomorphic-fetch'

import { ciderABI } from '../constants/cider'
import {
  CIDER_CONTRACT,
  CURVE_POOL_OWNER,
  CURVE_POOL_TOKEN,
  GEAR_TOKEN
} from '../constants/config'
import { curveABI } from '../constants/curvev2'

type Props = {
  children?: React.ReactNode
}

const callList = [
  'stage',
  'gearDepositStart',
  'gearMinAmount',
  'gearMaxAmount',
  'ethDepositStart',
  'ethMinAmount',
  'ethMaxAmount',
  'fairTradingStart',
  'fairTradingEnd',
  'getTimeUntilLPClaim',
  'totalEthCommitted',
  'totalGearCommitted',
  'totalLPTokens',
  'PRICE_MULTIPLIER',
  'curvePool',
  'getPriceRangeGearEth',
  'getCurrentShearingPct'
]

type CiderContract = {
  PRICE_MULTIPLIER: BigNumber
  curvePool: `0x${string}`
  ethDepositStart: BigNumber
  ethMaxAmount: BigNumber
  ethMinAmount: BigNumber
  fairTradingEnd: BigNumber
  fairTradingStart: BigNumber
  gearDepositStart: BigNumber
  gearMaxAmount: BigNumber
  gearMinAmount: BigNumber
  getPriceRangeGearEth: { minPrice: BigNumber; maxPrice: BigNumber }
  getTimeUntilLPClaim: BigNumber
  stage: number
  totalEthCommitted: BigNumber
  totalGearCommitted: BigNumber
  totalLPTokens: BigNumber
  getCurrentShearingPct: BigNumber
  totalFees: BigNumber
}

const nullData: CiderContract = {
  PRICE_MULTIPLIER: BigNumber.from(0),
  curvePool: ethers.constants.AddressZero,
  gearDepositStart: BigNumber.from(0),
  gearMaxAmount: BigNumber.from(0),
  gearMinAmount: BigNumber.from(0),
  ethDepositStart: BigNumber.from(0),
  ethMaxAmount: BigNumber.from(0),
  ethMinAmount: BigNumber.from(0),
  fairTradingEnd: BigNumber.from(0),
  fairTradingStart: BigNumber.from(0),

  getPriceRangeGearEth: {
    minPrice: BigNumber.from(0),
    maxPrice: BigNumber.from(0)
  },
  getTimeUntilLPClaim: BigNumber.from(0),
  stage: 0,
  totalEthCommitted: BigNumber.from(0),
  totalGearCommitted: BigNumber.from(0),
  totalLPTokens: BigNumber.from(0),
  getCurrentShearingPct: BigNumber.from(0),
  totalFees: BigNumber.from(0)
}

const nullCurve = {
  virtualPrice: BigNumber.from(0),
  eth: BigNumber.from(0),
  gear: BigNumber.from(0),
  price: 0,
  tvl: 0,
  totalLP: BigNumber.from(0)
}

// create context
export const UseCiderContext = createContext({
  config: nullData,
  address: CIDER_CONTRACT,
  time: 0,
  price: 0,
  balances: [BigNumber.from(0), BigNumber.from(0)],
  curve: nullCurve
})

export const CiderProvider: React.FC<Props> = ({ children }) => {
  const address = CIDER_CONTRACT
  const provider = useProvider()
  const { address: userAddress } = useAccount()

  const [config, setConfig] = useState(nullData)
  const [time, setTime] = useState<number>(0)
  const [price, setPrice] = useState<number>(0)

  const { data: GLBGear } = useBalance({
    address: CIDER_CONTRACT,
    token: GEAR_TOKEN
  })

  const { data: balances } = useContractReads({
    contracts: [
      {
        address,
        abi: ciderABI,
        functionName: 'gearCommitted',
        args: [userAddress ? userAddress : constants.AddressZero]
      },
      {
        address,
        abi: ciderABI,
        functionName: 'ethCommitted',
        args: [userAddress ? userAddress : constants.AddressZero]
      }
    ],
    watch: true
  })

  // MutliCall Contract State
  const ciderContract = {
    address,
    abi: ciderABI
  }
  const { data: readData } = useContractReads({
    contracts: callList.map((key) => ({
      ...ciderContract,
      functionName: key
    })),
    watch: true
  })

  // Clean MultiCall data
  useEffect(() => {
    const configData: any = {}
    readData?.map((res, i) => (configData[callList[i]] = res))
    GLBGear && setConfig({ ...configData, totalFees: GLBGear.value })
  }, [readData, provider])

  // Curve Contract Info
  const [curve, setCurve] = useState(nullCurve)
  const { data: virtualPrice } = useContractRead({
    address: config.curvePool,
    abi: curveABI,
    functionName: 'virtual_price'
  })
  const { data: PoolGear } = useBalance({
    address: config.curvePool,
    token: GEAR_TOKEN
  })
  const { data: PoolEth } = useBalance({
    address: config.curvePool
  })

  const { data: totalLPTokens } = useContractRead({
    address: CURVE_POOL_TOKEN,
    abi: erc20ABI,
    functionName: 'totalSupply'
  })

  useEffect(() => {
    if (virtualPrice && PoolEth && PoolGear && totalLPTokens)
      setCurve({
        virtualPrice,
        eth: PoolEth.value,
        gear: PoolGear.value,
        price:
          (parseFloat(PoolEth.formatted) / parseFloat(PoolGear.formatted)) *
          price,
        tvl: parseFloat(PoolEth.formatted) * price * 2,
        totalLP: totalLPTokens
      })
  }, [virtualPrice, PoolEth, PoolGear, totalLPTokens])

  // Fetch ETH Price
  useEffect(() => {
    const func = async () => {
      const data = await fetch(
        'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD'
      ).then((res) => res.json())
      setPrice(data.USD)
    }

    if (!price) func()
  }, [price])

  // Fetch Blockchain time (Mainly for testing)
  useEffect(() => {
    const func = async () => {
      const block = await provider.getBlock('latest')
      setTime(block.timestamp)
    }
    if (provider) func()
  }, [provider])

  const values = useMemo(
    () => ({
      config,
      address,
      time,
      price,
      balances:
        typeof balances != 'undefined' && balances[0]
          ? balances
          : [BigNumber.from(0), BigNumber.from(0)],
      curve
    }),
    [config, time, price, balances, address, curve]
  )

  return (
    // the Provider gives access to the context to its children
    <UseCiderContext.Provider value={{ ...values }}>
      {children}
    </UseCiderContext.Provider>
  )
}

export function useCider() {
  const ciderContext = useContext(UseCiderContext)
  if (ciderContext === null) {
    throw new Error(
      'useCider() can only be used inside of <UseCiderProvider />, ' +
        'please declare it at a higher level.'
    )
  }
  const { config, address, time, price, balances, curve } = ciderContext

  return useMemo(
    () => ({ config, address, time, price, balances, curve }),
    [config, time, price, balances, address, curve]
  )
}

export default useCider

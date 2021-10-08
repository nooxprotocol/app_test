# app_test

0. 몽고DB 세팅에 대한 내용은 mongo_db폴더에 있습니다.

- 몽고DB실행은 root/docker-compose를 이용하여 진행.

1. main.ts -> 실행파일.

몽고DB Collection에 저장될 데이터 형태는 src/model에 있습니다.

# 목표

Predefined DB는 아래 3가지 입니다.

- RawTransaction
- Contract + ContractCategory
- Badge

Predefined DB를 이용하여 UserBadgeProgressDB를 갱신
UserBadgeProgressDB를 이용하여 UserBadgeDB를 갱신

# 제한사항

- ObjectID는 개발편의성으로 임시로 Number \_id로 부과하여 진행합니다.
- 부분진행에 대한 처리가 미비합니다.

# 데이터 검증

- 2021-01-01 RawTransaction 기준

## 사용량기준 컨트랙트 조회

```
db.getCollection('raw__transaction').aggregate(
[{
    $group: {
        _id: "$to_address",
        count: {$sum: 1}
    },
},
{ $sort : { count : -1} }
]);
```

### 종류

- 0xdac17f958d2ee523a2206206994597c13d831ec7: USDT
- 0x7a250d5630b4cf539739df2c5dacb4c659f2488d: UniSwap
- 0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48: USDC
- 0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f: SushiSwap
- 0x6b175474e89094c44da98b954eedeac495271d0f: DAI
- 0x514910771af9ca656af840dff83e8264ecf986ca: LINK
- 0x111111125434b319222cdbf8c261674adb56f3ae: 1inch
- 0x0000000000007f150bd6f54c40a34d7c3d5e9f56: MEV Bot
- 0x1f9840a85d5af5bf1d1762f925bdaddc4201f984: UniSwap
- 0x881d40237659c251811cec9c364ef91dc08d300c: MetaMask
- 0xc00e94cb662c3520282e6f5717214004a7f26888: ???
- 0xc00e94cb662c3520282e6f5717214004a7f26888: Compound
- 0xdef1c0ded9bec7f1a1670819833240f027b25eff: 0x
- 0x78a55b9b3bbeffb36a43d9905f654d2769dc55e8: Backrunning Bots
- 0x2b591e99afe9f32eaa6214f7b7629768c40eeb39: HEX
- 0x2a549b4af9ec39b03142da6dc32221fc390b5533: BlockFi
- 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2: WETH
- 0x419d0d8bdd9af5e606ae2232ed285aff190e711b: FUN
- 0x4b182469337d46e6603ed7e26ba60c56930a342c: ???
- 0x5acc84a3e955bdd76467d3348077d003f00ffb97: forsage
- 0xae17f4f5ca32f77ea8e3786db7c0b2fe877ac176: BCC
- 0x00000063f648c943346d2a239f0969bad32ff184: ???
- 0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d: Celsius
- 0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f: Synthetix Network Token
-

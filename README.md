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

Predefined DB를 이용하여 UserTxActivityDB를 갱신
UserTxActivityDB를 이용하여 UserBadgeDB를 갱신

# 제한사항

- ObjectID는 개발편의성으로 임시로 Number \_id로 부과하여 진행합니다.
- 부분진행에 대한 처리가 미비합니다.

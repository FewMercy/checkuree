<div style="display: flex; justify-content: center; align-items: center;">
    <img width="400" alt="centered image" src="https://github.com/FewMercy/checkuree/assets/117077999/16dba1e9-cac3-4db3-b831-3f9bc02ba38c">
</div>


# <img src="https://github.com/FewMercy/checkuree/assets/117077999/b559b853-dbf8-411f-9c6a-ea07f36a42fe" width="25"/> Hello, Checkuree!
* 안녕하세요 ! 우리의 출석 체크를 도와줄 개구리, **체쿠리**입니다.
* 체쿠리는 소규모 학원이나 학교에서 사용할 수 있는 출석 관리 서비스입니다.
* 여러분이 필요한 요일,시간대의 출석부를 생성해서 출석 관리를 해보세요 !

# 🌐 Links
> **Service** : [https://checkuree.com](https://checkuree.com) <br>
> **Swagger** : [https://checkuree.com/api/v1/swagger](https://checkuree.com/api/v1/swagger) <br>

# 🖥️ Example Screens
|                                                             출석부 목록 화면                                                             |                                                             출석부 생성 화면                                                             |                                                             출석체크 화면                                                              |                                                                                                               
|:---------------------------------------------------------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------------------------------------------------:| 
| <img width="160px" src="https://github.com/FewMercy/checkuree/assets/117077999/3e8bb321-bed5-405f-a631-6ad1c66e4f01" /> | <img width="160px" src="https://github.com/FewMercy/checkuree/assets/117077999/92a62623-e2e7-429b-9542-7ffb4e33d1ec" /> | <img width="160px" src="https://github.com/FewMercy/checkuree/assets/117077999/7242233f-0363-46fb-bc10-b49fa805710d"/> |

# ⚙️ How to Start
## 0️⃣ Prerequisites
* [Node.js 20.12.2](https://nodejs.org/en/download/package-manager/)
* [npm 10.5.0](https://www.npmjs.com/package/npm/v/10.5.2)
* [yarn 1.22.22](https://www.npmjs.com/package/yarn)
## 1️⃣ Installation
### Back-End
```bash       
$ cd server
$ npm install
```
### Front-End
```bash       
$ cd client
$ yarn install
```

## 2️⃣ Running the app

### Back-End
```bash
# before running, you need to fill .env.local file in server directory
# and need to start docker mysql container

# local
$ npm run start:local

# production mode
$ npm run start:prod

# Docker
$ docker-compose build
$ docker-compose up
```
### Front-End
```bash
# development
$ yarn dev

# production mode
$ yarn start
```

### Back-End Test
```bash
# move to server directory
$ cd server

# service layer tests
$ npm run test
```

# ✏️ ERD Diagram
<div style="display: flex; justify-content: center; align-items: center;">
    <img width="500" alt="centered image" src="https://github.com/FewMercy/checkuree/assets/117077999/9d23cbc9-33a0-4850-8ed3-787f0519695e">
</div>

# ⚒️ Stacks
## Infra
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white)
![Docker Compose](https://img.shields.io/badge/Docker%20Compose-2496ED?style=for-the-badge&logo=Docker&logoColor=white)
## Front-End
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&logoColor=white)
![Material UI](https://img.shields.io/badge/Material%20UI-007FFF?style=for-the-badge&logo=MUI&logoColor=white)
## Back-End
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=NestJS&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-F37626?style=for-the-badge&logo=TypeORM&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=Jest&logoColor=white)
## Database
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white)
## Deploy
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=AmazonAWS&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-269539?style=for-the-badge&logo=Nginx&logoColor=white)
![PM2](https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=PM2&logoColor=white)
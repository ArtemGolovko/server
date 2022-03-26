# Security Design
URL: accounts.domain.com
auth: OAuth2 (code grant, refresh token grant, password grant(for trusted apps))
API auth: access Token
ЛК


# API Design
## User entity
```json
{
	"name": "Даня",
	"username": "danygersh",
	"subscribers": "120000",
	"subs": "120", //то на сколько человек подписан
	"avatar": "https://www.meme-arsenal.com/memes/6f2f4841963c3e89ec5dfbc79e4cf8ec.jpg",
	"profileBanner": "https://avatanplus.com/files/resources/mid/5bcc3c463226516695cb723d.png",
	"isPrivate": false
}
```
Base URL: `/user`

#### CRUD & REST
| Action | Endpoint | HTTP Method | 
| ------ | -------- | ----------- |
| Read All | `/users` | GET |
| Read One | `/user/{username}` | GET |
| Update | `/user/{username}` | PUT |
## Post
Base URL: `/post`
```json
{
  "id": "",
  "author": "{user[name, username]}",
  "date": "тут ты хранишь в нужм тебе формате",
  "dateDiff": "вчера",
  "text": " Привет @artem #meteroговно",
  "hastags": [
	  "hashtag"
  ],
  "profileMarks": [
	  "{user[name]"
  ],
  "images": [
	  "https://c.tenor.com/o656qFKDzeUAAAAC/rick-astley-never-gonna-give-you-up.gif",
	  "https://c.tenor.com/o656qFKDzeUAAAAC/rick-astley-never-gonna-give-you-up.gif"
  ],
  "likes": 12034
}
```

## Comment entity
Base URL: `/post/{id}/comment`
```json
{
    "text": "Слышишь ты, ты лох ваще",
    "author": "{user[name, username]}",
    "likes": "1230",
    "replies": ["{relapy}"]
}
```

## Reply entity
```json
{
    "replyTo": null|"{username[name]}",
    "text": "Слышишь ты, ты лох ваще",
    "author": "{user[name, username]}",
    "likes": "1230"
}
```

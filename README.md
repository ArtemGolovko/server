# New Server

# Install

npm 8.3.1

node 17.4.0

1. Clone the repository. Run `git clone git@github.com:ArtemGolovko/server.git && cd server`
2. Create database.
3. Rename `.env.public` to `.env`, `ormconfig.public.json` to `ormconfig.json`.
4. Connect to database. Change `.env` and `ormconfig.jsom` to your needs.
5. Install dependencies. Run `npm install`.
6. Make migration. Run `npm run typeorm migration:generate -- -n AddUser`.

# Start app

Run `npm start` to start app.

Run `npm run build` to compile typescript. Generated sources should be under `dist` folder

# Info

Now this only test. It is contains basic CRUD on user.

User model:
```ts
@Entity()
class User {
    @PrimaryColumn("varchar", { "length": 255 })
    username: string;

    @Column("varchar", { "length": 255 })
    firstName: string

    @Column("varchar", { "length": 255 })
    lastName: string
}
```

## Api

To get all users execute `get` request on `http://localhost:3000/users`.

To get one user execute `get` request on `http://localhost:3000/user/{username}`. `{username}` is parameter. You may get 404 error if user not exists.

To get create user execute `post` request on `http://localhost:3000/users`. You should pass request body in json format like this:
```json
{
  "username": "{username}",
  "firstName": "{firstName}",
  "lastName": "{lastName}"
}
```
`{username}`, `{firstName}` and `{lastName}` are parameters. In case of success you should get 201 status code. 201 status code means 'created'. If you get 400 error, try to find and fix mistakes in json syntax. If you get 500 error, you don't pass **full** json.

To update user execute `put` request on `http://localhost:3000/user/{username}`. `{username}` is parameter. You should pass request body in json format like this:
```json
{
  "firstName": "{firstName}",
  "lastName": "{lastName}"
}
```
`{firstName}` and `{lastName}` are parameters. You may exclude some fields from json. You could get 404 or 400 error, you already know what whose means.

To delete user execute `delete` request on `http://localhost:300/user/{username}`. `{username}` is parameter. In case of success you should get 204 status code. 204 status code means 'no content'. If you get 404 error . . .

# File structure
* `dist/` - directory with compiled typescript.
* `node_modules/` - directory with nodejs stuff.
* `src/` - directory with source code:
  * `Entity/` - directory with typeORM entities.
  * `Migrations/` - directory with typeORM migrations.
  * `Subscriber/` - directory with typeORM subscribers.
  * `.env.public` - file with sample environment variables.
  * `app.ts` - main typescript file with app startup and app itself.
* `.gitignore` - says to git which file or folders to ignore.
* `nodemon.json` - file with nodemon config.
* `ormconfig.public.json` - file with sample typeORM config.
* `package.json` - file with dependencies.
* `packege-lock.json` - file locked versions of dependencies.
* `README.md` - this file.
* `tsconfig.json` - file with typescript config.

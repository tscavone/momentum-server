# momentum-server

The backend server for [momentum](https://github.com/tscavone/momentum).

### setup

To setup and run, follow these steps:

<<< under construction >>>

#### DB
- compile code `> tsc`
- to init database: `> mongo-migrate up .\dist\migrations\dev.0.js`
- to revert database: `> mongo-migrate down -a .\dist\migrations\dev.0.js`

NOTE: [momentum](https://github.com/tscavone/momentum) used to have the server integrated in the same repo, but I've separated them. 

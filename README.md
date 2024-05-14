
## Getting Started

1. **Initialize your environment**

I recommend using nvm for managing node versions.

Install nvm from [here](https://github.com/creationix/nvm)

Then install the node version for this assessment:

```sh
nvm i
```
To use the correct node version run
nvm use

1. **Install dependencies**

Next you'll need to install this app

```sh
npm install
```

1. **Run the backend**

The backend is a node/express server. Everything to do with the server lives in `/src`.

```sh
npm run backend
```

The address is http://localhost:5000/api/ip-to-country/:ip
To test the api please replace :ip with the corresponding ip you want to check
To use the api ipstack, please go to https://ipstack.com/ and generate your own api and create an .env file in root directory
and update it with apiKey="{your_api_key}"

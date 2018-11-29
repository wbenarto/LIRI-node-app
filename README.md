# LIRI-node-app

https://github.com/wbenarto/LIRI-node-app

## Brief App description

LIRI-node-app allows users to pull up information about a song, a movie, or a concert using Spotify, BandsInTown APIs and OMDb APIs via the appropriate NPM modules. LIRI uses API calls and returned JSON objects, outputting the information in a specified format. 

Watch how LIRI works: https://youtu.be/jqz086k84K8

## Technologies Used:
    Node.js
    JavaScript
    Spotify API (via spotify npm module)
    OMDb API (via Axios npm module)
    BandsInTown API (via Axios npm module)

## How to use the app
 Using inquirer, we simplified the search process by eliminating typing the command line suggested in instruction (ex: spotify-this song, movie-this, etc). Instead, users only need to put in "node liri" in the command line to start the queries which will bring them a prompt and take them to what they are trying to look for.

1. Insert "node liri" in the terminal:
![How to use the app](https://i.imgur.com/fWk6KU8.png)

2. Prompt then will give you 4 options to choose from:
![prompt](https://i.imgur.com/FwrcSOd.png)

3. Depending on the option you choose then LIRI will ask you for your query: 
![movie](https://i.imgur.com/8YIgQ2a.png)

4. Liri then show your search result and append the output in the log.txt
![output](https://i.imgur.com/nuHR07x.png)






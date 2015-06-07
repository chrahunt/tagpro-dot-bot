# Tagpro .Bot

Autonomous agent for the game TagPro.

After downloading, to run:
1. `npm install` to get development and other dependencies. (download and install nodejs if you haven't already, npm is installed with it)
2. `npm install -g gulp` to get gulp.
3. Get the [script loader](https://github.com/chrahunt/script-loader) chrome extension and load it as an unpacked extension.
4. Run `start server.bat` to start python web server that will serve the files (if you haven't already, install python 3).
5. Run `start gulp watch` to build the bot script from the source files. This will also watch for changes and rebuild. The resulting file will end up in `build/browserBot.js`.
6. Click the script loader browser action (should look like a chrome icon) and put the URL of the built file (by default this should be `http://localhost:8000/build/browserBot.js`) into the popup, save, and ensure the 'extension active' checkbox is checked.

The script loader only runs on maptest, tangent, and newcompte's servers, so you should be ok on that front.

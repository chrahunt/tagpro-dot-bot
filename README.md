# Tagpro .Bot

Autonomous agent for the game TagPro.

After downloading, to run:
1. `npm install` to get development and other dependencies. (download and install nodejs if you haven't already, npm is installed with it)
2. `npm install -g gulp` to get gulp.
3. Get the [script loader](https://github.com/chrahunt/script-loader) chrome extension and load it as an unpacked extension.
4. Run `npm install -g http-server` to install a (fast) node module that can serve our files locally. After installing, you can run using `http-server --cors -c-1`. This informs the server to set the CORS header properly so we can access resources cross-domain, and also to inform the browser not to cache anything we serve.
5. Run `start gulp watch` to build the bot script from the source files. This will also watch for changes and rebuild. The resulting file will end up in `build/browserBot.js`.
6. Click the script loader browser action (should look like a chrome icon) and put the URL of the built file (by default this should be `http://localhost:8080/build/browserBot.js`) into the popup, save, and ensure the 'extension active' checkbox is checked.

The script loader only runs on maptest, tangent, and newcompte's servers, so you should be ok on that front.

## Organization

Steerer module handles the real-time movement actions given by the brain.

Communication is done through the bot state.
`target` is the steering information object.
has properties:
* `loc` - optional, required for static type
* `id` - optional, required for dynamic type.
* `type` -  one of "static" or "dynamic"
* `movement` - type of approach, one of "seek", "arrive", "align"
* `velocity` - optional, required for align movement.



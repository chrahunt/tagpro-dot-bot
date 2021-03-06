# Tagpro .Bot

Autonomous agent for the game TagPro.

## Usage

.bot runs in the browser. To start:

1. Download the repository.
2. Ensure that you have [Node.js](https://nodejs.org/) installed.
3. Open a console window at the root of the project directory and execute `npm install` to get development and other dependencies.
4. Execute `npm install -g gulp-cli` so you can just run `gulp` directly.
5. Get the [script loader](https://github.com/chrahunt/script-loader) chrome extension and load it Chrome as an unpacked extension.
6. Run `npm install -g http-server` to install a (fast) node module that can serve our files locally.
7. After installing, you can run using `http-server --cors -c-1`. This informs the server to set the CORS header properly so we can access resources cross-domain, and also to inform the browser not to cache anything we serve.
8. Run `gulp watch` to build the bot script from the source files. This will also watch for changes and rebuild. The resulting compiled file will end up in `build/browserBot.js`.
9. In your browser, click the script loader browser action (should look like a chrome icon) and put the URL of the output file (by default this should be `http://localhost:8080/build/browserBot.js`) into the popup, save, and ensure the 'extension active' checkbox is checked.
10. Navigate to a test server and start the game!

Note: The script loader extension above only runs on maptest, tangent, and newcompte's servers, so as long as you use that method to inject the script into the page there shouldn't be any issues with the bot running inadvertently on production servers.

## Development

Documentation can be generated by calling `gulp doc` in the root of the project. Documentation output is placed in `docs`.

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



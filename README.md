# SIG Javascript Tooling

Welcome to the SIG about javascript tooling. Today we will be taking an in-depth look at the different tools we typically use while writing javascript code. We will begin with a simple [React](https://reactjs.org/) project written in an HTML file and adding [npm](https://www.npmjs.com/), [webpack](https://webpack.js.org/), [typescript](https://www.typescriptlang.org/), [eslint](https://eslint.org/), [prettier](https://github.com/prettier/prettier), [git hooks](https://githooks.com/), [babel](https://babeljs.io/) and [jest](https://jestjs.io/).

## First steps

We will start of with a plain HTML file and no tooling whatsoever. It is completely possible, but not very effective to write JavaScriptin this way. Open up folder `1-no-tooling` and take a look at the html file provided.

In the first two script tags, we import React and ReactDOM, the two packages needed to run React in the browser (whereas for a native app you would use React and React-Native).
In the third script tag, we can write some javascript. Try adding something like

```javascript
ReactDOM.render(React.createElement(React.createElement("h1", {}, "AMIENS")), document.getElementById("root"));
```

and open the HTML page in your browser. You should see the header on your webpage. Now try adding something a bit more complex:

- Add a const called App, which returns a new `React.createElement()` with a div tag. The third argument of this call is an array. Move the h1 `React.createElement` to this array.
- Change to `ReactDOM.render(React.createElement(App), document.getElementById("root"));`. Refresh your page to see if it still works.
- Add a `const` called Restaurant, which contains an arrow function taking the argument `props` and returning `React.createElement()` with as arguments a parent div tag, an empty object and an array of three `React.createElement()` calls. The first of these calls should return an h1 with as value `props.name`, the second one an h3 tag with as value `props.city` and the third a paragraph tag with as value `props.stars`.
- To the array of your top level div add two calls to `React.createElement` with as arguments `Restaurant` and an object containing a name, city and stars for two restaurants you like. Refresh your page and check if you see your restaurants.

## NPM, WebPack and Babel

While it was possible to write React without any tooling, you probably did not have a great time doing it. Different types of tooling exist for different reasons, but one thing they all have in common is the fact that they are there to make your life as a developer easier. We will start of by adding NPM, Node Package Manager, to manage our packages and define out scripts. Go into the folder 2-npm-webpack and run the following commands in order to initiliaze npm and add the required packages:

```bash
yarn init -y
yarn add react react-dom
yarn add -D weback webpack-cli
```

This will add a basic `package.json` to your project, with the defined dependencies and devDependencies.

We can now add a couple of JavaScript files. Add an `index.js` file to `src\` in which you can add a simple piece of JS:

```javascript
import React from "react";
import * as ReactDOM from "react-dom";
import Restaurant from "./Restaurant";

const App = () => {
  const restaurants = [
    { name: "Nicos", city: "Utrecht", stars: 5 },
    {
      name: "Athene",
      city: "Amsterdam",
      stars: 2
    }
  ];
  return (
    <div>
      <h1>AMIENS</h1>
      {restaurants.map(Restaurant)}
    </div>
  );
};

export default App;
ReactDOM.render(<App />, document.getElementById("root"));
```

And to the file `Restaurant.js` add:

```javascript
import React from "react";

const Restaurant = props => {
  return (
    <div>
      <h2>{props.name}</h2>
      <h3>{props.city}</h3>
      <h4>{props.stars}</h4>
    </div>
  );
};

export default Restaurant;
```

Finally, add to your package.json:

```json
  "scripts": {
    "build": "webpack --mode development"
  },
```

This command will use webpack in order to create a packaged version of your application, which means that all your javascript files will be bundled into one file. Webpack will also perform tree shaking, which means that only the used parts of your code and npm modules will be included and so-called dead code will not be included. This is a great way to keep your bundle small and easily delivered over the net.

When you run `yarn build` in your console, you will notice that you get an error. This is because React uses [JSX](https://reactjs.org/docs/introducing-jsx.html), a combination of JavaScript and HTML. In order for webpack to understand JSX, we must use a [loader](https://webpack.js.org/loaders/). Loaders are plugins for webpack which help it preprocess files to a format it can understand. By default, webpack has loaders for JS and JSON. We will add babel-loader, a loader which can transpile javascript for us. We will also add the react preset (a plugin) for babel loader, so it will understand React.

```bash
yarn add -D @babel/core babel-loader @babel/preset-react
```

and then add a file `webpack.config.js`

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"]
          }
        }
      }
    ]
  }
};
```

If you run `yarn build` now, it should create a folder `dist/` containing a file named `main.js` with a bunch of javascript. This is mostly React code, but if you scroll down to the bottom you will see code which looks a lot like the code you wrote in step 1!

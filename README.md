# SIG Javascript Tooling

Welcome to the SIG about javascript tooling. Today we will be taking an in-depth look at the different tools we typically use while writing javascript code. The focus of todays lab is to set up a complete project using modern, best practice tooling. We will begin with a simple [React](https://reactjs.org/) project written in an HTML file and adding [npm](https://www.npmjs.com/), [webpack](https://webpack.js.org/), [typescript](https://www.typescriptlang.org/), [eslint](https://eslint.org/), [prettier](https://github.com/prettier/prettier), [git hooks](https://githooks.com/), [babel](https://babeljs.io/) and [jest](https://jestjs.io/).

## First steps

We will start of with a plain HTML file and no tooling whatsoever. It is completely possible, but not very effective to write JavaScriptin this way. Open up folder `1-no-tooling` and take a look at the html file provided.

In the first two script tags, we import React and ReactDOM, the two packages needed to run React in the browser (whereas for a native app you would use React and React-Native).
In the third script tag, we can write some javascript. Try adding something like

```javascript
ReactDOM.render(React.createElement(React.createElement('h1', {}, 'AMIENS')), document.getElementById('root'));
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
import React from 'react';
import * as ReactDOM from 'react-dom';
import Restaurant from './Restaurant';

const App = () => {
  const restaurants = [
    { name: 'Nicos', city: 'Utrecht', stars: 5 },
    {
      name: 'Athene',
      city: 'Amsterdam',
      stars: 2,
    },
  ];
  return (
    <div>
      <h1>AMIENS</h1>
      {restaurants.map(Restaurant)}
    </div>
  );
};

export default App;
ReactDOM.render(<App />, document.getElementById('root'));
```

And to the file `Restaurant.js` add:

```javascript
import React from 'react';

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
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
    ],
  },
};
```

If you run `yarn build` now, it should create a folder `dist/` containing a file named `main.js` with a bunch of javascript. This is mostly React code, but if you scroll down to the bottom you will see code which looks a lot like the code you wrote in step 1! Of course this is not very useful yet, since we did not include our HTML page. We will have to add an HTML loader to our webpack config.
First add the packages html-loader and html-webpack-plugin to your project.
Then update the webpack config:

```javascript
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: [':data-src'],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
  ],
};
```

If you now run `yarn build` it will include the html file! If you take a look at the file, you will notice that it has automatically added a line which makes sure your JavaScript will be executed.

```html
  <script type="text/javascript" src="main.js"></script></body>
```

When you open up the file in your browser, you will see it works just as expected. With just a few simple steps, this is starting to look like an actual project!

## TypeScript and hot reload

### Typescript

These days, most people consider using TypeScript the default over plain JavaScript. While at times it might be annoying, its advantages outway its disadvantages and it helps immensely with finding bugs early.

Switching a project over to typescript is rather easy. We need to do three things:

- add a tsconfig.json
- convert our javascript files to typescript
- add a babel loader for typescript

Go into `3-typescript-hotReload` and add
the required packages with a `yarn add -D typescsript @types/react @types/react-dom ts-loader`.
Then add a `tsconfig.json` file. Edit this file to contain the following snippet. You can find the meaning of the options in [the TypeScript docs](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react"
  },
  "include": ["src"]
}
```

Rename your two .js files to .tsx and edit `src/Restaurant.tsx` to have an interface for its props:

```typescript
interface IProps {
  name: string;
  city: string;
  stars: number;
}
```

And finally, update your `webpack.config.js`. Change the test for javascript to the following test:

```javascript
{
  test: /\.(ts|tsx)$/,
  exclude: /node_modules/,
  use: {
    loader: 'ts-loader',
  },
},
```

Now go and run `yarn build`. You should get an error saying webpack cannot find your entry module. This is because webpack does not yet know to look for `.ts` and `.tsx` files. This is easily fixed by adding the following to your webpack config:

```javascript
module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
};
```

If you run `yarn build` and open your website, everyting should be working again.

### Hot Reload

Manually building your website and then opening it is not very dev friendly. What we want is a hot reload, which opens your page for you and reloads it when you make a change to your files. Luckily, this is incredibly simple. All we need to do is is install a package with `yarn add -D webpack-dev-server` and add a script to our package.json:

```JSON
    "start": "webpack-dev-server --mode development --open --hot"
```

Now run `yarn start` and make some changes to your react app. When you save your changes, webpack will re-bundle your files for you and refresh your browser tab to show the changes.

## TSLint, prettier, editorConfig

### TSLint

Most of the time we write code in collaboration. As a team we would like our can as readable, maitainable and free of functional errors as it can be. To keep it that we use a linter. A linter is an utility tool that analyze your code and emits warning or errors based on the rules you've set.

To setup linting for typescript we need to install two packages: `tslint` and `tslint-loader`. Use `-D` to install as devDependencies. To make webpack check our typescript code we need to add to our `webpack.config.js` the following settings:

````javascript
  {
    test: /\.(ts|tsx)$/,
    enforce: 'pre',
    exclude: /node_modules/,
    use: [
      {
        loader: 'tslint-loader',
        options: {
          emitErrors: true,
        }
      }
    ]
  },
  {
    test: /\.(ts|tsx)$/,
    exclude: /node_modules/,
    use: {
      loader: 'ts-loader',
    },
  },
  // other configuration
````

In the root of our project add a file called `tslint.json` and add the following:

````json
  {
    "rules": {
      "no-console": true
  }
````

Add a console in a typescript file in the `src` folder. Run `yarn start` again to apply the settings you've made. 

In your terminal an error should appear which says the following:
````bash
  ERROR in ./src/[fileName]
  Module Error (from ./node_modules/tslint-loader/index.js):
  ERROR: (no-console) C:/Users/XT_KHENNIS/Documents/Projects/Own/4-Eslint-Prettier-EditorConfig_EsLint/src/[fileName].tsx: Calls to 'console.log' are not allowed.
````
We've set a simple rule which says "No console functions in the typescript". This is just one of many. On the [TSLint](https://palantir.github.io/tslint/rules/) website you'll find all the rule you can set. Here below is a piece of configuration which contains a set of basic linting rules you can set for your typescript code. Read it and use it try to understand what different kind of rules enforce. Linting rules are something personal and each person prefer a different set. Try different rules in your project and find which one you like and which you don't 

````json
{
  "defaultSeverity": "error",
  "extends": [
    "tslint:recommended",
    "tslint-config-prettier"
  ],
  "jsRules": {},
  "rules": {
    "max-line-length": [true, {
      "limit": 200
    }],
    "radix": [false],
    "indent": [true, "spaces", 2],
    "quotemark": [true, "single", "avoid-escape", "avoid-template"],
    "arrow-parens": [false],
    "curly": [false],
    "ordered-imports": false,
    "member-access": false,
    "object-literal-sort-keys": [false],
    "member-ordering": [false],
    "variable-name": [false],
    "max-classes-per-file": false,
    "no-consecutive-blank-lines": [true, 2]
  },
  "rulesDirectory": []
}

````

To run tslint separately add in your `package.json` inside `scripts` the following: `tslint --config ./tslint.json \"./src/*.{ts,tsx}\"`. And run in your command line `yarn tslint`.

### Prettier

TSLint can take care of your code formatting. There are dependencies which do it for you. Prettier is one of them. [Prettier](https://prettier.io/docs/en/index.html) is an oppionated, but extensible library which lets you format your code in a way you and your teammates all agree to. But as you see in the tslint.json file, there are a lot of rules which also check for format inconsistencies. Those rules should be taken care of by Prettier, because Prettier also does your formatting based on the settings you've set.

To let Prettier taken care of your formatting we need to install some dependecies. In you command line type `yarn add -D prettier tslint-plugin-prettier tslint-config-prettier`.

Prettier is the dependency to take care of your formatting. tslint-plugin-prettier lets Prettier run with TSLint. tslint-config-prettier disables all TSLint rules which are conflicting with the Prettier options. Here is a [full list of rules](https://unpkg.com/tslint-config-prettier@1.18.0/lib/index.json) which are getting disabled. 

In your `tslint.json` add tslint-plugin-prettier and tslint-config-prettier to the extends section. tslint-config-prettier must be placed last so it will disable al the rules which conflict with prettier. Under `rules` add prettier and set it to true. This will check your files based on the default settings of prettier. If you want to have you own options replace true by an array with in the first position true, and in the second position an object with some options you've set. Check [here](https://prettier.io/docs/en/options.html) for some options. The `tslint.json` will look something like this. NOTE!: I've delete some rules like singleQuote, no-consecutive-blank-lines, etc. This is because the tslint-config-prettier disables all coflicting formatting rules. I replaced those rules with the prettier-like styles.

````json
{
  "defaultSeverity": "error",
  "extends": [
    "tslint:recommended",
    "tslint-plugin-prettier",
    "tslint-config-prettier"
  ],
  "jsRules": {},
  "rules": {
    "prettier": [
      true,
      {
          "trailingComma": "es5",
          "tabWidth": 2,
          "printWidth" 200,
          "semi": false,
          "singleQuote": true
      }
    ],
    "radix": [false],
    "arrow-parens": [false],
    "curly": [false],
    "ordered-imports": false,
    "member-access": false,
    "object-literal-sort-keys": [false],
    "member-ordering": [false],
    "variable-name": [false],
    "max-classes-per-file": false,
  },
  "rulesDirectory": []
}

````

Restart webpack. You should see in your console some warnings or errors like this:

````bash
WARNING in ./src/Restaurant.tsx
Module Warning (from ./node_modules/tslint-loader/index.js):
[1, 19]: Replace `'react'` with `"react"`
[4, 1]: Replace `··` with `····`
[5, 1]: Insert `··`
[6, 1]: Insert `··`
[10, 3]: Insert `··`
[11, 1]: Replace `····` with `········`
[12, 1]: Replace `······` with `············`
[13, 1]: Replace `······` with `············`
[14, 1]: Replace `······` with `············`
[15, 5]: Insert `····`
[16, 1]: Insert `··`
````
This means you have successfully add prettier to your project, but wait how do we say to prettier it should also format your files based on your options. Add in your `package.json` a new command called prettier and set it to "prettier": "prettier --config ./package.json --write \"./src/*.tsx\"". And add to a new prop called object and use the same configuration set in your tslint.json. This will run Prettier with the configurations in package.json and it will check and format all files in your src folder which have the .tsx extension. NOTE! We had to add the same configuration to our package.json. That's because prettier can't read your tslint.json file.

### EditorConfig

We have linting, we have formatting, but wait! Each developer has its own favorite IDE or editor and each editor has a different format style. Which will format your code as you type. This is where an EditorConfig comes in. An EditorConfig helps maintain consistent codig for multiple developers working on the same project across various editors and IDEs. The EditorConfig consists of a set of codings styles which helps a editor to adhere to the defined styles.

The editorConfig can look like the following:

````
  # EditorConfig is awesome: https://EditorConfig.org

  # top-most EditorConfig file
  root = true

  # Unix-style newlines with a newline ending every file
  [*]
  end_of_line = lf
  insert_final_newline = true

  # Matches multiple files with brace expansion notation
  # Set default charset
  [*.{js,py}]
  charset = utf-8

  # 4 space indentation
  [*.py]
  indent_style = space
  indent_size = 4

  # Tab indentation (no size specified)
  [Makefile]
  indent_style = tab

  # Indentation override for all JS under lib directory
  [lib/**.js]
  indent_style = space
  indent_size = 2

  # Matches the exact files either package.json or .travis.yml
  [{package.json,.travis.yml}]
  indent_style = space
  indent_size = 2
````

As you see you can set configurations per set of files you've specified. You can specify which files need a specific style by using the square brackets notation. Each new line with a square bracket notation identifies as a new set of rules only to apply to those files targeted that notation. It not necessary if you want to apply it to all files, but with different languages and precedents there will be settings only applicable to a specific set of files.

````
[*.js] # This will target all javascript files.
````

[Here](https://editorconfig-specification.readthedocs.io/en/latest) you can find a complete list of properties supported by the editorConfig.

To use the editorConfig you must install a plugin for your editor. For Visual Studio Code you'll need `EditorConfig for VS Code`.

In the root of your project create a file called `.editorconfig`. The first line of this file should always be `root=true`. This will make sure only settings inside this editorconfig file are used. Below this line add a square bracket notation which will target all files. (Check [here](https://editorconfig-specification.readthedocs.io/en/latest) for the syntax)
Below this line type end_of_line=crlf. This setting says that all line-breaks will be carriage-return (CR) followed by a line-feed (LF). There are more, but I encourage you to try those out for yourself.

## Babel: production build

## Bonus: testing (jest)

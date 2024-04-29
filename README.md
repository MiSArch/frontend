# frontend
The frontend of the MiSArch reference architecture: The web application for the online shop.

## Regarding the Purpose of This Repository
This repository contains the frontend, i.e. the user interface, for demonstrating and testing the functionality of the MiSArch microservice system. It basically is a web application - an online store. This forms the frontend of MiSArch, a reference architecture for microservices that implements the domain of an online store. The frontend can be used to demonstrate or test the individual microservices and their functions. For example, the frontend can be used to manage the online store's products.

## Documentation
[This is where you find the official documentation.](https://misarch.github.io/docs/docs/dev-manuals/services/frontend)

## Project setup
If you wanted to set up this repository locally, e.g., in order to do development tasks, you would have to git clone it -- obviously -- and then run the following command:

```
# yarn
yarn
```

The repository uses [yarn](https://yarnpkg.com) for package management.

### Setting up the backend
Git clone [this infrastructure repository](https://github.com/MiSArch/infrastructure-docker) and host the system on your machine using Docker.

### Compiles and hot-reloads for development

```
# yarn
yarn dev
```

### Compiles and minifies for production

```
# yarn
yarn build
```

### Lints and fixes files

```
# yarn
yarn lint
```

If you do **not** want the linter to fix files, run:

```
# yarn
yarn lint:check
```

### Runs the formatter

```
# yarn
yarn format
```

If you do **not** want the formatter to fix files, run:

```
# yarn
yarn format:check
```

### Customize configuration

See [Configuration Reference](https://vitejs.dev/config/).

## License
MIT License

Copyright (c) 2023 MiSArch - A representable microservice reference architecture

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
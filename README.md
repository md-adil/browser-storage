# Browser config

localStorage wrapper for convenient access.

## Installation

    yarn add browser-config


```js
import BrowserConfig from "browser-config";
const config = new BrowserConfig();

// setting value
config.name = "Hello"

// getting value
config.name // "hello"


// deleting
delete config.name //

// using getters and settings

config.set('name', 'Hello');

config.get('name') // Hello

config.delete('name')

config.get('name') // undefined
config.name // undefined

// can support any serializable data

config.users = [{ name: 'Hello' }]

config.users // [{ name: 'Hello' }]

// mutation is not supported
config.users.push({name: 'New User'}); // x will not work

// adding new value to array
config.users = [ ...config.users, {name: 'New User'} ]
```

Multiple instances
```js

const config1 = new BrowserConfig('abcd'); // id
const config2 = new BrowserConfig('dcba'); // id

config1.name = 'Something'

config2.name = 'Something else'

config1.name // Something
config2.name // Something else

```

## Allow iterate

```js
const config = new BrowserConfig('default', true) // iterable

config.name = 'Something'
config.email = 'johndoe@example.com'

for (const [ key, value ] of config) {
    console.log({ key, value }) // { key: 'email', value: 'Something' } and on
}

```

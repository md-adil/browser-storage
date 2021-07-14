# Browser config

I know you can use localStorage but is this convenient and performed like accessing property from an object.

## Installation

    yarn add browser-config

```js
import Store from "browser-config";
const config = new Store();

// setting value
config.name = "Hello"

// by default it save data to the cache only and update to native storage in next event loop.

// getting value
config.name // "hello"
// you can get config.name again and again it wont request to native storage and deserialize instead it will cache data

console.log([...Store.keys(config)])
// by default Store.keys return generators you need to spread it to use

Object.fromEntries(config) // {name: "Hello"}
Store.values(config) // {name: "Hello"}

// deleting
delete config.name //
config.name // undefined

// can support any serializable data
config.users = [{ name: 'Hello' }]
config.users // [{ name: 'Hello' }]

// mutation is not supported
config.users.push({name: 'New User'}); // x will not work
// adding new value to array
config.users = [ ...config.users, { name: 'New User'}]
```
Multiple instances
```js

const config1 = new Store('abcd'); // id
const config2 = new Store('dcba'); // id

config1.name = 'Something'

config2.name = 'Something else'

config1.name // Something
config2.name // Something else
```
## Allow iterate
```js
const config = new Store('default') // iterable
config.name = 'Something'
config.email = 'johndoe@example.com'
for (const [ key, value ] of config) {
    console.log({ key, value }) // { key: 'email', value: 'Something' } and on
}
```

## Session storage
By default it will save to localStorage and localStorage is permanent, you can save it sessionStorage as wel

```ts
const config = new Store('some_id', {
    validity: "session"
});

config.name = "Hello" // will be saved till browser closed.
```

## Typescript users
```ts
interface IPerson {
    name?: string;
    age?: number
}

const person = Store.create<IPerson>();
person.age = 'hello' // error
person.age = 20 // pass
```

## Custom driver
Sometimes you need to save data to other than localStorage, sessionStorage let's say in cookies.

```ts
import Store, { IDriver } from "browser-config";
class Driver implements IDriver {

    set(key: string, val: string) {
        // sourced from https://www.w3schools.com/js/js_cookies.asp
        document.cookie = `${key}=${val}`;
        return this;
    }

    get(key: string) {
        // sourced from https://www.w3schools.com/js/js_cookies.asp
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
            c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
    }

    remove(key: string) {
        // sourced from https://www.w3schools.com/js/js_cookies.asp
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        return this;
    }

    keys() {
        // need to be implemented
    }
}

const storage = new Store("1", { driver: new Driver() });
storage.data = 'hello';
expect(storage.data).toBe('hello');
```

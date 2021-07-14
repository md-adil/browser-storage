# Browser config

You can use `localStorage` or `sessionStorage`. But is this convenient and performed like accessing property from an object ? No it's not.

## Examples

## Installation

    yarn add browser-config

Importing the library

```js
import Store from "browser-config";
```

```js
const config = new Store();

// setting value
config.name = "Hello"
// By default it save data to the cache only and update/serialize data in next event loop.

// getting value
config.name // "hello"
// you can get config.name again and again it won't request to storage or deserialize,
// instead it will get data from the cache only.

[...Store.keys(config)] // ["name"]
// Store.keys return generators, you need to spread it to use as an array.

Object.fromEntries(config) // { name: "Hello" }
// or 
Store.values(config) // { name: "Hello" }

// deleting
delete config.name
config.name // undefined

// clearing all the data
Store.clear(config) // length of cleared items;

// can support any serializable data

config.users = [{ name: 'Hello' }]
config.users // [{ name: 'Hello' }]

// mutation is not supported
config.users.push({name: 'New User'}); // x will not work
// adding new value to array
config.users = [ ...config.users, { name: 'New User'}]
```

## Multiple instances

```js

const config1 = new Store('abcd'); // id
const config2 = new Store('dcba'); // id

config1.name = 'Something'

config2.name = 'Something else'

config1.name // Something
config2.name // Something else
```

## Iterate through all the data
```js
const config = new Store('default')
config.name = 'Something'
config.email = 'johndoe@example.com'
for (const [ key, value ] of config) {
    console.log({ key, value }) // { key: 'email', value: 'Something' } and so on...
}
```

## Session storage
By default it will save to localStorage and it is permanent, you can save it sessionStorage as well.

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
        let name = key + "=";
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

## References

### instantiate

```ts
import Store from "browser-config";
const store = new Store(id, option)
```
* `id?: string` unique for unique storage
*  `option?`
    * `validity: "session" | "permanent"` validity of the data for particular storage, default is `permanent`.
    * `driver: IDriver` custom driver


### static methods
* `Store.id(store): string` generated or passed id
* `Store.keys(store: Store): Iterable<string>` get all the keys
* `Store.values(store: Store): {[key: string]: any}` get all the values
* `Store.clear(store): string` clearing all the values
* `Store.update(store, data: object)` update values in bulk
* `Store.set(store, data: object)` it will delete all the existing value and set the provided object

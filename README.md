# Browser config

You can use `localStorage` or `sessionStorage`. But is this convenient and performed like accessing property from an object ? No it's not.


## Examples

### Installation

    yarn add browser-config

Importing the library

```js
import Store from "browser-config";
```

```ts
const store = new Store();
```
Saving person to localStorage
```ts
store.person = {
    firstName: "John",
    lastName: "Doe",
    age: 22
};
```
> This will save the person in cache only, serialization and store in to localStorage will happen in next event cycle.
> So even if we save same property multiple times it will touch the localStorage only once.

Getting person
```ts
console.log(store.person)
```
    {
        firstName: "John",
        lastName: "Doe",
        age: 22
    }
> if the person is present in the cache, it will return from cache, otherwise it will query localStorage, deserialize, save into cache and return person.

Getting all keys

```ts
console.log([...Store.keys(store)]);
```
    [
        "person"
    ]

> Store.keys() will return generator, need to spread to use as an array

Getting all values

```ts
console.log(Object.fromEntries(store));
```
    {
        person: {
            firstName: "John",
            lastName: "Doe",
            age: 22
        }
    }

or
```ts
console.log(Store.values(store))
```

Deleting

```ts
delete store.person
```
or

```ts
store.person = undefined;
```

Clear everything

```ts
Store.clear(store);
```

```js
// can support any serializable data
store.users = [{ name: 'Hello' }]
store.users // [{ name: 'Hello' }]

// mutation is not supported
store.users.push({name: 'New User'}); // x will not work
// adding new value to array
store.users = [ ...config.users, { name: 'New User'}]
```

### Multiple instances

```js

const config1 = new Store('abcd'); // id
const config2 = new Store('dcba'); // id

config1.name = 'Something'

config2.name = 'Something else'

config1.name // Something
config2.name // Something else
```

### Iterate through all the data
```js
const config = new Store('default')
config.name = 'Something'
config.email = 'johndoe@example.com'
for (const [ key, value ] of config) {
    console.log({ key, value }) // { key: 'email', value: 'Something' } and so on...
}
```

### Session storage
By default it will save to localStorage and it is permanent, you can save it sessionStorage as well.

```ts
const config = new Store('some_id', {
   validity: "session"
});

config.name = "Hello" // will be saved till browser closed.
```

### Typescript users
```ts
interface IPerson {
    name?: string;
    age?: number
}

const person = Store.create<IPerson>();
person.age = 'hello' // error
person.age = 20 // pass
```

### Custom driver
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

### toJSON

```ts
const store = new Store();

store.name = "hello"
store.email = "hello@world.com";

JSON.stringify(store) // {"name": "hello", "email": "hello@world.com"}
store.toJSON = "Something else";
// toJSON is a built-in method and it is only method/property built-in it doesn't mean you can't store this as a property.
// you can still use but there is a slightly different approach for accessing the value
// if using typescript use can see type error

store.toJSON // [Function toJSON]
store.toJSON().toJSON // 'Something else'
```

## Reference

### Instantiate

```ts
import Store from "browser-config";
const store = new Store(id, option)
```
* `id?: string` unique for unique storage
*  `option?`
    * `validity: "session" | "permanent"` validity of the data for particular storage, default is `permanent`.
    * `driver: IDriver` custom driver


### static methods
* `Store.id(store: Store): string` generated or passed id
* `Store.keys(store: Store): Iterable<string>` get all the keys
* `Store.values(store: Store): {[key: string]: any}` get all the values
* `Store.clear(store: Store): string` clearing all the values
* `Store.update(store: Store, data: object)` update values in bulk
* `Store.set(store: Store, data: object)` it will delete all the existing value and set the provided object
* `Store.clearCache(store: Store)` it will delete cache
* `Store.savePending(store: Store)` It does save everything to cache only and put data to localStorage in next event, but you can force this to happen in the current cycle


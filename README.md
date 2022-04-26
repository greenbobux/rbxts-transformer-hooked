
# Installation
install with `npm install --save-dev rbxts-transformer-hooked`

add this to compiler options in your `tsconfig.json`
<br/>
```json
"plugins": [
    {
        "transform": "rbxts-transformer-hooked"
    }
]
 ```

 
Automatically wraps functional components with `hooked()` from `@rbxts/roact-hooked`. <br/>
It imports `hooked` for you, if you have not already done it.

> Its a WIP, so its pretty janky, if you use hooked() "manually", it will error.
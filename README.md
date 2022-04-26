
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


# Examples

```ts
import Roact from "@rbxts/roact";
import { useState } from "@rbxts/roact-hooked";

const Counter = ({ Font }: { Font: Enum.Font }) => {
	const [clicks, updateClicks] = useState(0);
	return (
		<textbutton
			BorderSizePixel={0}
			TextScaled={true}
			Text={`Clicks: ${clicks}`}
			Event={{
				MouseButton1Click: () => updateClicks(clicks + 1),
			}}
			Font={Font}
		/>
	);
};

<Counter Font={Enum.Font.Cartoon} />;
```

Output

```lua
-- Compiled with roblox-ts v1.3.3
local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"))
local Roact = TS.import(script, TS.getModule(script, "@rbxts", "roact").src)
local _roact_hooked = TS.import(script, TS.getModule(script, "@rbxts", "roact-hooked").out)
local hooked = _roact_hooked.hooked
local useState = _roact_hooked.useState
local Counter = hooked(function(_param)
	local Font = _param.Font
	local _binding = useState(0)
	local clicks = _binding[1]
	local updateClicks = _binding[2]
	return Roact.createElement("TextButton", {
		BorderSizePixel = 0,
		TextScaled = true,
		Text = "Clicks: " .. tostring(clicks),
		[Roact.Event.MouseButton1Click] = function()
			return updateClicks(clicks + 1)
		end,
		Font = Font,
	})
end)
Roact.createElement(Counter, {
	Font = Enum.Font.Cartoon,
})
```
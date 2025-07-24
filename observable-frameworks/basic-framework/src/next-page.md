---
title: Another Page
pager: false
footer: Space for <a href="https://aurawalmer.com", target=_blank>Aura Walmer</a> to mess with code.
---

## Next Page in Simple Framework

Setting up pages in menu.

Inputs.button:

```js
import tex from "npm:@observablehq/tex";
import {FileAttachment} from "observablehq:stdlib";
```


```js
const playButton = view(
    Inputs.button("Play", {
        value: 0, 
        reduce: (value) => value + 1 
        }
    )
)
// is there a way apply the "checkHover" event listener to this constant? 
```

```js
function createHoverableText(text) {
  return html`<span class="hover-highlight">${text}</span>`;
}
```

```js
const checkHover = document.querySelector(".hoverStyle"); // Select by class
```

```js
checkHover.addEventListener('mouseover', () => {
    // Change cursor on hover
    checkHover.style.cursor = 'pointer'; // Or any other valid CSS cursor value
 });

checkHover.addEventListener('mouseout', () => {
    // Revert cursor when not hovering
    checkHover.style.cursor = 'default'; // Or the original cursor value
});
```


```js
const soundFile = FileAttachment("audio/sonic-sketch.mp3") 
// want to be able to have audio play when you click text, then pause when you click again. restart if you click again. 
```

<div class="hoverStyle">${createHoverableText("These words get highlight when you hover over them.")}<div>


<style>
.hover-highlight {
  /* Basic style for the Tex content */
  color: white;
  transition: background-color 0.2s ease-in-out; /* Smooth transition for hover effect */
}

.hover-highlight:hover {
  /* Style applied on hover */
  color: black;
  background-color: yellow; /* Highlight color */
}
</style>

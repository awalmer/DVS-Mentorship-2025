---
title: Play Page
theme: deep-space
---

<div class="hero">
  <h1>data : art : sound</h1>
  <h2>I'm practicing using Observable Framework.</h2>
</div>

---


<h2>Testing embedding SVGs</h2>
<br>

<div>
<svg id="Artboard5:_Test_lines" data-name="Artboard5: Test lines" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1469.34 1469.34">
  <rect x="2.84" y="2.84" width="1463.66" height="1463.66" style="fill: #232323; stroke-width: 0px;"/>
  <g>
    <circle cx="734.67" cy="734.67" r="13.82" style="fill: #f9f7f9; stroke: #cafaf6; stroke-miterlimit: 10;"/>
    <line x1="451.83" y1="451.83" x2="734.67" y2="734.67" style="fill: none; stroke: #cafaf6; stroke-miterlimit: 10; stroke-width: 2px;"/>
    <line x1="553.07" y1="378.27" x2="734.67" y2="734.67" style="fill: none; stroke: #cafaf6; stroke-miterlimit: 10; stroke-width: 2px;"/>
    <line x1="672.1" y1="339.59" x2="734.67" y2="734.67" style="fill: none; stroke: #cafaf6; stroke-miterlimit: 10; stroke-width: 2px;"/>
    <line x1="797.24" y1="339.59" x2="734.67" y2="734.67" style="fill: none; stroke: #cafaf6; stroke-miterlimit: 10; stroke-width: 2px;"/>
    <line x1="916.27" y1="378.27" x2="734.67" y2="734.67" style="fill: none; stroke: #cafaf6; stroke-miterlimit: 10; stroke-width: 2px;"/>
    <line x1="1017.51" y1="451.83" x2="734.67" y2="734.67" style="fill: none; stroke: #cafaf6; stroke-miterlimit: 10; stroke-width: 2px;"/>
    <line x1="1091.07" y1="553.07" x2="734.67" y2="734.67" style="fill: none; stroke: #cafaf6; stroke-miterlimit: 10; stroke-width: 2px;"/>
    <line x1="1129.74" y1="672.1" x2="734.67" y2="734.67" style="fill: none; stroke: #cafaf6; stroke-miterlimit: 10; stroke-width: 2px;"/>
    <line x1="1129.74" y1="797.24" x2="734.67" y2="734.67" style="fill: none; stroke: #cafaf6; stroke-miterlimit: 10; stroke-width: 2px;"/>
    <line x1="1091.07" y1="916.27" x2="734.67" y2="734.67" style="fill: none; stroke: #cafaf6; stroke-miterlimit: 10; stroke-width: 2px;"/>
    <line x1="1017.51" y1="1017.51" x2="734.67" y2="734.67" style="fill: none; stroke: #cafaf6; stroke-miterlimit: 10; stroke-width: 2px;"/>
    <line x1="916.26" y1="1091.07" x2="734.67" y2="734.67" style="fill: none; stroke: #cafaf6; stroke-miterlimit: 10; stroke-width: 2px;"/>
    <line x1="797.24" y1="1129.74" x2="734.67" y2="734.67" style="fill: none; stroke: #cafaf6; stroke-miterlimit: 10; stroke-width: 2px;"/>
    <line x1="672.09" y1="1129.74" x2="734.67" y2="734.67" style="fill: none; stroke: #cafaf6; stroke-miterlimit: 10; stroke-width: 2px;"/>
    <line x1="553.07" y1="1091.07" x2="734.67" y2="734.67" style="fill: none; stroke: #cafaf6; stroke-miterlimit: 10; stroke-width: 2px;"/>
    <line x1="451.83" y1="1017.51" x2="734.67" y2="734.67" style="fill: none; stroke: #cafaf6; stroke-miterlimit: 10; stroke-width: 2px;"/>
    <line x1="378.27" y1="916.26" x2="734.67" y2="734.67" style="fill: none; stroke: #cafaf6; stroke-miterlimit: 10; stroke-width: 2px;"/>
    <line x1="339.59" y1="797.24" x2="734.67" y2="734.67" style="fill: none; stroke: #cafaf6; stroke-miterlimit: 10; stroke-width: 2px;"/>
    <line x1="339.59" y1="672.09" x2="734.67" y2="734.67" style="fill: none; stroke: #cafaf6; stroke-miterlimit: 10; stroke-width: 2px;"/>
    <line x1="378.27" y1="553.07" x2="734.67" y2="734.67" style="fill: none; stroke: #cafaf6; stroke-miterlimit: 10; stroke-width: 2px;"/>
  </g>
</svg>

</div>


```js
import confetti from "npm:canvas-confetti";
import * as Plot from "npm:@observablehq/plot";
```

```js
Inputs.button("Throw confetti! 🎉", {reduce: () => confetti()})
```

```js
const random = d3.randomLcg(42);
const x = Array.from({length: 500}, random);
const y = Array.from({length: 500}, random);
const chart = Plot.voronoi(x, {x, y, fill: x}).plot({nice: true});

display(chart);
```


<div class="grid grid-cols-4">
  <div class="card"><h1>A</h1></div>
  <div class="card"><h1>B</h1></div>
  <div class="card"><h1>C</h1></div>
  <div class="card"><h1>D</h1></div>
</div>

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: left;
  font-family: var(--sans-serif);
  margin: 1rem 0 1rem;
  text-wrap: balance;
  text-align: left;
}

.hero h1 {
  margin: 1rem 0;
  padding: 1rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 25px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 70px;
  }
}

</style>

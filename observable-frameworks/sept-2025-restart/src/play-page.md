---
title: Play Page
theme: deep-space
---

<div class="hero">
  <h1>data : art : sound</h1>
  <h2>I'm practicing using Observable Framework.</h2>
</div>

---

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

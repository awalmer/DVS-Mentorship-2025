---
toc: false
theme: [ocean-floor, wide]
---

# Sonification Examples in Journalism

## Ah, another attempt at a table

```js
import {DonutChart} from "./components/donutChart.js";
import {bigNumber} from "./components/bigNumber.js";

// Converts a Google Sheets website URL to its CSV URL. You can also go to “File → Publish to web”, select the “Comma-separated values (.csv)” type, select the sheet with your data, and use that CSV URL directly with `d3.csv` above. If you need data to update faster, try the Google Sheets API: https://stackoverflow.com/questions/30082277/accessing-a-new-style-public-google-sheet-as-json/44479726#44479726
const getCsvUrl = url => {
  url = new URL(url);
  const id = url.pathname.split("/")[3]
  const gid = new URLSearchParams(url.hash.slice(1)).get("gid") || 0;
  return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`
};

const url = "https://docs.google.com/spreadsheets/d/1RjwKUbyQSDovO5tyEpGOfU_cjLNfSAiA4GdHuKo5bo0/edit?gid=0#gid=0";

// Define data, call function getCsvUrl
const sonifData = d3.csv(getCsvUrl(url), d3.autoType);
```

```js
// put the console log and any operations on the loaded data in a new block to make use of implicit await between code blocks (resolves the promise)

console.log(sonifData) // how to check console output in browser (inspect >> console)
const formats = Array.from(new Set(sonifData.map(m => m.Format))).sort()
```

```js
// Create filter imput
const formatFilterInput = Inputs.select(["Show All", ...formats]);
const formatFilterValue = view(formatFilterInput);
```

```js
// move filtering to another block so the reactive value of the view function is used in the evaluation of the filter method on the original dataset
const filtered = sonifData.filter(f => {
  if (formatFilterValue === "Show All") {
    return true;
  } else {
    return f.Format === formatFilterValue;
  }
});
// Create search input (for searchable table)
const tableSearch = Inputs.search(filtered);
const tableSearchValue = view(tableSearch);
```

<div class="card" style="padding: 0">
  <div style="padding: 1em; display:flex; align-items: center; gap: 5px;">
    ${display(tableSearch)} Format: ${display(formatFilterInput)}
  </div>
  ${display(Inputs.table(tableSearchValue, {
  format: {
    URL: link => htl.html`<a href=${link} target=_blank>${link}</a>`
  },
  layout: "auto"
}
))}
</div>
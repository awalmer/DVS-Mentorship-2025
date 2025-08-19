// function to turn string author data into array of author first and last names
function processAuthors(d) {
    // perform a bunch of string operations to get rid of superfluous words
    let authors = d.Authors.replace("By", "")
        .replaceAll("and", "")
        .replaceAll(", s,", ", ")
        .replaceAll("  ", ", ")
        .replaceAll(", Jr.", " Jr.")
        .replaceAll("Sir", "")
        .replaceAll(", Dr.", "")
        .replaceAll(", IV", " IV")
        .replaceAll(", III", " III")
        .replaceAll(", II", " II")
        .replaceAll(", Ph.D", "")
        .replaceAll(", Ph.d.", "")
        .replaceAll(", M.D.", "")
        .replaceAll(", Inc.", " Inc.")
        .replace("Et Al", "")
        .replace("etc.", "")
        .replace("(compiled, edited by)", "")
        .replace("(Editors)", "")
        .replaceAll("(editor)", "")
        .replaceAll("(Editor)", "")
        .replaceAll("(Text)", "")
        .replaceAll("(Photography)", "")
        .replaceAll("Editor", "")
        .replaceAll("editor", "")
        .replaceAll("(EDT)", "")
        .replaceAll("(ILT)", "")
        .replaceAll("(INT)", "")
        .replaceAll("(CON)", "")
        .replaceAll("(COR)", "")
        .replaceAll("(COM)", "")
        .replaceAll("(TRN)", "")
        .replaceAll("(FRW)", "")
        .replaceAll("(NRT)", "")
        .replaceAll("(PHT)", "");
    // split the string by commas into an array, and remove any empty entries
    let authArr = authors.split(",").filter(a => a && a !== " ")
    // get the length of the resulting array
    let arrLength = authArr.length
    // set up a holding array for the final author list
    const authorsFinal = []
    // check to see if the author array has any entries
    if (arrLength > 0) {
        // if so, and there's only one:
        if (arrLength === 1) {
            // remove any whitespace from the single entry's string and push it 
            // into the authorsFinal array
            authorsFinal.push(authArr[0].trim().replaceAll("  ", " "));
        } else if (arrLength <= 3) { // if there's 2 or 3 entries in the array
            // reverse the order of the array and join the entries together into
            // one string and trim out the leading or trailing whitespace
            authorsFinal.push(authArr.reverse().join("").trim().replaceAll("  ", " ")) 
        } else if (arrLength % 2 === 0) { // if the number of elements in the array is even
            // set up a for loop so you can group author's first and last names together into
            // a single entry for the final authors array
            for (let index = 0; index < arrLength; index += 2) {
                if (authArr[index] && authArr[index+1]) {
                    let name = authArr[index+1] + authArr[index];
                    authorsFinal.push(name.trim().replaceAll("  ", " "));
                }
            }
        } else {
            const newAuthors = []
            authArr.forEach((auth) => {
                let splitStr = auth.trim().split(" ");
                if (splitStr.length < 3) {
                    newAuthors.push(auth)
                }
            })
            if (newAuthors.length % 2 === 0) {
                for (let index = 0; index < newAuthors.length; index += 2) {
                    if (newAuthors[index] && newAuthors[index+1]) {
                        let name = newAuthors[index+1] + newAuthors[index];
                        authorsFinal.push(name.trim().replaceAll("  ", " "));
                    }
                }
            // } else {
                // console.log("odd", authors, newAuthors)
            }
        }
    }
    // create a new object using the original row of data that was passed in
    // and override the Authors paramter with the authorsFinal array
    let entry = Object.assign(d, {AuthorList: authorsFinal})
    return entry;
}
d3.csv("BooksDatasetClean.csv", processAuthors).then((books) => {
    console.log(books)
    const authors = Array.from(new Set(books.flatMap(m => m.AuthorList.map(a => a))))
    console.log(authors);
    const categories = Array.from(new Set(books.flatMap(m => m.Category.trim().split(" , ").map(c => c))))
    console.log(categories);

    let chosenAuthor = "Joyce Carol Oates";

    d3.select("#author").html(chosenAuthor);
    let chosenBooks = books.filter(f => f.AuthorList.includes(chosenAuthor))

    console.log(chosenBooks);

    const years = Array.from(new Set(chosenBooks.map(m => +m["Publish Date (Year)"]))).sort()
    console.log(years)
    // D3 Graph Gallery circular bar plot
    // https://d3-graph-gallery.com/graph/circular_barplot_basic.html

    // set the dimensions and margins of the graph
    const margin = {top: 30, right: 30, bottom: 30, left: 30},
        width = 860 - margin.left - margin.right,
        height = 860 - margin.top - margin.bottom,
        innerRadius = 180,
        outerRadius = Math.min(width, height) / 2;   // the outerRadius goes from the middle of the SVG area to the border

    // append the svg object to the body of the page
    const svg = d3.select("#viz")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", `translate(${width/2},${height/2})`); 

    // X scale
    const x = d3.scaleBand()
        .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
        .align(0)                  // This does nothing ?
        .domain( years ); // The domain of the X axis is the list of states.

    // Y scale
    const y = d3.scaleRadial()
        .range([innerRadius, outerRadius])   // Domain will be define later.
        .domain([0, d3.max(chosenBooks.map(m => +m["Price Starting With ($)"]))]); // Domain of Y is from 0 to the max seen in the data

    // Add bars
    svg.append("g")
        .selectAll("path")
        .data(chosenBooks)
        .join("path")
        .attr("fill", "#69b3a2aa")
        .attr("d", d3.arc()     // imagine your doing a part of a donut plot
            .innerRadius(innerRadius)
            .outerRadius(d => y(+d["Price Starting With ($)"]))
            .startAngle(d => x(+d["Publish Date (Year)"]))
            .endAngle(d => x(+d["Publish Date (Year)"]) + x.bandwidth())
            .padAngle(0.01)
            .padRadius(innerRadius))

    // Add the labels
    svg.append("g")
      .selectAll("g")
      .data(chosenBooks)
      .enter()
      .append("g")
        .attr("text-anchor", function(d) { return (x(+d["Publish Date (Year)"]) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function(d) { return "rotate(" + ((x(+d["Publish Date (Year)"]) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(+d['Price Starting With ($)'])+10) + ",0)"; })
      .append("text")
        .text(d => `$${d["Price Starting With ($)"]}`)
        .attr("transform", function(d) { return (x(+d["Publish Date (Year)"]) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "11px")
        .attr("alignment-baseline", "middle")

    // https://observablehq.com/@d3/radial-stacked-bar-chart/2
    // x axis
    svg.append("g")
      .attr("text-anchor", "middle")
    .selectAll()
    .data(x.domain())
    .join("g")
      .attr("transform", d => `
        rotate(${((x(d) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
        translate(${innerRadius},0)
      `)
      .call(g => g.append("line")
          .attr("x2", -5)
          .attr("stroke", "#000"))
      .call(g => g.append("text")
          .attr("transform", d => (x(d) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
              ? "rotate(90)translate(0,16)"
              : "rotate(-90)translate(0,-9)")
          .text(d => d));

})
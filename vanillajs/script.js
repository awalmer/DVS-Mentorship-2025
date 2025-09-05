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
    // and add the Author List paramter with the authorsFinal array
    // and add a UTC date using the published month and year
    let date = new Date(d["Publish Date (Month)"] + " " + d["Publish Date (Year)"]);
    let entry = Object.assign(d, {AuthorList: authorsFinal, published: Date.UTC(date.getUTCFullYear(), date.getUTCMonth())})
    return entry;
}
d3.csv("BooksDatasetClean.csv", processAuthors).then((books) => {

    // these can be used to create selection parameters
    const authors = Array.from(new Set(books.flatMap(m => m.AuthorList.map(a => a))))
    const categories = Array.from(new Set(books.flatMap(m => m.Category.trim().split(" , ").map(c => c))))

    // this variable would be used to hold whatever the currently chosen author is
    let chosenAuthor = "Joyce Carol Oates";

    // This populates the page's h1 tag with the chosen author name
    d3.select("#author").html(chosenAuthor);

    // filter the full dataset to those where the chosen author is included in the author list
    // and where a published year exists
    let chosenBooks = books.filter(f => f.AuthorList.includes(chosenAuthor) && f.published !== undefined)

    /*** To Do:  
     * handle edge case where multiple dots have same month/year to prevent overlap
     * will require searching chosen books for any that overlap
     * and adding an identifier to those entries to signal introducing a jitter
     * to dot placement on render
     * */ 
    

    // get the unique list of years in the chosen dataset
    const years = Array.from(new Set(chosenBooks.map(m => +m["Publish Date (Year)"]))).sort()

    // set the dimensions and margins of the graph
    // instead of hard coding 660, you can retreive the screen dimensions to base 
    // width and height on dynamically, and set a resize listener to update on changes
    const margin = {top: 30, right: 150, bottom: 30, left: 80},
        width = 660 - margin.left - margin.right,
        height = 660 - margin.top - margin.bottom;

    // add an svg to the div with an id of viz, set its dimensions
    // include the xmlns parameter for the foreign object to display (see labels)
    // add a grouping element and shift it into place within the svg
    const spiral = d3.select("#viz").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("xmlns","http://www.w3.org/2000/svg")
    .append("g")
        .attr("transform", `translate(${width/2 + margin.left},${height/2})`); 

    // set up a linear scale for the number of months in a decade
    const decadeMonths = d3.scaleLinear()
        .domain([1, 12 * 10]) // from month 1 in year 1, to 12th month in year 10
        .range([0,2 * Math.PI]) // from 0 to all the degrees in a circle

    // create a function to determine from a UTC date what month in 
    // the current decade this date falls in
    function calcDecadeMonth(date) {
        const dateObj = new Date(date) // convert the UTC date to a javascript date object
        const decadeStart = Math.floor(dateObj.getUTCFullYear() / 10) * 10 // get the start of the decade
        const yearDiff = dateObj.getUTCFullYear() - decadeStart // calculate how many years
        const monthDiff = dateObj.getUTCMonth() - 1 // calculate how many months from january in the current year
        return (yearDiff * 12) + monthDiff // calculate total months from start of decade
    }

    // create functions for converting the angle and radius returned by the line 
    // generator to x and y coordinates in a cartesian plane
    function convertX(d) {
        return radial.radius()(d) * Math.cos(radial.angle()(d) - Math.PI / 2)
    }
    function convertY(d) {
        return radial.radius()(d) * Math.sin(radial.angle()(d) - Math.PI / 2)
    }

    // get the earliest and latest decades in the dataset
    const yearsExtent = [Math.floor(years[0] / 10) * 10, Math.ceil(years[years.length - 1] / 10) * 10];

    // populate an array with all the years from the beginning of the earliest decade 
    // to the end of the latest decade so no years are missing 
    const allYears = Array.from({length: yearsExtent[1] - yearsExtent[0]}, (_, i) => {
        const year = yearsExtent[0] + i;
        return {"Publish Date (Year)": `${year}`, published: Date.UTC(year)}
    })

    // set up a linear scale to calculate the radius for each decade
    const decade = d3.scaleLinear()
        .domain(yearsExtent) // we use our extent for the domain
        .range([width/2, 40]) // the range starts at the outer edge and goes to 40px from the center

    // set up the line generator function that plots the spiral
    const radial = d3.lineRadial()
        .angle(d => decadeMonths(calcDecadeMonth(d.published)))
        .radius(d => decade(+d["Publish Date (Year)"]))
        .curve(d3.curveNatural)

    // render the spiral line
    spiral.append("path")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", "0.5")
        .attr("d", radial(allYears))

    // add labels for the start and end points of the spiral line
    spiral.append("text")
        .attr("transform", () => {
            const start = {"Publish Date (Year)": `${yearsExtent[0]}`, published: Date.UTC(yearsExtent[0])}
            return `translate(${ convertX(start) },${ convertY(start)})`
        })
        .text(yearsExtent[0])
        .attr("text-anchor", "end")

    spiral.append("text")
        .attr("transform", () => {
            const end = {"Publish Date (Year)": `${yearsExtent[1]-1}`, published: Date.UTC(yearsExtent[1]-1)}
            return `translate(${ convertX(end) },${ convertY(end)})`
        })
        .text(yearsExtent[1]-1)

    // add dots for the individual books
    spiral.selectAll(".dot")
        .data(chosenBooks)
        .join("circle")
        .attr("class", "dot")
        .attr("id", (d,i)=>"dot_"+i)  // corresponds to the index of the tooltip box, for use in the event listener below
        .attr("cx", d => convertX(d)) // To Do: add check for duplicate dates to jitter placement and prevent overlap
        .attr("cy", d => convertY(d))
        .attr("r", 13)
        .attr("fill", "#0d1b7855")
        .on("pointerenter", function() { // add an event listener to turn the currently hovered dot's tooltip visible
            const index = this.id.split("_")[1] // use javascript 'this' to get index of the current dot being interacted with
            spiral.select("#labelText"+index) // use d3 to select the corresponding label text box
                .style("visibility", "visible")
        })
        .on("pointerout", d => spiral.selectAll(".labelText").style("visibility","hidden")) // turn all boxes hidden when the user exits hover on any of them

    // render the tooltip boxes (note the initial style set in the index.html for this element is visibility: hidden)
    const spiralLabels = spiral.selectAll(".label")
        .data(chosenBooks)
        .join("g")
        .classed("label", true)
        .attr("transform", d => `translate(${ convertX(d) + 13 },${ convertY(d) - 10 })`)
        .append("foreignObject") // foreign objects are a way to embed standard html elements inside an svg element
            .attr("width", 160)
            .attr("height", 150)
            .attr("x", 0)
            .attr("y", 0)
            .append("xhtml:div")
                .classed("labelText", true)
                .attr("id", (d,i) => "labelText"+i) // index corresponds to dot index for easier lookup on hover

    // populate each individual foreign object with the title and publish date of each book
    spiralLabels.append("p")
        .html(d => d.Title)
    spiralLabels.append("p")
        .html(d => d["Publish Date (Month)"] + " " + d["Publish Date (Year)"])
})
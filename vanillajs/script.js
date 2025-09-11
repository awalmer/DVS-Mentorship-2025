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
    // turn the string published year and month fields into a javascript date object
    let date = new Date(d["Publish Date (Month)"] + " " + d["Publish Date (Year)"]);

    // create a new object using the original row of data that was passed in
    let entry = Object.assign(d, {
        AuthorList: authorsFinal, // add the Author List paramter with the authorsFinal array
        published: Date.UTC(date.getUTCFullYear(), date.getUTCMonth()), // add a UTC date using the published month and year
        Category: d.Category.trim() // trim all the whitespace around the category string
    })
    return entry;
}
// read in the source csv file, run the process authors function on the dataset
// then proceed with the resulting dataset stored in the variable books
d3.csv("BooksDatasetClean.csv", processAuthors).then((books) => {

    // these can be used to create selection parameters
    const authors = Array.from(new Set(books.flatMap(m => m.AuthorList.map(a => a))))
    const categories = Array.from(new Set(books.flatMap(m => m.Category.trim().split(" , ").map(c => c))))

    // this is a function I used to find the 10 most prolific authors in the dataset
    // I ran it multiple times, and it took a couple minutes to run each time
    // I added authors I wanted to exclude to the useless array until I got 10 useful ones

    // const prolific = [];

    // authors.forEach(a => {
    //     const useless = ["Time-Life Books", "Gardens Books Better Homes", "Reader's Digest Association", 'Gardens" "Better Homes', "unknown", "n/a"]
    //     if (!useless.includes(a)) {
    //         let chosenBooks = books.filter(f => f.AuthorList.includes(a) && f.published !== undefined)
    //         prolific.push({author: a, total: chosenBooks.length})
    //     }
    // })
    // prolific.sort((a,b)=> b.total - a.total)
    // const top10 = prolific.slice(0,10)
    // console.log(top10)

    const top10prolific = [
        "Nora Roberts",
        "William Shakespeare",
        "James Patterson",
        "Jack Canfield",
        "Mark Victor Hansen",
        "Danielle Steel",
        "Max Lucado",
        "Debbie Macomber",
        "Fern Michaels",
        "Betty Crocker"
    ]

    // this variable would be used to hold whatever the currently chosen author is
    // ideally I would have an event listener tied to a select input that would overwrite 
    // this variable anytime the input value changed and would alter the visualization
    // with this new author's works
    let chosenAuthor = top10prolific[9];

    // This populates the page's h1 tag with the chosen author name
    d3.select("#author").html(chosenAuthor);

    // filter the full dataset to those where the chosen author is included in the author list
    // and where a published year exists
    let chosenBooks = books.filter(f => f.AuthorList.includes(chosenAuthor) && f.published !== undefined)

    // add some details about the chosen author's book set
    const details = d3.select("#details")
    details.append("p")
        .html(`${chosenBooks.length} books`)

    // create a map of books grouped by year then month to use for jittering overlaps 
    const booksGrouped = d3.group(chosenBooks, d => d["Publish Date (Year)"], d => d["Publish Date (Month)"])

    // get the unique list of years in the chosen dataset
    const years = Array.from(new Set(chosenBooks.map(m => +m["Publish Date (Year)"]))).sort()

    // add more details now that we have the years
    details.append("p")
        .html(`published from ${years[0]} to ${years[years.length-1]}`)

    let chosenCategories = chosenBooks.map(m => m.Category)

    const structuredCategories = {};

    // Helper function to insert categories and update counts
    // full disclosure, I asked ChatGPT to help me create a recursive function to accomplish this
    function insertCategory(pathArray, obj) {
        if (pathArray.length === 0) return;

        const [head, ...tail] = pathArray;

        // Initialize the category if it doesn't exist
        if (!obj[head]) {
            obj[head] = { count: 0, children: {} };
        }

        // Increment count for the current category
        obj[head].count += 1;

        // Recurse down the hierarchy
        insertCategory(tail, obj[head].children);
    }

    // Iterate through chosen categories
    chosenCategories.forEach(cat => {
        const categoriesSplit = cat.split(" , ");
        insertCategory(categoriesSplit, structuredCategories);
    });

    const categorycolors = ["#5e0000",
        "#a3dfff",
        "#346002",
        "#ffb043",
        "#440882",
        "#eae735",
        "#f041b8",
        "#002bb3",
        "#2c8c8b"];

    // find the category with the highest count (also written by ChatGPT)
    const getKeyWithHighestCount = (obj) => {
        return Object.entries(obj).reduce((maxKey, [key, value]) => {
            return value.count > obj[maxKey].count ? key : maxKey;
        }, Object.keys(obj)[0]);
    };

    // use the highest count to identify the second level categories that represent the most books in the dataset
    const mainChildren = Object.entries(structuredCategories[getKeyWithHighestCount(structuredCategories)].children)

    // sort the second level categories by count and choose the top 10 (the rest will get labeled "other")
    const colorDomain = mainChildren.sort((a,b)=> b[1].count - a[1].count).map(m => m[0]).slice(0,9)

    // define an ordinal scale to use for data-based dot fill
    const color = d3.scaleOrdinal().domain(colorDomain).range(categorycolors).unknown("#000")

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
        const monthDiff = dateObj.getUTCMonth() // calculate how many months from january in the current year
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

    // get the earliest and latest years for the spiral, from the beginning of the earliest decade to the end of latest decade
    const yearsExtent = [Math.floor(years[0] / 10) * 10, (Math.floor(years[years.length - 1] / 10) * 10) + 9];

    // populate an array with all the years from the beginning of the earliest decade 
    // to the end of the latest decade so no years are missing 
    const allYears = Array.from({length: yearsExtent[1] - yearsExtent[0] + 1}, (_, i) => {
        const year = yearsExtent[0] + i;
        return {"Publish Date (Year)": `${year}`, published: Date.UTC(year)}
    })

    // push an additional datapoint into all years so the entire last year is plotted (through december)
    allYears.push({
        "Publish Date (Year)": `${yearsExtent[1]}`,
        published: Date.UTC(yearsExtent[1], 11)
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
            return `translate(${ convertX(allYears[0]) },${ convertY(allYears[0])})`
        })
        .text(yearsExtent[0])
        .attr("text-anchor", "end")

    spiral.append("text")
        .attr("transform", () => {
            return `translate(${ convertX(allYears[allYears.length - 1]) },${ convertY(allYears[allYears.length - 1])})`
        })
        .text(yearsExtent[1])

    // add dots for the individual books
    spiral.selectAll(".dot")
        .data(chosenBooks)
        .join("circle")
        .attr("class", "dot")
        .attr("id", (d,i)=>"dot_"+i)  // corresponds to the index of the tooltip box, for use in the event listener below
        .attr("cx", d => {
            // define and calculate an index-based adjustment for offsetting overlapping dots
            let xAdj = 0;
            if (booksGrouped) {
                const grouping = booksGrouped.get(d["Publish Date (Year)"]).get(d["Publish Date (Month)"])
                if (grouping && grouping.length > 1) {
                    const thisI = grouping.findIndex(e => e.Title === d.Title)
                    xAdj = thisI % 2 ? thisI * 3 : -thisI * 3
                }
            }

            return convertX(d) + xAdj
        })
        .attr("cy", d => {
            // define and calculate an index-based adjustment for offsetting overlapping dots
            let yAdj = 0;
            if (booksGrouped) {
                const grouping = booksGrouped.get(d["Publish Date (Year)"]).get(d["Publish Date (Month)"])
                if (grouping && grouping.length > 1) {
                    const thisI = grouping.findIndex(e => e.Title === d.Title)
                    yAdj = thisI % 2 ? -thisI * 3 : thisI * 3
                }
            }

            return convertY(d) + yAdj
        })
        .attr("r", 10)
        .attr("fill", d => {
            let fillColor = "#aaaaaa";  // backup default fill color
            let cat = d.Category.split(" , ")[1] // get the second level category from the category string
            let match = color(cat); // check for a match in the color scale
            return match ? match : fillColor; // if there's a match return it otherwise return the default fill color
        })
        .attr("fill-opacity", .4)
        .attr("stroke", "#333")
        .attr("stroke-width", 0) // initial stroke width set to zero so stroke can be used on hover to highlight the dot hovered
        .on("pointerenter", function() { // add an event listener to turn the currently hovered dot's tooltip visible
            const index = this.id.split("_")[1] // use javascript 'this' to get index of the current dot being interacted with
            spiral.select("#labelText"+index) // use d3 to select the corresponding label text box
                .style("visibility", "visible") // change it's default hidden visibility to visible
            this.setAttribute("stroke-width", 1) // set the stroke of this dot to width 1 
        })
        .on("pointerout", d => { // add an event listener for when user exits hover on a dot
            spiral.selectAll(".labelText").style("visibility","hidden")  // turn all boxes hidden when the user exits hover on any of them
            spiral.selectAll(".dot").attr("stroke-width", 0) // set all the dots stroke width to zero
        })

    // render the tooltip boxes (note the initial style set in the index.html for this element is visibility: hidden)
    const spiralLabels = spiral.selectAll(".label")
        .data(chosenBooks)
        .join("g")
        .classed("label", true)
        .attr("transform", d => `translate(${ convertX(d) + 13 },${ convertY(d) - 10 })`)
        .append("foreignObject") // foreign objects are a way to embed standard html elements inside an svg element
            .attr("width", 160) // they require defined width and height 
            .attr("height", 150)
            .attr("x", 0)
            .attr("y", 0)
            .append("xhtml:div") // they use special versions of html tags
                .classed("labelText", true)
                .attr("id", (d,i) => "labelText"+i) // index corresponds to dot index for easier lookup on hover

    // populate each individual foreign object with the title and publish date of each book
    spiralLabels.append("p").classed("title", true)
        .html(d => d.Title)
    spiralLabels.append("p")
        .html(d => d["Publish Date (Month)"] + " " + d["Publish Date (Year)"])
    spiralLabels.append("p")
        .html(d => d.Category.replaceAll(" ,", ":"))

    // add a swatch legend to the spiral
    const legend = spiral.append("g")
        .attr("id", "legend")
        .attr("transform", `translate(${-width/2 - margin.left},${-height/2 + margin.top})`) // move the legend to the top left
        .selectAll(".swatch")
        .data(colorDomain)
        .join("g")
        .classed("swatch", true)
        .attr("transform", (d,i) => `translate(0, ${i*18})`); // move each swatch group down by multiplying the index by 18px
    
    legend.append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", d => color(d))
        .style("opacity", .6)
        .attr("rx", 6) // rounded corners on a rectangle instead of a circle element (another way to make dots)
        .attr("ry", 6)
    
    legend.append("text")
        .text(d => d)
        .attr("x", 16)
        .attr("y", 11)

    // add the other color to the swatch legend
    const lastSwatch = spiral.select("#legend")
        .append("g")
        .classed("swatch", true)
        .attr("transform", `translate(0,${18*colorDomain.length})`);

    lastSwatch.append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .attr("fill", "#000")
        .style("opacity", .6)
        .attr("rx", 6)
        .attr("ry", 6)

    lastSwatch.append("text")
        .text("Other")
        .attr("x", 16)
        .attr("y", 11)

})
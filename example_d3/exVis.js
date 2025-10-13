const svg = d3.select("svg")
  .attr("width", 1200)
  .attr("height", 280);

// Circle + Text (move together)
const group = svg.append("g");

const circle = group.append("circle")
  .attr("cx", 60)
  .attr("cy", 100)
  .attr("r", 50)
  .attr("fill", "steelblue");

const text = group.append("text")
  .attr("x", 60)
  .attr("y", 105)
  .attr("text-anchor", "middle")
  .attr("alignment-baseline", "middle")
  .attr("font-size", "24px")
  .attr("fill", "white")
  .text("Hello");

function moveRight() {
  text.text("Data");
  circle.transition()
    .duration(3000)
    .attr("fill", "tomato")
    .on("start", () => {
      group.transition()
        .duration(3000)
        .attr("transform", "translate(1040,0)")
        .on("end", moveLeft);
    });
}

function moveLeft() {
  text.text("Analysis");
  circle.transition()
    .duration(3000)
    .attr("fill", "steelblue")
    .on("start", () => {
      group.transition()
        .duration(3000)
        .attr("transform", "translate(0,0)")
        .on("end", moveRight);
    });
}

moveRight();

// Rectangle (move vertically & resize)
const rect = svg.append("rect")
  .attr("x", 500)
  .attr("y", 40)
  .attr("width", 120)
  .attr("height", 60)
  .attr("fill", "green");

function animateRect() {
  rect.transition()
    .duration(3000)
    .attr("y", 180)
    .attr("height", 120)
    .attr("fill", "orange")
    .transition()
    .duration(3000)
    .attr("y", 40)
    .attr("height", 60)
    .attr("fill", "green")
    .on("end", animateRect);
}

animateRect();

// Creating line
const points = [
  [50, 260],
  [150, 220],
  [250, 240],
  [350, 200],
  [450, 260]
];

const lineGenerator = d3.line();
const pathData = lineGenerator(points);

const path = svg.append("path")
  .attr("d", pathData)
  .attr("stroke", "purple")
  .attr("stroke-width", 3)
  .attr("fill", "none");

// Animating line
const totalLength = path.node().getTotalLength();

path
  .attr("stroke-dasharray", totalLength + " " + totalLength)
  .attr("stroke-dashoffset", totalLength)
  .transition()
  .duration(2000)
  .ease(d3.easeLinear)
  .attr("stroke-dashoffset", 0);
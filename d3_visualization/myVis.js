(async function() {
  const data = await d3.json("SampleData.json");

  // Extract first genre and rating
  const filtered = data.map(d => {
    const genre = d.genres.split(",")[0].trim();
    const rating = +d.imdb_rating;
    return { genre, rating };
  }).filter(d => d.genre && d.rating);

  // Group ratings by genre
  const genreMap = d3.group(filtered, d => d.genre);
  const genres = Array.from(genreMap.keys()).sort();

  const svg = d3.select("svg");
  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const margin = {top: 50, right: 50, bottom: 150, left: 80};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  // X scale: genre
  const xScale = d3.scaleBand()
    .domain(genres)
    .range([0, innerWidth])
    .padding(0.3);

  // Y scale: rating
  const yScale = d3.scaleLinear()
    .domain([0, 10])
    .range([innerHeight, 0]);

  // Axes
  g.append("g").call(d3.axisLeft(yScale));
  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .attr("text-anchor", "end");

  // Compute box plot statistics
  const boxData = genres.map(genre => {
    const ratings = genreMap.get(genre).map(d => d.rating).sort(d3.ascending);
    const q1 = d3.quantile(ratings, 0.25);
    const median = d3.quantile(ratings, 0.5);
    const q3 = d3.quantile(ratings, 0.75);
    const min = d3.min(ratings);
    const max = d3.max(ratings);
    return { genre, q1, median, q3, min, max };
  });

  const boxWidth = xScale.bandwidth();

  // Draw boxes
  const box = g.selectAll(".box")
    .data(boxData)
    .join("g")
    .attr("class", "box")
    .attr("transform", d => `translate(${xScale(d.genre)},0)`);

  // Box rectangles (Q1-Q3)
  box.append("rect")
    .attr("y", d => yScale(d.q3))
    .attr("height", d => yScale(d.q1) - yScale(d.q3))
    .attr("width", boxWidth)
    .attr("fill", "#69b3a2")
    .attr("stroke", "black");

  // Median line
  box.append("line")
    .attr("y1", d => yScale(d.median))
    .attr("y2", d => yScale(d.median))
    .attr("x1", 0)
    .attr("x2", boxWidth)
    .attr("stroke", "black")
    .attr("stroke-width", 2);

  // Min and max lines
  box.append("line")
    .attr("y1", d => yScale(d.min))
    .attr("y2", d => yScale(d.min))
    .attr("x1", boxWidth/4)
    .attr("x2", boxWidth*3/4)
    .attr("stroke", "black");

  box.append("line")
    .attr("y1", d => yScale(d.max))
    .attr("y2", d => yScale(d.max))
    .attr("x1", boxWidth/4)
    .attr("x2", boxWidth*3/4)
    .attr("stroke", "black");

  // Whiskers
  box.append("line")
    .attr("x1", boxWidth/2)
    .attr("x2", boxWidth/2)
    .attr("y1", d => yScale(d.min))
    .attr("y2", d => yScale(d.q1))
    .attr("stroke", "black");

  box.append("line")
    .attr("x1", boxWidth/2)
    .attr("x2", boxWidth/2)
    .attr("y1", d => yScale(d.q3))
    .attr("y2", d => yScale(d.max))
    .attr("stroke", "black");

  // Axis labels
  svg.append("text")
    .attr("x", margin.left + innerWidth/2)
    .attr("y", height - 10)
    .attr("text-anchor", "middle")
    .text("Genre");

  svg.append("text")
    .attr("x", -margin.top - innerHeight/2)
    .attr("y", 20)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .text("IMDb Rating");
})();
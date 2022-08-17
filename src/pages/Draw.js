import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import styled from "styled-components";
import ElementPicker from "../components/ElementPicker";

const Container = styled.div`
  background-color: #f5f6fa;
  width: 150vw;
  height: 100vh;
`;

const data = [
  [100, 30, 30],
  [200, 300, 30],
  [300, 200, 30],
  [130, 500, 30],
];

const Draw = () => {
  //global varibales
  const svgRef = useRef();
  const width = 1000;
  const height = 800;
  let [mt, mb, mr, ml] = [100, 100, 100, 100];
  const graphWidth = width - ml - mr;
  const graphHeight = height - mt - mb;

  //draw grid and scale, zoom
  useEffect(() => {
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);
    const graph = d3
      .select(".graph")
      .attr("width", graphWidth)
      .attr("height", graphHeight)
      .attr("transform", `translate(${ml}, ${mt})`);
    const xScale = d3.scaleLinear().domain([0, width]).range([0, width]);
    const yScale = d3.scaleLinear().domain([0, height]).range([0, height]);
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisRight(yScale);
    svg.select(".x-axis").call(xAxis);
    svg.select(".y-axis").call(yAxis);

    const circles = graph
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", (d) => d[2])
      .attr("cx", (d) => d[1] + 200)
      .attr("cy", (d) => d[0]);

    //zoom in zoom out
    const delaunay = d3.Delaunay.from(
      data,
      (d) => xScale(d[0]),
      (d) => yScale(d[1])
    );
    let transform;

    const zoom = d3.zoom().on("zoom", (e) => {
      graph.attr("transform", (transform = e.transform));
      graph.style("stroke-width", 3 / Math.sqrt(transform.k));
      circles.attr("r", 20 / Math.sqrt(transform.k));
    });

    svg
      .call(zoom)
      .call(zoom.transform, d3.zoomIdentity)
      .on("pointermove", (event) => {
        const p = transform.invert(d3.pointer(event));
        const i = delaunay.find(...p);
        circles.classed("highlighted", (_, j) => i === j);
        d3.select(circles.nodes()[i]).raise();
      })
      .node();
  });

  //wall
  useEffect(() => {}, []);

  return (
    <Container>
      <svg ref={svgRef} style={{ overflow: "visible" }}>
        <g className="graph">
          <g className="x-axis"></g>
          <g className="y-axis"></g>
          <defs>
            <pattern
              id="smallGrid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="gray"
                strokeWidth="0.5"
              />
            </pattern>
            <pattern
              id="grid"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <rect width="100" height="100" fill="url(#smallGrid)" />
              <path
                d="M 100 0 L 0 0 0 100"
                fill="none"
                stroke="gray"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="grid" />
        </g>
      </svg>
      <ElementPicker />
    </Container>
  );
};

export default Draw;

import { useContext, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { ElementContext } from "../pages/Draw";
import axios from "axios";
import { drawRoute } from "../utils/APIRoute";
import { useParams } from "react-router-dom";
import ControllerImg from "../assets/img/controller.svg";
import SensorImg from "../assets/img/sensor.png";
import HvacImg from "../assets/img/hvac.png";
import DoorImg from "../assets/img/door.png";
import WindowImg from "../assets/img/wndow.png";

const Canvas = () => {
  const [walls, setWalls] = useState([]);
  const { draftId } = useParams();
  const [items, setItems] = useState([]);

  //global varibales
  const svgRef = useRef();
  const selected = useContext(ElementContext);
  const width = 1000;
  const height = 800;
  let [mt, mb, mr, ml] = [100, 100, 100, 100];
  const graphWidth = width - ml - mr;
  const graphHeight = height - mt - mb;

  //fetch wall data
  useEffect(() => {
    const fetchDraws = async () => {
      const { data } = await axios.get(drawRoute, { params: { draftId } });
      setWalls([...data.walls]);
      setItems([...data.items]);
    };
    fetchDraws();
  }, []);

  //draw grid and scale, zoom, rener saved elements
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

    const lines = graph
      .selectAll(".wall")
      .data(walls)
      .enter()
      .append("line")
      .attr("x1", (d) => d[0])
      .attr("y1", (d) => d[1])
      .attr("x2", (d) => d[2])
      .attr("y2", (d) => d[3])
      .attr("stroke", "#B4BDC1")
      .attr("stroke-width", "10px")
      .attr("class", "wall");

    const elements = graph
      .selectAll("image")
      .data(items)
      .enter()
      .append("image")
      .attr("x", (d) => d.x)
      .attr("y", (d) => d.y)
      .attr("href", (d) => {
        const itemName = d.name;
        if (itemName === "controller") {
          return ControllerImg;
        } else if (itemName === "sensor") {
          return SensorImg;
        } else if (itemName === "hvac") {
          return HvacImg;
        } else if (itemName === "door") {
          return DoorImg;
        } else if (itemName === "window") {
          return WindowImg;
        }
      })
      .attr("width", 25)
      .attr("height", 25)
      .attr("id", (d) => d.id);

    //zoom in zoom out
    const delaunay = d3.Delaunay.from(
      walls,
      (d) => xScale(d[0]),
      (d) => yScale(d[1])
    );
    let transform;
    if (selected == "") {
      const zoom = d3.zoom().on("zoom", (e) => {
        graph.attr("transform", (transform = e.transform));
        graph.style("stroke-width", 3 / Math.sqrt(transform.k));
      });
      svg
        .call(zoom)
        .call(zoom.transform, d3.zoomIdentity)
        .on("pointermove", (event) => {
          const p = transform.invert(d3.pointer(event));
          const i = delaunay.find(...p);
          lines.classed("highlighted", (_, j) => i === j);
          d3.select(lines.nodes()[i]).raise();
        })
        .node();
    } else {
      svg.on(".zoom", null);
    }
  }, [selected, walls]);

  //draw walls
  useEffect(() => {
    let line;
    const mousedown = (e) => {
      if (selected === "wall") {
        let coords = d3.pointer(e, graph);
        coords = coords.map((coord) => Math.ceil(coord * 0.1) * 10 - ml);
        line = graph
          .append("line")
          .attr("x1", coords[0])
          .attr("y1", coords[1])
          .attr("x2", coords[0])
          .attr("y2", coords[1])
          .attr("stroke", "#B4BDC1")
          .attr("stroke-width", "10px")
          .attr("class", "wall");
        graph.on("mousemove", mousemove);
      }
    };

    const mousemove = (e) => {
      if (selected === "wall") {
        let coords = d3.pointer(e, graph);
        coords = coords.map((coord) => Math.ceil(coord * 0.1) * 10 - ml);
        line.attr("x2", coords[0]).attr("y2", coords[1]);
      }
    };

    const mouseup = () => {
      if (selected === "wall") {
        graph.on("mousemove", null);
        const x1 = Number(line.attr("x1"));
        const y1 = Number(line.attr("y1"));
        const x2 = Number(line.attr("x2"));
        const y2 = Number(line.attr("y2"));
        const newWall = [x1, y1, x2, y2];
        setWalls((walls) => [...walls, newWall]);
      }
    };

    let graph = d3
      .select(".graph")
      .on("mousedown", mousedown)
      .on("mouseup", mouseup);
  }, [selected, walls]);

  //place items
  useEffect(() => {
    const addElements = (selected) => {
      const graph = d3.select(".graph");
      let currentIcon;
      if (selected === "controller") {
        currentIcon = ControllerImg;
      } else if (selected === "sensor") {
        currentIcon = SensorImg;
      } else if (selected === "hvac") {
        currentIcon = HvacImg;
      } else if (selected === "door") {
        currentIcon = DoorImg;
      } else if (selected === "window") {
        currentIcon = WindowImg;
      } else {
        return;
      }
      const elements = graph
        .selectAll("image")
        .data(items)
        .enter()
        .append("image")
        .attr("x", (d) => d.x - 10)
        .attr("y", (d) => d.y - 10)
        .attr("href", currentIcon)
        .attr("width", 25)
        .attr("height", 25);

      return elements;
    };
    const graph = d3.select(".graph");
    const elements = addElements(selected);
    if (elements) {
      elements.each(function (d, i) {
        d3.select(this).attr("id", i);
      });

      graph.on("click", (e) => {
        let coords = d3.pointer(e, graph);
        coords = coords.map((coord) => coord - ml);
        let newItem = {
          id: [...items].length,
          x: coords[0],
          y: coords[1],
          name: selected,
        };
        setItems([...items, newItem]);
      });
    }
  }, [selected, items]);

  //drag items

  //save draw
  const onClick = async () => {
    try {
      const response = await axios.post(drawRoute, { draftId, walls, items });
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
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
      <button onClick={onClick}>저장</button>
    </>
  );
};

export default Canvas;

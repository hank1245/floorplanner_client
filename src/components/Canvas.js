import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
import { drawRoute } from "../utils/APIRoute";
import { useNavigate, useParams } from "react-router-dom";
import ControllerImg from "../assets/img/controller.svg";
import SensorImg from "../assets/img/sensor.png";
import HvacImg from "../assets/img/hvac.png";
import DoorImg from "../assets/img/door.png";
import WindowImg from "../assets/img/wndow.png";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { setItems, addItem, moveItem } from "../features/itemSlice";
import { setWalls, addWall } from "../features/wallSlice";

const Container = styled.div`
  z-index: -10;
  cursor: ${(props) => (props.mode !== "zoom" ? "crosshair" : "default")};
  .menu {
    position: absolute;
    top: 20px;
    display: flex;
    width: 300px;
  }
  button {
    z-index: 10;
    padding: 10px 20px;
    border: 1px solid #000;
    border-radius: 5px;
    background: #000;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    text-align: center;
    appearance: button;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
  }
  .select {
    background-color: red;
  }
`;

const Canvas = () => {
  const { draftId } = useParams();
  const navigate = useNavigate();
  const { mode } = useSelector((state) => state.mode);
  const { items } = useSelector((state) => state.item);
  const { walls } = useSelector((state) => state.wall);

  const dispatch = useDispatch();

  //global varibales
  const svgRef = useRef();
  const width = 1000;
  const height = 800;
  let [mt, mb, mr, ml] = [100, 100, 100, 100];
  const graphWidth = width - ml - mr;
  const graphHeight = height - mt - mb;

  const ceilCoords = ([x, y]) => {
    const newX = Math.ceil(x * 0.1) * 10 - ml;
    const newY = Math.ceil(y * 0.1) * 10 - mt;
    return [newX, newY];
  };

  //fetch wall data
  useEffect(() => {
    const fetchDraws = async () => {
      const { data } = await axios.get(drawRoute, { params: { draftId } });
      dispatch(setWalls(data.walls));
      dispatch(setItems(data.items));
    };
    fetchDraws();
  }, []);

  //draw grid and scale, zoom, rener saved elements
  useEffect(() => {
    console.log(mode);
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("transform", `translate(${ml}, ${mt})`);
    const graph = d3
      .select(".graph")
      .attr("width", graphWidth)
      .attr("height", graphHeight)
      .attr("transform", `translate(0,0)`);
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
      .append("g")
      .attr("class", "wall")
      .append("line")
      .attr("x1", (d) => d.x1)
      .attr("y1", (d) => d.y1)
      .attr("x2", (d) => d.x2)
      .attr("y2", (d) => d.y2)
      .attr("stroke", "#B4BDC1")
      .attr("stroke-width", "10px")
      .attr("class", "wall")
      .on("click", (e) => {
        d3.selectAll("g").classed("select", false);
        d3.select(e.target).classed("select", true);
      });

    const elements = graph
      .selectAll("image")
      .data(items)
      .enter()
      .append("g")
      .attr("class", "item")
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
    if (mode === "zoom") {
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
  }, [mode, walls]);

  //draw walls
  useEffect(() => {
    let line;
    const mousedown = (e) => {
      if (mode === "wall") {
        let coords = d3.pointer(e, graph);
        coords = ceilCoords(coords);
        line = graph
          .append("g")
          .append("line")
          .attr("x1", coords[0])
          .attr("y1", coords[1])
          .attr("x2", coords[0])
          .attr("y2", coords[1])
          .attr("stroke", "#B4BDC1")
          .attr("stroke-width", "10px")
          .attr("class", "wall")
          .on("click", (e, d) => {
            d3.selectAll("g").classed("select", false);
            d3.select(e.target.parent).classed("select", true);
          });
        graph.on("mousemove", mousemove);
      }
    };

    const mousemove = (e) => {
      if (mode === "wall") {
        let coords = d3.pointer(e, graph);
        coords = ceilCoords(coords);
        line.attr("x2", coords[0]).attr("y2", coords[1]);
      }
    };

    const mouseup = () => {
      if (mode === "wall") {
        graph.on("mousemove", null);
        const x1 = Number(line.attr("x1"));
        const y1 = Number(line.attr("y1"));
        const x2 = Number(line.attr("x2"));
        const y2 = Number(line.attr("y2"));
        const newWall = { id: walls.length, x1, y1, x2, y2 };
        dispatch(addWall(newWall));
      }
    };

    let graph = d3
      .select(".graph")
      .on("mousedown", mousedown)
      .on("mouseup", mouseup);
  }, [mode, walls]);

  //place items
  useEffect(() => {
    const addElements = (mode) => {
      const graph = d3.select(".graph");
      let currentIcon;
      if (mode === "controller") {
        currentIcon = ControllerImg;
      } else if (mode === "sensor") {
        currentIcon = SensorImg;
      } else if (mode === "hvac") {
        currentIcon = HvacImg;
      } else if (mode === "door") {
        currentIcon = DoorImg;
      } else if (mode === "window") {
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
    const elements = addElements(mode);
    if (elements) {
      elements.each(function (d, i) {
        d3.select(this).attr("id", i);
      });

      graph.on("click", (e) => {
        let coords = d3.pointer(e, graph);
        coords = ceilCoords(coords);
        let newItem = {
          id: items.length,
          x: coords[0],
          y: coords[1],
          name: mode,
        };
        dispatch(addItem(newItem));
      });
    }
  }, [mode, items]);

  //select items and drag or delete
  useEffect(() => {
    const elements = d3
      .selectAll("image")
      .call(
        d3
          .drag()
          .on("start", function () {
            d3.select(this).raise().classed("active", true);
          })
          .on("drag", function (event, d) {
            d3.select(this).attr("x", event.x).attr("y", event.y);
            dispatch(
              moveItem({
                id: d.id,
                name: d.name,
                x: event.x,
                y: event.y,
              })
            );
          })
          .on("end", function () {
            d3.select(this).classed("active", false);
          })
      )
      .raise();
    elements.on("click", (e, d) => {
      d3.selectAll("g").classed("select", false);
      d3.select(e.target.parentElement).classed("select", true);
    });
  }, [mode, items]);

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
    <Container mode={mode}>
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
      <div className="menu">
        <button onClick={onClick}>저장</button>
        <button onClick={() => navigate("/")}>나가기</button>
      </div>
    </Container>
  );
};

export default Canvas;

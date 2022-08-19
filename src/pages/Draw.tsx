import styled from "styled-components";
import ElementPicker from "../components/ElementPicker";
import Canvas from "../components/Canvas";
import React, { useState, useEffect, useCallback } from "react";
import * as d3 from "d3";

export const ElementContext = React.createContext<string>("");

const Container = styled.div`
  background-color: #f5f6fa;
  width: 100vw;
  height: 120vh;
`;

const Draw = () => {
  const [element, setElement] = useState<string>("");
  const escFunction = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      console.log("keyboard");
      setElement("");
    }
    if (event.key === "Backspace") {
      console.log("del");
      const delItem = d3.select(".select");
      d3.select(".select").remove();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  return (
    <Container>
      <ElementContext.Provider value={element}>
        <Canvas setElement={setElement} />
        <ElementPicker setElement={setElement} />
      </ElementContext.Provider>
    </Container>
  );
};

export default Draw;

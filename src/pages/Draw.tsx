import styled from "styled-components";
import ElementPicker from "../components/ElementPicker";
import Canvas from "../components/Canvas";
import React, { useState, useEffect, useCallback } from "react";

export const ElementContext = React.createContext<string>("");

const Container = styled.div`
  background-color: #f5f6fa;
  width: 100vw;
  height: 100vh;
`;

const Draw = () => {
  const [element, setElement] = useState<string>("");
  const escFunction = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      console.log("keybod");
      setElement("");
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
        <Canvas />
        <ElementPicker setElement={setElement} />
      </ElementContext.Provider>
    </Container>
  );
};

export default Draw;

import styled from "styled-components";
import ElementPicker from "../components/ElementPicker";
import Canvas from "../components/Canvas";
import { useKeyboard } from "../hooks/useKeyboard";
const Container = styled.div`
  background-color: #f5f6fa;
  width: 100vw;
  height: 120vh;
`;

const Draw = () => {
  useKeyboard();

  return (
    <Container>
      <Canvas />
      <ElementPicker />
    </Container>
  );
};

export default Draw;

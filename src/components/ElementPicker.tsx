import React from "react";
import styled from "styled-components";
import { CgController } from "react-icons/cg";
import { BsFillDoorOpenFill } from "react-icons/bs";
import { MdOutlineSensors, MdWindow, MdHvac } from "react-icons/md";
import { GiBrickWall } from "react-icons/gi";
import { AiOutlineStop } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { changeMode } from "../features/modeSlice";

const Container = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 250px;
  height: 300px;
  background-color: #bdc3c7;
  flex-wrap: wrap;
  display: flex;
`;

const Icon = styled.div`
  flex-basis: 50%;
  padding-top: 30px;
  text-align: center;
  cursor: pointer;
  svg {
    pointer-events: none;
  }
`;

const ElementPicker = () => {
  const dispatch = useDispatch();
  const onClick = (e: React.MouseEvent) => {
    if (e.target instanceof Element) {
      dispatch(changeMode(e.target.id));
    }
  };

  return (
    <Container>
      <Icon id="controller" onClick={(e) => onClick(e)}>
        <CgController size={36} />
      </Icon>
      <Icon id="door" onClick={(e) => onClick(e)}>
        <BsFillDoorOpenFill size={36} />
      </Icon>
      <Icon id="sensor" onClick={(e) => onClick(e)}>
        <MdOutlineSensors size={36} />
      </Icon>
      <Icon id="window" onClick={(e) => onClick(e)}>
        <MdWindow size={36} />
      </Icon>
      <Icon id="wall" onClick={(e) => onClick(e)}>
        <GiBrickWall size={36} />
      </Icon>
      <Icon id="hvac" onClick={(e) => onClick(e)}>
        <MdHvac size={36} />
      </Icon>
    </Container>
  );
};

export default ElementPicker;

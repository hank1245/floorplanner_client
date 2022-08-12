import React from "react";
import styled from "styled-components";
import { AiOutlineHome, AiOutlineLogout } from "react-icons/ai";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 25%;
  background-color: #212529;
  color: white;
  height: 95vh;
  hr {
    margin-bottom: 10px;
  }
  .tag {
    cursor: pointer;
    font-size: 1.3rem;
    padding: 20px 20px;
    span {
      margin-right: 10px;
    }
  }
  .tag:hover {
    background-color: #2d3436;
  }
`;

const Sidebar = () => {
  return (
    <Container>
      <hr />
      <div className="tag">
        <span>
          <AiOutlineHome />
        </span>
        My Space
      </div>
      <div className="tag">
        <span>
          <AiOutlineLogout />
        </span>
        Log out
      </div>
    </Container>
  );
};

export default Sidebar;

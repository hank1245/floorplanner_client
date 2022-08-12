import React from "react";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import Space from "../components/Space";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  width: 100vw;
`;

const Dashboard = () => {
  return (
    <div>
      <NavBar />
      <Container>
        <Sidebar />
        <Space />
      </Container>
    </div>
  );
};

export default Dashboard;

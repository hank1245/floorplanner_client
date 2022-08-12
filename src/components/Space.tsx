import React from "react";
import styled from "styled-components";

const Container = styled.div`
  flex-basis: 75%;
  background-color: #dfe6e9;
  padding: 50px;
  .heading {
    font-size: 1.8rem;
    font-weight: 700;
    color: #2d3436;
  }
  .hr {
    width: 100%;
    background-color: #2d3436;
    height: 3px;
    margin: 20px 0;
  }
  .card-parent {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .card-container {
    display: flex;
    flex-direction: column;
    background-color: white;
    width: 300px;
    height: 160px;
    margin-top: 50px;
    margin-right: 50px;
    padding: 20px;
    border: 1px solid #b2bec3;
  }
  .card-name {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 15px;
  }
  .card-description {
    color: #636e72;
  }
`;

const Button = styled.button`
  background-color: #2d3436;
  color: white;
  width: 120px;
  height: 40px;
  border: none;
  font-size: 1.1rem;
  border-radius: 3px;
  cursor: pointer;
`;

interface CardProps {
  name: string;
  description: string;
  createdAt: string;
}

const Card = ({ name, description, createdAt }: CardProps) => {
  return (
    <div className="card-container">
      <div className="card-name">{name}</div>
      <div className="card-description">
        <p>Created At {createdAt}</p>
        <p>{description}</p>
      </div>
      <div className="card-tool"></div>
    </div>
  );
};

const Space = () => {
  const onClick = () => {};
  return (
    <Container>
      <div className="heading">My Draft</div>
      <div className="hr"></div>
      <Button onClick={onClick}>새 도안 만들기</Button>
      <div className="card-parent">
        <Card
          name="sample space"
          description="a sample space for creating"
          createdAt="7/30"
        />
        <Card
          name="sample space"
          description="a sample space for creating"
          createdAt="7/30"
        />
        <Card
          name="sample space"
          description="a sample space for creating"
          createdAt="7/30"
        />
      </div>
    </Container>
  );
};

export default Space;

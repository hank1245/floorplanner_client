import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";
import Modal from "./Modal";
import { draftRoute } from "../utils/APIRoute";
import { useMutation, useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";

const Container = styled.div`
  flex-basis: 75%;
  background-color: #dfe6e9;
  padding: 50px;
  a {
    text-decoration: none;
    color: inherit;
  }
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
    position: relative;
    flex-direction: column;
    background-color: white;
    border-radius: 8px;
    width: 280px;
    height: 160px;
    margin-top: 50px;
    margin-right: 30px;
    padding: 20px;
    border: 1px solid #b2bec3;
    cursor: pointer;
    overflow: hidden;
    &:hover {
      box-shadow: 0px 0px 5px #444;
      .card-tool {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 35px;
        background-color: #212529;
        color: white;
        div {
          flex-basis: 50%;
          padding: 5px;
          text-align: center;
        }
      }
    }
  }
  .card-name {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 15px;
  }
  .card-description {
    color: #636e72;
    p {
      margin-bottom: 10px;
    }
  }
  .card-tool {
    display: none;
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

interface Draft {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

const Card = ({ name, description, _id, createdAt }: Draft) => {
  const deleteDraft = async () => {
    const response = await axios.delete(draftRoute, {
      data: { name },
    });
    const { data } = response;
    return data;
  };

  const { isLoading } = useMutation(deleteDraft);

  const onDelete = async (name: string) => {
    if (window.confirm(`${name}을 삭제하시겠습니까?`)) {
      await deleteDraft();
    }
  };
  return (
    <>
      <div className="card-container">
        <Link to={`/draw/${_id}`}>
          <div className="card-name">{name}</div>
          <div className="card-description">
            <p>{description}</p>
            <p>생성일자:{createdAt}</p>
          </div>
        </Link>
        <div className="card-tool">
          <div onClick={() => onDelete(name)}>삭제</div>
        </div>
      </div>
    </>
  );
};

const Space = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);

  const onClick = () => {
    setOpenModal(true);
  };

  const fetchDrafts = async () => {
    const response = await axios.get(draftRoute);
    const { data } = response;
    return data.drafts;
  };
  const { isLoading } = useQuery("drafts", fetchDrafts, {
    onSuccess: setDrafts,
  });

  if (isLoading) {
    return <div>Loading..</div>;
  }

  return (
    <Container>
      <div className="heading">My Draft</div>
      <div className="hr"></div>
      <Button onClick={onClick}>새 도안 만들기</Button>
      <div className="card-parent">
        {drafts.map((draft: Draft, index: number) => {
          const date = new Date(draft.createdAt);
          const localString = date.toLocaleString("ko");
          return (
            <Card
              key={index}
              _id={draft._id}
              name={draft.name}
              createdAt={localString}
              description={draft.description}
            />
          );
        })}
      </div>
      {openModal && <Modal open={setOpenModal} />}
    </Container>
  );
};

export default Space;

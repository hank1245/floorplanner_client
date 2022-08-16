import React, { useState } from "react";
import styled from "styled-components";
import { draftRoute } from "../utils/APIRoute";
import axios from "axios";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(17, 15, 15, 0.5);
  width: 100vw;
  height: 100vh;
  form {
    width: 500px;
    height: 500px;
    background-color: white;
    margin: 200px auto;
    opacity: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    .form-container {
      width: 80%;
      height: 70%;
      display: flex;
      flex-direction: column;
      label {
        margin-bottom: 10px;
      }
      input {
        margin-bottom: 20px;
        padding: 10px;
        border: 1px solid #928f8f;
        border-radius: 5px;
      }
      textarea {
        padding: 10px;
        border: 1px solid #928f8f;
        border-radius: 5px;
      }
      button {
        padding: 10px 10px;
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
        margin-top: 20px;
        width: 20%;
      }
    }
  }
`;

interface DraftData {
  name: string;
  description: string;
}

interface Props {
  open: (open: boolean) => void;
}

const Modal = ({ open }: Props) => {
  const [formData, setFormData] = useState({ name: "", description: "" });

  const onClick = () => {
    open(false);
  };

  const createDraft = async (draftRoute: string, draftData: DraftData) => {
    const response = await axios.post(draftRoute, draftData);
    return response.data;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    open(false);
    const draftData = {
      name: formData.name,
      description: formData.description,
    };
    createDraft(draftRoute, draftData);
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Container onClick={onClick}>
      <form
        onSubmit={(e) => onSubmit(e)}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="form-container">
          <label htmlFor="draft-name">도안 이름</label>
          <input
            id="draft-name"
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="도안 이름을 입력하세요"
          />
          <label htmlFor="draft-description">도안 설명 </label>
          <textarea
            id="draft-description"
            placeholder="도안에 대한 설명을 추가하세요"
            onChange={onChange}
            name="description"
            value={formData.description}
          ></textarea>
          <button type="submit">생성하기</button>
        </div>
      </form>
    </Container>
  );
};

export default Modal;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import styled from "styled-components";
import { loginRoute } from "../utils/APIRoute";
import axios from "axios";

export interface UserData {
  email: string;
  password: string;
}

export interface LoginData {
  _id: string;
  email: string;
  name: string;
  token: string;
}

const Container = styled.div`
  background-color: #f5f6fa;
  width: 50%;
  padding: 20px 0;
  margin: 100px auto;
  border-radius: 15px;
  .heading {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 50px;
    padding: 0 20px;
    h1 {
      text-align: center;
    }
  }
  .form,
  .content {
    width: 70%;
    margin: 0 auto;
  }

  .form-group {
    margin-bottom: 10px;
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    margin-bottom: 10px;
    font-family: inherit;
  }
  .btn {
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
  }
`;

function Login() {
  const [formData, setFormData] = useState<UserData>({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const login = async (loginRoute: string, userdata: UserData) => {
    try {
      const response = await axios.post(loginRoute, userdata);
      console.log(response);
      localStorage.setItem(
        "floorplanner-token",
        JSON.stringify(response.data.token)
      );
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData: UserData = {
      email,
      password,
    };
    await login(loginRoute, userData);
  };

  return (
    <Container>
      <section className="heading">
        <h1>
          <FaSignInAlt /> Draft
        </h1>
      </section>
      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="email"
              name="email"
              value={email}
              placeholder="이메일을 입력하세요"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              placeholder="비밀번호를 입력하세요"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-block">
              로그인
            </button>
          </div>
        </form>
      </section>
    </Container>
  );
}

export default Login;

import React, { useEffect, useCallback } from "react";
import * as d3 from "d3";
import { changeMode } from "../features/modeSlice";
import { useDispatch } from "react-redux";

export const useKeyboard = () => {
  const dispatch = useDispatch();
  const escFunction = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      console.log("zoom");
      dispatch(changeMode("zoom"));
    }
    if (event.key === "Backspace") {
      const delItem = d3.select(".select");
      console.log(delItem);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);
};

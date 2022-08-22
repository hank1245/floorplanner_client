import React, { useEffect, useCallback } from "react";
import * as d3 from "d3";
import { changeMode } from "../features/modeSlice";
import { useDispatch, useSelector } from "react-redux";
import { removeItem } from "../features/itemSlice";
import { removeWall } from "../features/wallSlice";
import { RootState } from "../app/store";

export const useKeyboard = () => {
  const { items } = useSelector((state: RootState) => state.item);
  const dispatch = useDispatch();
  const escFunction = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        console.log("zoom");
        dispatch(changeMode("zoom"));
      }
      if (event.key === "Backspace") {
        const delItem = d3.select(".select");
        delItem.remove();
        delItem.each((d: any, i) => {
          if (delItem.classed("wall")) {
            console.log(d.id);
            dispatch(removeWall(d.id));
          } else {
            dispatch(removeItem(d.id));
          }
        });
      }
    },
    [items]
  );

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);
};

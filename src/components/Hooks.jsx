import { useEffect, useRef } from "react";

export function useOnDraw(onDrawCallback) {
  const canvasRef = useRef(null);

  const isDrawingRef = useRef(false);

  const mouseMoveListenerRef = useRef(null);
  const mouseDownListenerRef = useRef(null);
  const mouseUpListenerRef = useRef(null);

  const prevPointRef = useRef(null);

  useEffect(() => {
    return () => {
      if (mouseMoveListenerRef.current) {
        canvasRef.current.removeEventListener(
          "mousemove",
          mouseMoveListenerRef.current
        );
      }
      if (mouseUpListenerRef.current) {
        canvasRef.current.removeEventListener(
          "mouseup",
          mouseUpListenerRef.current
        );
      }
    };
  }, []);

  function setCanvasRef(ref) {
    if (!ref) return;
    if (canvasRef.current) {
      canvasRef.current.removeEventListener(
        "mousedown",
        mouseDownListenerRef.current
      );
    }
    canvasRef.current = ref;
    if(canvasRef.current){
        initMouseMoveListener();
    initMouseDownListener();
    initMouseUpListener();
    }
  }

  function initMouseMoveListener() {
    const mouseMoveListener = (e) => {
      if (isDrawingRef.current) {
        const point = computePointInCanvas(e.clientX, e.clientY);
        const ctx = canvasRef.current.getContext("2d");
        if (onDrawCallback) onDrawCallback(ctx, point,prevPointRef.current);
      }
    };
    mouseMoveListenerRef.current = mouseMoveListener;
    canvasRef.current.addEventListener("mousemove", mouseMoveListener);
  }

  function initMouseDownListener() {
    if (!canvasRef.current) return;
    const listener = () => {
      isDrawingRef.current = true;
    };
    mouseDownListenerRef.current = listener;
    canvasRef.current.addEventListener("mousedown", listener);
  }

  function initMouseUpListener() {
    const listener = () => {
      isDrawingRef.current = false;
      prevPointRef.current = null;
    };
    mouseUpListenerRef.current = listener;
    canvasRef.current.addEventListener("mouseup", listener);
  }

  function computePointInCanvas(clientX, clientY) {
    if (canvasRef.current) {
      const boundingRect = canvasRef.current.getBoundingClientRect();
      return {
        x: clientX - boundingRect.left,
        y: clientY - boundingRect.top,
      };
    } else {
      return null;
    }
  }

  return setCanvasRef;
}
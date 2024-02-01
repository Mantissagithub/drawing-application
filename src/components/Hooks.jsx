import { useEffect, useRef } from "react";

export function useOnDraw(onDrawCallback) {
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const prevPointRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const mouseMoveListener = (e) => {
      if (isDrawingRef.current) {
        const point = computePointInCanvas(e.clientX, e.clientY);
        if (onDrawCallback) onDrawCallback(ctx, point, prevPointRef.current);
        prevPointRef.current = point;
      }
    };

    const mouseDownListener = () => {
      isDrawingRef.current = true;
      prevPointRef.current = null;  // Reset prevPoint when the mouse is pressed
    };

    const mouseUpListener = () => {
      isDrawingRef.current = false;
      prevPointRef.current = null;
    };

    canvas.addEventListener("mousemove", mouseMoveListener);
    canvas.addEventListener("mousedown", mouseDownListener);
    canvas.addEventListener("mouseup", mouseUpListener);

    return () => {
      canvas.removeEventListener("mousemove", mouseMoveListener);
      canvas.removeEventListener("mousedown", mouseDownListener);
      canvas.removeEventListener("mouseup", mouseUpListener);
    };
  }, [onDrawCallback]);

  function computePointInCanvas(clientX, clientY) {
    const boundingRect = canvasRef.current.getBoundingClientRect();
    return {
      x: clientX - boundingRect.left,
      y: clientY - boundingRect.top,
    };
  }

  return (ref) => {
    if (ref) {
      canvasRef.current = ref;
      ref.width = ref.clientWidth;   // Set canvas width explicitly
      ref.height = ref.clientHeight; // Set canvas height explicitly
    }
  };
}

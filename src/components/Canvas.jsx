import {React, useState} from "react";
import { Paper } from "@mui/material";
import { useOnDraw } from "./Hooks";

const Canvas = ({ width, height, backgroundImageUrl }) => {

  const onDraw = (ctx, point, prevPoint, currentShape) => {
    switch (currentShape) {
      case "line":
        drawLine(prevPoint, point, ctx, "#000000", 5);
        break;
      case "rectangle":
        drawRectangle(prevPoint, point, ctx, "#000000", 5);
        break;
      // Add cases for other shapes as needed
      default:
        break;
    }
  };

  const { setCanvasRef, setCurrentShape } = useOnDraw(onDraw);

  function drawLine(start, end, ctx, color, width) {
    start = start ?? end;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(start.x, start.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  function drawRectangle(start, end, ctx, color, width) {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
    ctx.stroke();
  }

  const canvasPaperStyle = {
    padding: "20px",
    margin: "20px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const canvasStyle = {
    border: "1px solid black",
    width: "100%",
    height: "100%",
  };

  return (
    <Paper elevation={3} style={canvasPaperStyle}>
      <canvas
        width={width}
        height={height}
        style={canvasStyle}
        ref={setCanvasRef}
      ></canvas>
    </Paper>
  );
};

export default Canvas;

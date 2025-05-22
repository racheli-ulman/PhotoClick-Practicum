// "use client"

// import type React from "react"
// import { useRef, useEffect } from "react"

// interface BrushStrokesProps {
//   paths: {
//     points: { x: number; y: number }[]
//     color: string
//     size: number
//   }[]
// }

// const BrushStrokes: React.FC<BrushStrokesProps> = ({ paths }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null)

//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return

//     const ctx = canvas.getContext("2d")
//     if (!ctx) return

//     // Set canvas size
//     canvas.width = canvasRef.current.parentElement?.clientWidth || window.innerWidth
//     canvas.height = canvasRef.current.parentElement?.clientHeight || window.innerHeight

//     // Clear canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height)

//     // Draw all paths
//     paths.forEach((path) => {
//       if (path.points.length < 2) return

//       ctx.beginPath()
//       ctx.moveTo(path.points[0].x, path.points[0].y)

//       for (let i = 1; i < path.points.length; i++) {
//         ctx.lineTo(path.points[i].x, path.points[i].y)
//       }

//       ctx.strokeStyle = path.color
//       ctx.lineWidth = path.size
//       ctx.lineCap = "round"
//       ctx.lineJoin = "round"
//       ctx.stroke()
//     })
//   }, [paths])

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{
//         position: "absolute",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         pointerEvents: "none",
//       }}
//     />
//   )
// }

// export default BrushStrokes

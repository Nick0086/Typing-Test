export const drawMesh = (predictions, ctx, faceLandmarksDetection) => {
    if (predictions.length > 0) {
        predictions.forEach(prediction => {
            const keypoints = prediction?.keypoints || [];
            const adjacentPairs = faceLandmarksDetection.util.getAdjacentPairs(faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh);


            // console.log(adjacentPairs)

            // Draw points
            for (let i = 0; i < keypoints.length; i++) {
                const { x, y } = keypoints[i];
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, 3 * Math.PI);
                ctx.fillStyle = "aqua";
                ctx.fill();
            }

             // Draw lines (edges)
             for (let i = 0; i < adjacentPairs.length; i++) {
                const [startIndex, endIndex] = adjacentPairs[i];
                const start = keypoints[startIndex];
                const end = keypoints[endIndex];

                if (start && end) {
                    ctx.beginPath();
                    ctx.moveTo(start.x, start.y);
                    ctx.lineTo(end.x, end.y);
                    ctx.strokeStyle = "lime";
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });
    }
};
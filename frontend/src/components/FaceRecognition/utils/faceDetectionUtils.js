export const drawMesh = (predictions, ctx, faceLandmarksDetection) => {
    if (predictions.length > 0) {
        // Loop through all predictions (faces detected)
        predictions.forEach(prediction => {
            const keypoints = prediction?.keypoints || []; // Get the detected keypoints (landmark positions)

            // Get the adjacent pairs for connecting keypoints to form edges
            const adjacentPairs = faceLandmarksDetection.util.getAdjacentPairs(
                faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh
            );

            // Step 1: Draw lines (edges) connecting keypoints
            for (let i = 0; i < adjacentPairs.length; i++) {
                const [startIndex, endIndex] = adjacentPairs[i]; // Get indices of the keypoints to connect
                const start = keypoints[startIndex]; // Start keypoint
                const end = keypoints[endIndex]; // End keypoint

                if (start && end) {
                    ctx.beginPath(); // Begin a new drawing path
                    ctx.moveTo(start.x, start.y); // Move to the starting keypoint
                    ctx.lineTo(end.x, end.y); // Draw a line to the ending keypoint
                    ctx.strokeStyle = "#03fc62"; // Set line color to green
                    ctx.lineWidth = 0.5; // Set line thickness
                    ctx.stroke(); // Render the line on the canvas
                }
            }

            // Step 2: Draw points (keypoints) above the lines
            for (let i = 0; i < keypoints.length; i++) {
                const { x, y } = keypoints[i]; // Extract x, y coordinates of the keypoint

                ctx.beginPath(); // Begin a new drawing path for the point
                ctx.arc(x, y, 2, 0, 2 * Math.PI); // Draw a circle at the keypoint position
                /**
                 * Explanation of arc parameters:
                 * - x, y: Position of the center of the circle
                 * - 2: Radius of the circle (adjustable for point size)
                 * - 0: Start angle of the arc (0 radians)
                 * - 2 * Math.PI: End angle (full circle)
                 */
                ctx.fillStyle = "#6DD5FA"; // Set point color to aqua
                ctx.fill(); // Fill the circle to make it a solid point
            }
        });
    }
};

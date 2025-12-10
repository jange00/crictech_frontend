export const generatePoseOverlayData = (jointAngles, isExpert = false) => {
  const basePositions = [
    { name: "Shoulder", x: 45, y: 25 },
    { name: "Elbow", x: 50, y: 40 },
    { name: "Wrist", x: 52, y: 55 },
  ];

  return basePositions.map((position) => {
    const jointData = jointAngles.find((j) => j.joint === position.name);
    const angle = isExpert
      ? jointData?.expertAngle || 150
      : jointData?.userAngle || 145;

    return {
      ...position,
      angle,
    };
  });
};





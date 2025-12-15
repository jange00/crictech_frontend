export const generatePoseOverlayData = (jointAngles, isExpert = false) => {
  const basePositions = [
    // We keep the short display names, but we will match against multiple
    // possible API joint labels (e.g. "Right Shoulder", "Shoulder").
    { name: "Shoulder", x: 45, y: 25, aliases: ["Shoulder", "Right Shoulder"] },
    { name: "Elbow", x: 50, y: 40, aliases: ["Elbow", "Right Elbow"] },
    { name: "Wrist", x: 52, y: 55, aliases: ["Wrist", "Right Wrist"] },
  ];

  const getAngleFromJoint = (jointData) => {
    if (!jointData) return null;

    // Prefer explicit user/expert fields from the API,
    // but gracefully fall back to generic "angle" fields.
    const primary = isExpert ? jointData.expertAngle : jointData.userAngle;
    const secondary = jointData.angle ?? jointData.value ?? jointData.measuredAngle;

    return primary ?? secondary ?? null;
  };

  return basePositions.map((position) => {
    const jointData =
      jointAngles.find((j) => position.aliases.includes(j.joint)) ||
      jointAngles.find((j) => position.aliases.includes(j.name));

    const angle = getAngleFromJoint(jointData);

    return {
      ...position,
      // If we still couldn't resolve an angle from the API, use a safe default
      // so the UI never breaks, but this should now be rare.
      angle: angle ?? (isExpert ? 150 : 145),
    };
  });
};





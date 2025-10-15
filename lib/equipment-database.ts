export interface Equipment {
  id: string;
  qrCode: string;
  name: string;
  type: "Cardio" | "Strength" | "Circuit" | "Flexibility";
  status: "Available" | "In Use" | "Maintenance" | "Out of Order";
  instructions: string[];
  maxTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  calories: string;
  exerciseURL: string;
  targetMuscles?: string[];
  image?: string;
}

export const equipmentDatabase: Record<string, Equipment> = {
  EQUIPMENT_DUMBBELL: {
    id: "DB_001",
    qrCode: "EQUIPMENT_DUMBBELL",
    name: "Dumbbell",
    type: "Strength",
    status: "Available",
    instructions: [
      "Select a weight that allows 8-12 controlled reps",
      "Keep your core braced and back neutral",
      "Move with control; avoid swinging the weights",
      "Exhale on the exertion, inhale on the return",
      "Re-rack dumbbells after use",
    ],
    maxTime: "30 minutes",
    difficulty: "All Levels",
    calories: "100-200 calories per 30 min",
    targetMuscles: ["Arms", "Shoulders", "Back", "Chest", "Core"],
    exerciseURL: "/exercises/dumbbells",
  },
  EQUIPMENT_KETTLEBELL: {
    id: "KB_001",
    qrCode: "EQUIPMENT_KETTLEBELL",
    name: "Kettlebell",
    type: "Strength",
    status: "Available",
    instructions: [
      "Warm up shoulders and hips before starting",
      "Hinge at the hips; avoid rounding your back",
      "Snap the hips for swings; keep arms relaxed",
      "Park the bell safely between sets",
      "Choose a weight you can control with good form",
    ],
    maxTime: "30 minutes",
    difficulty: "All Levels",
    calories: "200-300 calories per 30 min",
    targetMuscles: ["Glutes", "Hamstrings", "Back", "Core", "Shoulders"],
    exerciseURL: "/exercises/kettlebell",
  },
  EQUIPMENT_ABS_ROLLER: {
    id: "AR_001",
    qrCode: "EQUIPMENT_ABS_ROLLER",
    name: "Abs Roller",
    type: "Flexibility",
    status: "Available",
    instructions: [
      "Kneel on a mat and grip the roller handles",
      "Roll forward keeping a neutral spine and braced core",
      "Go as far as you can without arching the lower back",
      "Roll back by pulling through the core, not the hips",
      "Start with short range and increase gradually",
    ],
    maxTime: "15 minutes",
    difficulty: "Beginner",
    calories: "50-100 calories per 15 min",
    targetMuscles: ["Abdominals", "Obliques", "Lower Back"],
    exerciseURL: "/exercises/ab-roller-wheel",
  },
};

export function getEquipmentByQR(qrCode: string): Equipment | null {
  return equipmentDatabase[qrCode] || null;
}

export function getAllEquipment(): Equipment[] {
  return Object.values(equipmentDatabase);
}

export function getEquipmentByType(type: Equipment["type"]): Equipment[] {
  return Object.values(equipmentDatabase).filter(
    (equipment) => equipment.type === type
  );
}

export function updateEquipmentStatus(
  qrCode: string,
  status: Equipment["status"]
): boolean {
  if (equipmentDatabase[qrCode]) {
    equipmentDatabase[qrCode].status = status;
    return true;
  }
  return false;
}

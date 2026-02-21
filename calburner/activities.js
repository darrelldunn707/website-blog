// activities.js
// Simple MET presets for average users: default + easy/moderate/hard.
// Values are intentionally constrained (no huge ranges) to keep UX simple.

export const ACTIVITY_GROUPS = [
  {
    groupId: "mobility",
    groupName: "Mobility & Recovery",
    activities: [
      { id: "bodywork", name: "Bodywork", defaultMET: 2.5, presets: { easy: 2.0, moderate: 2.5, hard: 3.0 } },
      { id: "rom", name: "ROM Exercises", defaultMET: 2.0, presets: { easy: 1.8, moderate: 2.0, hard: 2.3 } },
      { id: "static_stretch", name: "Static Stretching", defaultMET: 2.3, presets: { easy: 2.0, moderate: 2.3, hard: 2.6 } },
      { id: "dynamic_mobility", name: "Dynamic Stretching / Mobility Flow", defaultMET: 3.0, presets: { easy: 2.6, moderate: 3.0, hard: 3.5 } },
      { id: "yoga_light", name: "Light Yoga", defaultMET: 2.8, presets: { easy: 2.3, moderate: 2.8, hard: 3.2 } },
      { id: "yoga_advanced", name: "Advanced Yoga (Power/Vinyasa)", defaultMET: 4.0, presets: { easy: 3.5, moderate: 4.0, hard: 5.0 } },
    ],
  },

  {
    groupId: "walking",
    groupName: "Walking",
    activities: [
      { id: "walk_slow", name: "Walking (slow)", defaultMET: 2.8, presets: { easy: 2.5, moderate: 2.8, hard: 3.0 } },
      { id: "walk_moderate", name: "Walking (moderate)", defaultMET: 3.5, presets: { easy: 3.0, moderate: 3.5, hard: 4.0 } },
      { id: "walk_brisk", name: "Walking (brisk)", defaultMET: 4.3, presets: { easy: 4.0, moderate: 4.3, hard: 5.0 } },
    ],
  },

  {
    groupId: "strength",
    groupName: "Strength & Bodyweight",
    activities: [
      { id: "resistance_moderate", name: "Resistance Training (moderate)", defaultMET: 3.5, presets: { easy: 3.0, moderate: 3.5, hard: 4.5 } },
      { id: "resistance_vigorous", name: "Resistance Training (vigorous)", defaultMET: 6.0, presets: { easy: 5.0, moderate: 6.0, hard: 7.0 } },

      { id: "bodyweight_light", name: "Bodyweight (light)", defaultMET: 4.0, presets: { easy: 3.5, moderate: 4.0, hard: 4.8 } },
      { id: "bodyweight_moderate", name: "Bodyweight (moderate)", defaultMET: 5.0, presets: { easy: 4.5, moderate: 5.0, hard: 6.0 } },

      { id: "calisthenics_vigorous", name: "Calisthenics (vigorous)", defaultMET: 7.5, presets: { easy: 6.0, moderate: 7.5, hard: 9.0 } },
    ],
  },

  {
    groupId: "hiit",
    groupName: "HIIT",
    activities: [
      { id: "hiit_moderate", name: "HIIT (moderate)", defaultMET: 7.0, presets: { easy: 6.0, moderate: 7.0, hard: 8.5 } },
      { id: "hiit_vigorous", name: "HIIT (vigorous)", defaultMET: 11.0, presets: { easy: 9.0, moderate: 11.0, hard: 12.5 } },
      { id: "hiit_bodyweight", name: "Bodyweight HIIT", defaultMET: 9.0, presets: { easy: 7.5, moderate: 9.0, hard: 11.0 } },
    ],
  },

  {
    groupId: "running",
    groupName: "Running",
    activities: [
      { id: "jog_easy", name: "Jogging (easy)", defaultMET: 7.0, presets: { easy: 6.5, moderate: 7.0, hard: 7.8 } },
      { id: "run_5mph", name: "Running (~5 mph)", defaultMET: 8.5, presets: { easy: 8.0, moderate: 8.5, hard: 9.0 } },
      { id: "run_6mph", name: "Running (~6 mph)", defaultMET: 9.3, presets: { easy: 9.0, moderate: 9.3, hard: 10.0 } },
      { id: "run_7_5mph", name: "Running (~7.5 mph)", defaultMET: 11.8, presets: { easy: 11.0, moderate: 11.8, hard: 12.5 } },
      { id: "sprint", name: "Sprinting", defaultMET: 15.0, presets: { easy: 13.0, moderate: 15.0, hard: 16.0 } },
    ],
  },

  {
    groupId: "cycling",
    groupName: "Cycling",
    activities: [
      { id: "cycle_easy", name: "Cycling (easy)", defaultMET: 4.0, presets: { easy: 3.5, moderate: 4.0, hard: 5.0 } },
      { id: "cycle_moderate", name: "Cycling (moderate)", defaultMET: 6.8, presets: { easy: 6.0, moderate: 6.8, hard: 8.0 } },
      { id: "cycle_vigorous", name: "Cycling (vigorous/fast)", defaultMET: 10.0, presets: { easy: 8.5, moderate: 10.0, hard: 11.0 } },
    ],
  },

  {
    groupId: "swimming",
    groupName: "Swimming & Water",
    activities: [
      { id: "swim_easy", name: "Swimming (easy laps)", defaultMET: 6.0, presets: { easy: 5.0, moderate: 6.0, hard: 7.0 } },
      { id: "swim_moderate", name: "Swimming (moderate laps)", defaultMET: 8.0, presets: { easy: 7.0, moderate: 8.0, hard: 9.0 } },
      { id: "swim_hard", name: "Swimming (fast/hard laps)", defaultMET: 10.0, presets: { easy: 9.0, moderate: 10.0, hard: 11.0 } },
      { id: "water_aerobics", name: "Water Aerobics", defaultMET: 6.0, presets: { easy: 5.0, moderate: 6.0, hard: 7.0 } },
    ],
  },

  {
    groupId: "dance",
    groupName: "Dance & Classes",
    activities: [
      { id: "zumba", name: "Zumba", defaultMET: 6.0, presets: { easy: 5.5, moderate: 6.0, hard: 7.0 } },
      { id: "aerobic_dance", name: "Aerobic Dance", defaultMET: 6.5, presets: { easy: 5.5, moderate: 6.5, hard: 7.5 } },
      { id: "step_aerobics", name: "Step Aerobics", defaultMET: 8.5, presets: { easy: 7.0, moderate: 8.5, hard: 9.5 } },
    ],
  },

  {
    groupId: "martial_arts",
    groupName: "Martial Arts",
    activities: [
      { id: "martial_practice", name: "Martial Arts (practice)", defaultMET: 6.0, presets: { easy: 5.3, moderate: 6.0, hard: 7.5 } },
      { id: "martial_sparring", name: "Martial Arts (sparring/competition)", defaultMET: 10.0, presets: { easy: 8.5, moderate: 10.0, hard: 11.5 } },
    ],
  },

  {
    groupId: "machines",
    groupName: "Cardio Machines",
    activities: [
      { id: "elliptical", name: "Elliptical", defaultMET: 5.0, presets: { easy: 4.5, moderate: 5.0, hard: 6.5 } },
      { id: "rower", name: "Rowing Machine", defaultMET: 7.0, presets: { easy: 6.0, moderate: 7.0, hard: 9.0 } },
      { id: "jump_rope", name: "Jump Rope", defaultMET: 11.0, presets: { easy: 9.0, moderate: 11.0, hard: 12.5 } },
      { id: "stair_machine", name: "Stair Machine", defaultMET: 9.0, presets: { easy: 8.0, moderate: 9.0, hard: 10.0 } },
    ],
  },
];

/**
 * Helper: flat list for search/autocomplete
 */
export function flattenActivities(groups = ACTIVITY_GROUPS) {
  return groups.flatMap((g) =>
    g.activities.map((a) => ({
      groupId: g.groupId,
      groupName: g.groupName,
      ...a,
    }))
  );
}

/**
 * Helper: get MET from activity + intensity.
 * intensity: "easy" | "moderate" | "hard" | undefined
 */
export function getMET(activity, intensity) {
  if (!activity) return null;
  if (!intensity) return activity.defaultMET;
  return activity.presets?.[intensity] ?? activity.defaultMET;
}
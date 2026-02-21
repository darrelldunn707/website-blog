// Daily Calorie Burner (no DB, all client-side)
import { ACTIVITY_GROUPS, flattenActivities, getMET } from "./activities.js";

const $ = (id) => document.getElementById(id);

const el = {
  gender: $("gender"),
  birthdate: $("birthdate"),
  age: $("age"),
  heightCm: $("heightCm"),
  weightKg: $("weightKg"),
  baseFactor: $("baseFactor"),
  goalPct: $("goalPct"),
  consumed: $("consumed"),

  bmrOut: $("bmrOut"),
  actCalsOut: $("actCalsOut"),
  tdeeOut: $("tdeeOut"),
  tdeeOut2: $("tdeeOut2"),
  adjLabel: $("adjLabel"),
  adjOut: $("adjOut"),
  targetOut: $("targetOut"),
  remainOut: $("remainOut"),

  activities: $("activities"),
  addActivityBtn: $("addActivityBtn"),

  copyLinkBtn: $("copyLinkBtn"),
  copyStatus: $("copyStatus"),
};

const allActivities = flattenActivities(ACTIVITY_GROUPS);
const defaultActivityId = allActivities[0]?.id || "";

function findActivityById(activityId) {
  return allActivities.find((a) => a.id === activityId) || allActivities[0] || null;
}

function round(n) {
  if (!Number.isFinite(n)) return "—";
  return Math.round(n).toString();
}

// Mifflin-St Jeor (metric)
function calcBMR({ gender, age, heightCm, weightKg }) {
  if (![age, heightCm, weightKg].every(Number.isFinite)) return NaN;

  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

function calcActivityCals(weightKg, met, minutes) {
  if (![weightKg, met, minutes].every(Number.isFinite)) return 0;
  const hours = minutes / 60;
  // Standard MET formula: kcal = MET * weight(kg) * hours
  return met * weightKg * hours;
}

function calcAgeYears(birthdateStr) {
  const bd = new Date(birthdateStr);
  const ms = bd.getTime();
  if (!Number.isFinite(ms)) return NaN;
  return (Date.now() - ms) / (365.2425 * 24 * 60 * 60 * 1000);
}

function getActivities() {
  const rows = [...el.activities.querySelectorAll(".activityRow")];
  return rows.map((row) => {
    const activityId = row.querySelector('[data-field="activity"]').value;
    const intensity = row.querySelector('[data-field="intensity"]').value;
    const met = Number(row.querySelector('[data-field="met"]').value);
    const minutes = Number(row.querySelector('[data-field="minutes"]').value);
    return { activityId, intensity, met, minutes };
  });
}

function renderActivityRow({ activityId = defaultActivityId, intensity = "moderate", met, minutes = 30 } = {}) {
  const row = document.createElement("div");
  row.className = "activityRow";

  const state = {
    selectedActivityId: activityId,
    intensity,
    metManualOverride: false,
  };

  const options = ACTIVITY_GROUPS
    .map((group) => {
      const groupOptions = group.activities
        .map((activity) => `<option value="${activity.id}" ${activity.id === state.selectedActivityId ? "selected" : ""}>${activity.name}</option>`)
        .join("");
      return `<optgroup label="${group.groupName}">${groupOptions}</optgroup>`;
    })
    .join("");

  const selectedActivity = findActivityById(state.selectedActivityId);
  const initialMET = Number.isFinite(met) ? met : getMET(selectedActivity, state.intensity);

  row.innerHTML = `
    <label>
      Activity
      <select data-field="activity">${options}</select>
    </label>

    <label>
      Intensity
      <select data-field="intensity">
        <option value="easy" ${state.intensity === "easy" ? "selected" : ""}>Easy</option>
        <option value="moderate" ${state.intensity === "moderate" ? "selected" : ""}>Moderate</option>
        <option value="hard" ${state.intensity === "hard" ? "selected" : ""}>Hard</option>
      </select>
    </label>

    <label>
      MET
      <input data-field="met" type="number" min="0" step="0.1" value="${initialMET}" />
    </label>

    <label>
      Minutes
      <input data-field="minutes" type="number" min="0" step="1" value="${minutes}" />
    </label>

    <button type="button" data-field="remove">Remove</button>
  `;

  const setMETFromSelection = () => {
    const activity = findActivityById(state.selectedActivityId);
    const metValue = getMET(activity, state.intensity);
    row.querySelector('[data-field="met"]').value = metValue;
  };

  row.querySelector('[data-field="activity"]').addEventListener("change", (e) => {
    state.selectedActivityId = e.target.value;
    state.metManualOverride = false;
    setMETFromSelection();
    recalcAndRender();
  });

  row.querySelector('[data-field="intensity"]').addEventListener("change", (e) => {
    state.intensity = e.target.value;
    state.metManualOverride = false;
    setMETFromSelection();
    recalcAndRender();
  });

  row.querySelector('[data-field="met"]').addEventListener("input", () => {
    state.metManualOverride = true;
    recalcAndRender();
  });
  row.querySelector('[data-field="minutes"]').addEventListener("input", recalcAndRender);

  row.querySelector('[data-field="remove"]').addEventListener("click", () => {
    row.remove();
    recalcAndRender();
  });

  el.activities.appendChild(row);
}

function recalcAndRender() {
  const gender = el.gender.value;
  const ageYears = calcAgeYears(el.birthdate.value);
  el.age.value = Number.isFinite(ageYears) ? ageYears.toFixed(2) : "";
  const age = ageYears;
  const heightCm = Number(el.heightCm.value);
  const weightKg = Number(el.weightKg.value);

  const baseFactor = Number(el.baseFactor.value);
  const goalPct = Number(el.goalPct.value);
  const consumed = el.consumed.value === "" ? NaN : Number(el.consumed.value);

  const bmr = calcBMR({ gender, age, heightCm, weightKg });

  const activities = getActivities();
  const actCals = activities.reduce((sum, a) => sum + calcActivityCals(weightKg, a.met, a.minutes), 0);

  const tdee = (bmr * baseFactor) + actCals;

  const adj = tdee * (goalPct / 100);
  const target = tdee + adj;

  const remaining = Number.isFinite(consumed) ? (target - consumed) : NaN;

  el.bmrOut.textContent = round(bmr);
  el.actCalsOut.textContent = round(actCals);
  el.tdeeOut.textContent = round(tdee);
  el.tdeeOut2.textContent = round(tdee);

  const goalText = el.goalPct.options[el.goalPct.selectedIndex]?.textContent || "Maintenance 0%";
  const goalLabel = goalText.replace(/\s[+-]\d+%$/, "");
  const goalPercent = `${goalPct > 0 ? "+" : ""}${goalPct}%`;
  el.adjLabel.textContent = `Adjustment (${goalLabel}, ${goalPercent})`;
  el.adjOut.textContent = Number.isFinite(adj) ? `${adj >= 0 ? "+" : ""}${round(adj)}` : "—";
  el.targetOut.textContent = round(target);
  el.remainOut.textContent = Number.isFinite(remaining) ? round(remaining) : "—";
}

function setFromQuery() {
  const params = new URLSearchParams(window.location.search);

  const setIf = (id, val) => {
    if (val === null) return;
    const node = $(id);
    if (!node) return;
    node.value = val;
  };

  setIf("gender", params.get("gender") ?? params.get("sex"));
  setIf("birthdate", params.get("bd") ?? params.get("birthdate"));
  setIf("heightCm", params.get("h"));
  setIf("weightKg", params.get("w"));
  setIf("baseFactor", params.get("bf"));
  setIf("goalPct", params.get("g"));
  setIf("consumed", params.get("c"));

  // activities: a=activityId|met|min|intensity;activityId|met|min|intensity
  const a = params.get("a");
  if (a) {
    el.activities.innerHTML = "";
    const parts = a.split(";");
    for (const p of parts) {
      const [activityRaw, met, min, intensity] = p.split("|");
      const activityDecoded = decodeURIComponent(activityRaw || "");
      const resolvedActivityId = allActivities.some((item) => item.id === activityDecoded)
        ? activityDecoded
        : (allActivities.find((item) => item.name === activityDecoded)?.id || defaultActivityId);
      renderActivityRow({
        activityId: resolvedActivityId,
        met: Number(met),
        minutes: Number(min) || 30,
        intensity: ["easy", "moderate", "hard"].includes((intensity || "").toLowerCase()) ? intensity.toLowerCase() : "moderate",
      });
    }
  }
}

function buildShareUrl() {
  const params = new URLSearchParams();
  params.set("gender", el.gender.value);
  if (el.birthdate.value !== "") params.set("bd", el.birthdate.value);
  params.set("h", el.heightCm.value);
  params.set("w", el.weightKg.value);
  params.set("bf", el.baseFactor.value);
  params.set("g", el.goalPct.value);
  if (el.consumed.value !== "") params.set("c", el.consumed.value);

  const activities = getActivities().map((a) => {
    const safeActivityId = encodeURIComponent(a.activityId);
    const met = Number.isFinite(a.met) ? a.met : "";
    const min = Number.isFinite(a.minutes) ? a.minutes : "";
    return `${safeActivityId}|${met}|${min}|${a.intensity}`;
  });
  if (activities.length) params.set("a", activities.join(";"));

  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}?${params.toString()}`;
}

async function copyShareLink() {
  const url = buildShareUrl();
  try {
    await navigator.clipboard.writeText(url);
    el.copyStatus.textContent = "Copied!";
  } catch {
    el.copyStatus.textContent = "Couldn’t copy (browser blocked).";
  }
  setTimeout(() => (el.copyStatus.textContent = ""), 1500);
}

// Wire up
["gender", "birthdate", "heightCm", "weightKg", "baseFactor", "goalPct", "consumed"].forEach((id) => {
  $(id).addEventListener("input", recalcAndRender);
  $(id).addEventListener("change", recalcAndRender);
});

el.addActivityBtn.addEventListener("click", () => renderActivityRow());
el.copyLinkBtn.addEventListener("click", copyShareLink);

// Init
renderActivityRow(); // start with one activity row
setFromQuery();
recalcAndRender();

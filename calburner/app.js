// Daily Calorie Burner (no DB, all client-side)

const $ = (id) => document.getElementById(id);

const el = {
  gender: $("gender"),
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

// TODO: Replace this activity preset list with the upcoming updated list.
const activityPresets = [
  { name: "Static Stretching", met: 2.4 },
  { name: "Light Yoga", met: 2.8 },
  { name: "Walking (slow)", met: 2.6 },
  { name: "Walking (moderate)", met: 3.8 },
  { name: "Walking (brisk)", met: 4.1 },
  { name: "Running (easy)", met: 8.3 },
  { name: "Running (moderate)", met: 9.8 },
  { name: "Resistance training (light)", met: 3.5 },
  { name: "Resistance training (moderate)", met: 5.0 },
  { name: "HIIT", met: 8.0 },
];

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

function getActivities() {
  const rows = [...el.activities.querySelectorAll(".activityRow")];
  return rows.map((row) => {
    const name = row.querySelector('[data-field="name"]').value;
    const met = Number(row.querySelector('[data-field="met"]').value);
    const minutes = Number(row.querySelector('[data-field="minutes"]').value);
    return { name, met, minutes };
  });
}

function renderActivityRow({ name = activityPresets[0].name, met = activityPresets[0].met, minutes = 30 } = {}) {
  const row = document.createElement("div");
  row.className = "activityRow";

  const options = activityPresets
    .map((p) => `<option value="${p.name}" ${p.name === name ? "selected" : ""}>${p.name}</option>`)
    .join("");

  row.innerHTML = `
    <label>
      Activity
      <select data-field="name">${options}</select>
    </label>

    <label>
      MET
      <input data-field="met" type="number" min="0" step="0.1" value="${met}" />
    </label>

    <label>
      Minutes
      <input data-field="minutes" type="number" min="0" step="1" value="${minutes}" />
    </label>

    <button type="button" data-field="remove">Remove</button>
  `;

  // When preset changes, auto-fill MET (user can still override after)
  row.querySelector('[data-field="name"]').addEventListener("change", (e) => {
    const preset = activityPresets.find((p) => p.name === e.target.value);
    if (preset) row.querySelector('[data-field="met"]').value = preset.met;
    recalc();
  });

  row.querySelector('[data-field="met"]').addEventListener("input", recalc);
  row.querySelector('[data-field="minutes"]').addEventListener("input", recalc);

  row.querySelector('[data-field="remove"]').addEventListener("click", () => {
    row.remove();
    recalc();
  });

  el.activities.appendChild(row);
}

function recalc() {
  const gender = el.gender.value;
  const age = Number(el.age.value);
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
  setIf("age", params.get("age"));
  setIf("heightCm", params.get("h"));
  setIf("weightKg", params.get("w"));
  setIf("baseFactor", params.get("bf"));
  setIf("goalPct", params.get("g"));
  setIf("consumed", params.get("c"));

  // activities: a=name|met|min;name|met|min
  const a = params.get("a");
  if (a) {
    el.activities.innerHTML = "";
    const parts = a.split(";");
    for (const p of parts) {
      const [name, met, min] = p.split("|");
      renderActivityRow({
        name: decodeURIComponent(name || activityPresets[0].name),
        met: Number(met) || activityPresets[0].met,
        minutes: Number(min) || 30,
      });
    }
  }
}

function buildShareUrl() {
  const params = new URLSearchParams();
  params.set("gender", el.gender.value);
  params.set("age", el.age.value);
  params.set("h", el.heightCm.value);
  params.set("w", el.weightKg.value);
  params.set("bf", el.baseFactor.value);
  params.set("g", el.goalPct.value);
  if (el.consumed.value !== "") params.set("c", el.consumed.value);

  const activities = getActivities().map((a) => {
    const safeName = encodeURIComponent(a.name);
    const met = Number.isFinite(a.met) ? a.met : "";
    const min = Number.isFinite(a.minutes) ? a.minutes : "";
    return `${safeName}|${met}|${min}`;
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
["gender", "age", "heightCm", "weightKg", "baseFactor", "goalPct", "consumed"].forEach((id) => {
  $(id).addEventListener("input", recalc);
  $(id).addEventListener("change", recalc);
});

el.addActivityBtn.addEventListener("click", () => renderActivityRow());
el.copyLinkBtn.addEventListener("click", copyShareLink);

// Init
renderActivityRow(); // start with one activity row
setFromQuery();
recalc();

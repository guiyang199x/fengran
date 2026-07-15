/**
 * FENGRAN (锋燃) iOS prototype, interaction layer.
 * Vanilla JS, no framework/build step (matches this repo's existing
 * standalone-HTML tooling convention: index.html / setup.html).
 */

(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* State                                                              */
  /* ------------------------------------------------------------------ */

  const state = {
    currentTab: "home",
    stacks: {
      home: ["home-root"],
      library: ["library-root"],
      training: ["training-root"],
      community: ["community-root"],
      profile: ["profile-root"],
    },
    library: {
      search: "",
      bodyPart: "all",
      equipment: new Set(),
      equipmentDraft: new Set(),
    },
    training: {
      segment: "log",
    },
    workout: {
      planId: null,
      exerciseIndex: 0,
      sets: {},
      elapsedSeconds: 0,
      timerHandle: null,
      restHandle: null,
    },
    coach: {
      messages: [
        { from: "assistant", text: "嗨 Alex，我是燃燃 🔥 你的 AI 训练教练。想聊聊今天的训练安排，还是有动作上的问题？" },
      ],
    },
    community: {
      currentPostId: null,
    },
  };

  const BODY_PARTS_ORDER = ["chest", "back", "upper legs", "lower legs", "shoulders", "upper arms", "lower arms", "waist", "cardio", "neck"];

  /* ------------------------------------------------------------------ */
  /* Small DOM helpers                                                  */
  /* ------------------------------------------------------------------ */

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $all = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === "class") node.className = v;
        else if (k === "html") node.innerHTML = v;
        else if (k.startsWith("data-")) node.setAttribute(k, v);
        else node.setAttribute(k, v);
      });
    }
    (children || []).forEach((c) => {
      if (typeof c === "string") node.appendChild(document.createTextNode(c));
      else if (c) node.appendChild(c);
    });
    return node;
  }

  function showToast(message) {
    const host = $("#toast-host");
    const toast = el("div", { class: "toast" }, [message]);
    host.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("is-visible"));
    setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  /* ------------------------------------------------------------------ */
  /* Splash                                                             */
  /* ------------------------------------------------------------------ */

  function hideSplash() {
    const splash = $("#splash");
    if (!splash || splash.classList.contains("is-hidden")) return;
    splash.classList.add("is-hidden");
  }

  /* ------------------------------------------------------------------ */
  /* Tab switching                                                      */
  /* ------------------------------------------------------------------ */

  function switchTab(name) {
    if (state.currentTab === name) return;
    state.currentTab = name;
    $all(".tab-panel").forEach((p) => p.classList.toggle("is-active", p.dataset.tabPanel === name));
    $all(".tab-item").forEach((btn) => {
      const active = btn.dataset.tabTarget === name;
      btn.classList.toggle("is-selected", active);
      const icon = btn.querySelector("i");
      const iconName = icon.getAttribute("data-icon");
      icon.className = active ? `ph-fill ${iconName}` : `ph ${iconName}`;
    });
    if (name === "training") {
      // the segmented indicator can only measure real widths once its
      // panel is visible (display:none ancestors report 0 offsetWidth)
      requestAnimationFrame(() => {
        const activeSeg = $("#training-segmented .segmented__item.is-active");
        if (activeSeg) positionSegmentIndicator(activeSeg);
      });
    }
  }

  function initTabIconNames() {
    $all(".tab-item").forEach((btn) => {
      const icon = btn.querySelector("i");
      const parts = icon.className.split(" ");
      const iconClass = parts.find((p) => p !== "ph" && p !== "ph-fill");
      icon.setAttribute("data-icon", iconClass);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Nav stack push / pop                                               */
  /* ------------------------------------------------------------------ */

  function pushScreen(tab, screenId) {
    const stack = state.stacks[tab];
    const currentTop = stack[stack.length - 1];
    const stackEl = $(`[data-nav-stack="${tab}"]`);
    const nextEl = $(`[data-screen="${screenId}"]`, stackEl);
    const currentEl = $(`[data-screen="${currentTop}"]`, stackEl);
    if (!nextEl || nextEl === currentEl) return;

    nextEl.setAttribute("data-stack-state", "entering-from-right");
    // force layout so the transition from the right actually plays
    void nextEl.offsetHeight;
    requestAnimationFrame(() => {
      currentEl.setAttribute("data-stack-state", "behind");
      nextEl.setAttribute("data-stack-state", "active");
    });
    stack.push(screenId);
  }

  function popScreen(tab) {
    const stack = state.stacks[tab];
    if (stack.length <= 1) return;
    const stackEl = $(`[data-nav-stack="${tab}"]`);
    const topId = stack.pop();
    const newTopId = stack[stack.length - 1];
    const topEl = $(`[data-screen="${topId}"]`, stackEl);
    const newTopEl = $(`[data-screen="${newTopId}"]`, stackEl);
    topEl.setAttribute("data-stack-state", "exiting-to-right");
    newTopEl.setAttribute("data-stack-state", "active");
  }

  /* ------------------------------------------------------------------ */
  /* Swipe-to-back gesture (edge-swipe, mirrors iOS interactive pop)    */
  /* ------------------------------------------------------------------ */

  function initSwipeBack() {
    const EDGE_ZONE = 28; // px from the left edge that arms the gesture
    const LOCK_THRESHOLD = 8; // px of movement before we commit to an axis

    let pointerId = null;
    let armed = false;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let tab = null;
    let stackEl = null;
    let topEl = null;
    let behindEl = null;
    let width = 0;

    function reset() {
      pointerId = null;
      armed = false;
      dragging = false;
      tab = null;
      stackEl = null;
      topEl = null;
      behindEl = null;
    }

    function overlayOpen() {
      return !!$(".sheet.is-open") || !!$(".modal.is-open");
    }

    function finishDrag(commit) {
      stackEl.classList.remove("is-dragging");
      if (commit) {
        topEl.setAttribute("data-stack-state", "exiting-to-right");
        behindEl.setAttribute("data-stack-state", "active");
        state.stacks[tab].pop();
      }
      [topEl, behindEl].forEach((node) => {
        node.style.transition = "";
        node.style.transform = "";
        node.style.filter = "";
      });
      reset();
    }

    document.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (overlayOpen()) return;
      const stack = e.target.closest(".nav-stack");
      if (!stack) return;
      const rect = stack.getBoundingClientRect();
      if (e.clientX - rect.left > EDGE_ZONE) return;
      const stackName = stack.dataset.navStack;
      if (!stackName || state.stacks[stackName].length <= 1) return;

      tab = stackName;
      stackEl = stack;
      width = rect.width;
      startX = e.clientX;
      startY = e.clientY;
      pointerId = e.pointerId;
      armed = true;
      dragging = false;
    });

    document.addEventListener(
      "pointermove",
      (e) => {
        if (!armed || e.pointerId !== pointerId) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (!dragging) {
          if (Math.abs(dx) < LOCK_THRESHOLD && Math.abs(dy) < LOCK_THRESHOLD) return;
          if (Math.abs(dy) >= Math.abs(dx) || dx <= 0) {
            armed = false;
            return;
          }
          dragging = true;
          const stackState = state.stacks[tab];
          const topId = stackState[stackState.length - 1];
          const behindId = stackState[stackState.length - 2];
          topEl = $(`[data-screen="${topId}"]`, stackEl);
          behindEl = $(`[data-screen="${behindId}"]`, stackEl);
          [topEl, behindEl].forEach((node) => {
            node.style.transition = "none";
          });
          stackEl.classList.add("is-dragging");
        }

        e.preventDefault();
        const clamped = Math.max(0, Math.min(dx, width));
        const progress = clamped / width;
        topEl.style.transform = `translateX(${clamped}px)`;
        behindEl.style.transform = `translateX(${-28 + progress * 28}%)`;
        behindEl.style.filter = `brightness(${0.7 + progress * 0.3})`;
      },
      { passive: false }
    );

    document.addEventListener("pointerup", (e) => {
      if (!armed || e.pointerId !== pointerId) return;
      if (!dragging) {
        reset();
        return;
      }
      const dx = e.clientX - startX;
      finishDrag(dx > width * 0.32);
    });

    document.addEventListener("pointercancel", (e) => {
      if (!armed || e.pointerId !== pointerId) return;
      if (!dragging) {
        reset();
        return;
      }
      finishDrag(false);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Large-title collapse via IntersectionObserver (no scroll listeners) */
  /* ------------------------------------------------------------------ */

  function initCollapseObservers() {
    $all("[data-sentinel]").forEach((sentinel) => {
      const key = sentinel.dataset.sentinel;
      const navbar = $(`[data-navbar="${key}"]`);
      const scrollArea = sentinel.closest(".scroll-area");
      if (!navbar || !scrollArea) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            navbar.classList.toggle("is-collapsed", !entry.isIntersecting && entry.boundingClientRect.top < 0);
          });
        },
        { root: scrollArea, threshold: 0 }
      );
      observer.observe(sentinel);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Overlays: sheets                                                   */
  /* ------------------------------------------------------------------ */

  function openSheet(sheetId) {
    $("#backdrop").classList.add("is-visible");
    $(`#${sheetId}`).classList.add("is-open");
  }

  function closeAllOverlays() {
    $all(".sheet.is-open").forEach((s) => s.classList.remove("is-open"));
    $("#backdrop").classList.remove("is-visible");
  }

  /* ------------------------------------------------------------------ */
  /* Home renders                                                       */
  /* ------------------------------------------------------------------ */

  function renderHome() {
    const plan = PLANS.find((p) => p.id === "p1");
    const thumbs = $("#home-plan-thumbs");
    thumbs.innerHTML = "";
    plan.exerciseIds.forEach((id) => {
      const ex = findExercise(id);
      if (ex) thumbs.appendChild(el("img", { class: "plan-card__thumb", src: ex.image, alt: ex.name }));
    });

    const max = Math.max(...WEEKLY_VOLUME.map((d) => d.value), 1);
    const bars = $("#home-mini-bars");
    bars.innerHTML = "";
    const barEls = [];
    WEEKLY_VOLUME.forEach((d) => {
      const bar = el("div", { class: `mini-bars__bar ${d.value > 0 ? "has-value" : ""}`, style: "height:4px" });
      barEls.push({ bar, target: Math.max(6, (d.value / max) * 100) });
      const col = el("div", { class: "mini-bars__col" }, [bar, el("div", { class: "mini-bars__label" }, [d.label])]);
      bars.appendChild(col);
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        barEls.forEach(({ bar, target }) => { bar.style.height = `${target}%`; });
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Library                                                            */
  /* ------------------------------------------------------------------ */

  function renderLibraryChips() {
    const row = $("#library-chips");
    row.innerHTML = "";
    const allChip = el("button", { class: "chip is-active", "data-action": "chip", "data-chip-value": "all" }, ["全部"]);
    row.appendChild(allChip);
    BODY_PARTS_ORDER.forEach((bp) => {
      row.appendChild(
        el("button", { class: "chip", "data-action": "chip", "data-chip-value": bp }, [BODY_PART_LABEL[bp] || bp])
      );
    });
  }

  function filteredExercises() {
    const { search, bodyPart, equipment } = state.library;
    const q = search.trim().toLowerCase();
    return EXERCISES.filter((ex) => {
      if (bodyPart !== "all" && ex.body_part !== bodyPart) return false;
      if (equipment.size > 0 && !equipment.has(ex.equipment)) return false;
      if (q && !ex.name.toLowerCase().includes(q) && !ex.en.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  function renderLibraryGrid() {
    const grid = $("#library-grid");
    const empty = $("#library-empty");
    const list = filteredExercises();
    grid.innerHTML = "";
    empty.classList.toggle("hidden", list.length > 0);
    grid.classList.toggle("hidden", list.length === 0);
    list.forEach((ex) => {
      const card = el("button", { class: "exercise-card u-reset-btn", "data-action": "open-exercise", "data-exercise-id": ex.id }, [
        el("div", { class: "exercise-card__media-wrap" }, [
          el("img", { class: "exercise-card__media", src: ex.image, alt: ex.name, loading: "lazy" }),
        ]),
        el("div", { class: "exercise-card__body" }, [
          el("div", { class: "exercise-card__name" }, [ex.name]),
          el("div", { class: "exercise-card__tags" }, [
            el("span", { class: "tag tag--accent" }, [ex.target]),
            el("span", { class: "tag" }, [equipmentLabel(ex.equipment)]),
          ]),
        ]),
      ]);
      grid.appendChild(card);
    });
  }

  function updateFilterDot() {
    $("#library-filter-btn").classList.toggle("has-filter", state.library.equipment.size > 0);
  }

  function openExerciseDetail(id) {
    const ex = findExercise(id);
    if (!ex) return;
    const body = $("#exercise-detail-body");
    body.innerHTML = "";
    body.appendChild(el("div", { class: "detail-media" }, [el("img", { src: ex.gif, alt: ex.name })]));
    body.appendChild(el("div", { style: "font-size:19px; font-weight:700; margin-bottom:8px;" }, [ex.name]));
    const tags = el("div", { class: "detail-tags" }, [
      el("span", { class: "tag tag--accent" }, [`目标：${ex.target}`]),
      el("span", { class: "tag" }, [`协同：${ex.muscle_group}`]),
    ]);
    ex.secondary_muscles.forEach((m) => tags.appendChild(el("span", { class: "tag" }, [m])));
    body.appendChild(tags);

    body.appendChild(
      el("div", { class: "detail-meta-grid" }, [
        el("div", { class: "detail-meta-item" }, [
          el("div", { class: "detail-meta-item__label" }, ["部位"]),
          el("div", { class: "detail-meta-item__value" }, [BODY_PART_LABEL[ex.body_part] || ex.body_part]),
        ]),
        el("div", { class: "detail-meta-item" }, [
          el("div", { class: "detail-meta-item__label" }, ["器械"]),
          el("div", { class: "detail-meta-item__value" }, [equipmentLabel(ex.equipment)]),
        ]),
      ])
    );

    body.appendChild(el("div", { style: "font-size:15px; font-weight:700; margin-bottom:10px;" }, ["动作要领"]));
    const stepsList = el("div", { class: "steps-list" });
    ex.steps.forEach((step, i) => {
      stepsList.appendChild(
        el("div", { class: "step-row" }, [
          el("div", { class: "step-row__num" }, [String(i + 1)]),
          el("div", { class: "step-row__text" }, [step]),
        ])
      );
    });
    body.appendChild(stepsList);

    body.appendChild(
      el("button", { class: "btn btn--primary btn--block u-mt-16", "data-action": "add-to-plan", "data-exercise-id": ex.id }, [
        "加入今日计划",
      ])
    );

    openSheet("sheet-exercise-detail");
  }

  function openFilterSheet() {
    state.library.equipmentDraft = new Set(state.library.equipment);
    const uniqueEquipment = Array.from(new Set(EXERCISES.map((e) => e.equipment)));
    const list = $("#filter-equipment-list");
    list.innerHTML = "";
    uniqueEquipment.forEach((eq) => {
      const active = state.library.equipmentDraft.has(eq);
      list.appendChild(
        el(
          "button",
          {
            class: `chip ${active ? "is-active" : ""}`,
            "data-action": "toggle-equipment-draft",
            "data-equipment": eq,
          },
          [equipmentLabel(eq)]
        )
      );
    });
    openSheet("sheet-filter");
  }

  /* ------------------------------------------------------------------ */
  /* Training: log / plan / stats                                       */
  /* ------------------------------------------------------------------ */

  function setSegment(value) {
    state.training.segment = value;
    $all("#training-segmented .segmented__item").forEach((btn, i) => {
      const active = btn.dataset.segmentValue === value;
      btn.classList.toggle("is-active", active);
      if (active) positionSegmentIndicator(btn);
    });
    $all("[data-segment-panel]").forEach((panel) => {
      panel.classList.toggle("hidden", panel.dataset.segmentPanel !== value);
    });
  }

  function positionSegmentIndicator(btn) {
    const indicator = $("#training-segmented-indicator");
    indicator.style.width = `${btn.offsetWidth}px`;
    indicator.style.transform = `translateX(${btn.offsetLeft - 3}px)`;
  }

  function renderLogList() {
    const list = $("#log-list");
    list.innerHTML = "";
    LOG_HISTORY.forEach((log) => {
      list.appendChild(
        el("button", { class: "list-row u-reset-btn", "data-action": "open-log", "data-log-id": log.id }, [
          el("div", { class: "list-row__icon" }, [el("i", { class: "ph-fill ph-check-circle" })]),
          el("div", { style: "flex:1" }, [
            el("div", { class: "list-row__label" }, [log.planName]),
            el("div", { class: "list-row__meta" }, [`${log.date} · ${log.duration} 分钟 · ${log.sets} 组`]),
          ]),
          el("div", { class: "list-row__chevron" }, [el("i", { class: "ph ph-caret-right" })]),
        ])
      );
    });
  }

  function renderPlanList() {
    const wrap = $("#plan-list");
    wrap.innerHTML = "";
    PLANS.forEach((plan) => {
      wrap.appendChild(
        el("button", { class: "card u-reset-btn", style: "padding:15px 16px;", "data-action": "open-plan", "data-plan-id": plan.id }, [
          el("div", { class: "u-row-between" }, [
            el("div", { style: "font-size:16px; font-weight:700;" }, [plan.name]),
            plan.tag ? el("span", { class: "tag tag--accent" }, [plan.tag]) : el("span", { class: "tag" }, [plan.day]),
          ]),
          el("div", { style: "font-size:13px; color:var(--text-tertiary); margin-top:6px;" }, [
            `${plan.exerciseIds.length} 个动作 · 约 ${plan.duration} 分钟`,
          ]),
        ])
      );
    });
  }

  function renderPlanDetail(planId) {
    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) return;
    $("#plan-detail-title-inline").textContent = plan.name;
    const scroll = $("#plan-detail-scroll");
    scroll.innerHTML = "";
    scroll.appendChild(
      el("div", { class: "large-title-block" }, [
        el("div", { class: "navbar__large-title", style: "font-size:26px;" }, [plan.name]),
        el("div", { class: "navbar__subtitle" }, [`${plan.day} · ${plan.exerciseIds.length} 个动作 · 约 ${plan.duration} 分钟`]),
      ])
    );
    scroll.appendChild(
      el("div", { class: "section" }, [
        el("button", { class: "btn btn--primary btn--block", "data-action": "start-workout", "data-plan-id": plan.id }, [
          el("i", { class: "ph-fill ph-play" }),
          "开始训练",
        ]),
      ])
    );
    const list = el("div", { class: "list" });
    plan.exerciseIds.forEach((id) => {
      const ex = findExercise(id);
      if (!ex) return;
      list.appendChild(
        el("button", { class: "list-row u-reset-btn", "data-action": "open-exercise", "data-exercise-id": ex.id }, [
          el("img", { src: ex.image, alt: ex.name, class: "thumb-frame", style: "width:44px;height:44px;border-radius:10px;object-fit:cover;flex-shrink:0;" }),
          el("div", { style: "flex:1" }, [
            el("div", { class: "list-row__label" }, [ex.name]),
            el("div", { class: "list-row__meta" }, [`${plan.targetSets[id]} 组 × ${plan.targetReps[id]} 次`]),
          ]),
          el("div", { class: "list-row__chevron" }, [el("i", { class: "ph ph-caret-right" })]),
        ])
      );
    });
    scroll.appendChild(el("div", { class: "section" }, [list]));
  }

  function renderLogDetail(logId) {
    const log = LOG_HISTORY.find((l) => l.id === logId);
    if (!log) return;
    const relatedPlan = PLANS.find((p) => p.name === log.planName) || PLANS[0];
    const scroll = $("#log-detail-scroll");
    scroll.innerHTML = "";
    scroll.appendChild(
      el("div", { class: "large-title-block" }, [
        el("div", { class: "navbar__large-title", style: "font-size:26px;" }, [log.planName]),
        el("div", { class: "navbar__subtitle" }, [log.date]),
      ])
    );
    scroll.appendChild(
      el("div", { class: "section" }, [
        el("div", { class: "stat-grid" }, [
          el("div", { class: "card stat-tile" }, [el("div", { class: "stat-tile__value" }, [String(log.duration)]), el("div", { class: "stat-tile__label" }, ["分钟"])]),
          el("div", { class: "card stat-tile" }, [el("div", { class: "stat-tile__value" }, [String(log.volume)]), el("div", { class: "stat-tile__label" }, ["总容量 kg"])]),
          el("div", { class: "card stat-tile" }, [el("div", { class: "stat-tile__value" }, [String(log.sets)]), el("div", { class: "stat-tile__label" }, ["完成组数"])]),
        ]),
      ])
    );
    const list = el("div", { class: "list" });
    relatedPlan.exerciseIds.forEach((id) => {
      const ex = findExercise(id);
      if (!ex) return;
      list.appendChild(
        el("div", { class: "list-row" }, [
          el("img", { src: ex.image, alt: ex.name, class: "thumb-frame", style: "width:40px;height:40px;border-radius:9px;object-fit:cover;flex-shrink:0;" }),
          el("div", { style: "flex:1" }, [
            el("div", { class: "list-row__label" }, [ex.name]),
            el("div", { class: "list-row__meta" }, [`${relatedPlan.targetSets[id]} 组 完成`]),
          ]),
          el("i", { class: "ph-fill ph-check-circle", style: "color:var(--success); font-size:18px;" }),
        ])
      );
    });
    scroll.appendChild(el("div", { class: "section" }, [el("div", { class: "section__head" }, [el("div", { class: "section__title" }, ["动作明细"])]), list]));
  }

  function renderStats() {
    const max = Math.max(...WEEKLY_VOLUME.map((d) => d.value), 1);
    const chart = $("#stats-bar-chart");
    chart.innerHTML = "";
    const chartBarEls = [];
    WEEKLY_VOLUME.forEach((d) => {
      const bar = el("div", { class: `bar-chart__bar ${d.value > 0 ? "has-value" : ""}`, style: "height:4px" });
      chartBarEls.push({ bar, target: Math.max(4, (d.value / max) * 100) });
      chart.appendChild(
        el("div", { class: "bar-chart__col" }, [
          el("div", { class: "bar-chart__value" }, [d.value > 0 ? String(d.value) : ""]),
          bar,
          el("div", { class: "bar-chart__label" }, [d.label]),
        ])
      );
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        chartBarEls.forEach(({ bar, target }) => { bar.style.height = `${target}%`; });
      });
    });

    const heatmap = $("#stats-heatmap");
    heatmap.innerHTML = "";
    STREAK_CALENDAR.forEach((level) => {
      heatmap.appendChild(el("div", { class: "heatmap__cell", "data-level": String(level) }));
    });

    const prList = $("#stats-pr-list");
    prList.innerHTML = "";
    PERSONAL_RECORDS.forEach((pr) => {
      prList.appendChild(
        el("div", { class: "pr-row" }, [
          el("div", {}, [
            el("div", { class: "pr-row__name" }, [pr.name]),
            el("div", { class: "pr-row__date" }, [pr.date]),
          ]),
          el("div", { class: "pr-row__value" }, [pr.value]),
        ])
      );
    });
  }

  /* ------------------------------------------------------------------ */
  /* Active workout                                                     */
  /* ------------------------------------------------------------------ */

  function startWorkout(planId) {
    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) return;
    state.workout.planId = planId;
    state.workout.exerciseIndex = 0;
    state.workout.elapsedSeconds = 0;
    state.workout.sets = {};
    plan.exerciseIds.forEach((id) => {
      const count = plan.targetSets[id];
      const reps = parseInt(plan.targetReps[id], 10) || 10;
      state.workout.sets[id] = Array.from({ length: count }, () => ({ weight: 20, reps, done: false }));
    });

    $("#workout-summary-view").classList.add("hidden");
    $("#workout-active-view").classList.remove("hidden");
    $("#modal-workout").classList.add("is-open");

    renderWorkoutDots();
    renderWorkoutExercise();
    startWorkoutTimer();
  }

  function startWorkoutTimer() {
    clearInterval(state.workout.timerHandle);
    state.workout.timerHandle = setInterval(() => {
      state.workout.elapsedSeconds += 1;
      const m = String(Math.floor(state.workout.elapsedSeconds / 60)).padStart(2, "0");
      const s = String(state.workout.elapsedSeconds % 60).padStart(2, "0");
      $("#workout-timer").textContent = `${m}:${s}`;
    }, 1000);
  }

  function stopWorkoutTimer() {
    clearInterval(state.workout.timerHandle);
  }

  function closeWorkout() {
    stopWorkoutTimer();
    clearInterval(state.workout.restHandle);
    $("#rest-timer").classList.remove("is-visible");
    $("#modal-workout").classList.remove("is-open");
  }

  function currentPlan() {
    return PLANS.find((p) => p.id === state.workout.planId);
  }

  function renderWorkoutDots() {
    const plan = currentPlan();
    const dots = $("#workout-dots");
    dots.innerHTML = "";
    plan.exerciseIds.forEach((id, i) => {
      const sets = state.workout.sets[id];
      const allDone = sets.every((s) => s.done);
      const cls = i === state.workout.exerciseIndex ? "is-current" : allDone ? "is-done" : "";
      dots.appendChild(el("button", { class: `exercise-dots__dot ${cls} u-reset-btn`, "data-action": "goto-exercise", "data-index": String(i) }));
    });
  }

  function renderWorkoutExercise() {
    const plan = currentPlan();
    const exId = plan.exerciseIds[state.workout.exerciseIndex];
    const ex = findExercise(exId);
    const header = $("#workout-exercise-header");
    header.innerHTML = "";
    header.appendChild(el("img", { src: ex.image, alt: ex.name }));
    header.appendChild(
      el("div", {}, [
        el("div", { class: "workout-exercise-header__name" }, [ex.name]),
        el("div", { class: "workout-exercise-header__meta" }, [`${plan.targetSets[exId]} 组 · 目标 ${plan.targetReps[exId]} 次 · ${equipmentLabel(ex.equipment)}`]),
      ])
    );

    const setList = $("#workout-set-list");
    setList.innerHTML = "";
    state.workout.sets[exId].forEach((set, i) => {
      setList.appendChild(
        el("div", { class: `set-row ${set.done ? "is-complete" : ""}`, "data-set-index": String(i) }, [
          el("div", { class: "set-row__index" }, [`第 ${i + 1} 组`]),
          buildStepper(exId, i, "weight", set.weight, "kg"),
          buildStepper(exId, i, "reps", set.reps, "次"),
          el("button", { class: "set-row__check", "data-action": "toggle-set", "data-exercise-id": exId, "data-set-index": String(i) }, [
            el("i", { class: "ph-bold ph-check" }),
          ]),
        ])
      );
    });

    $all("#modal-workout [data-action='prev-exercise']").forEach((b) => (b.disabled = state.workout.exerciseIndex === 0));
    $all("#modal-workout [data-action='next-exercise']").forEach((b) => (b.disabled = state.workout.exerciseIndex === plan.exerciseIds.length - 1));

    renderWorkoutDots();
  }

  function buildStepper(exId, setIndex, field, value, unit) {
    return el("div", { class: "stepper" }, [
      el("button", { class: "stepper__btn", "data-action": "stepper", "data-exercise-id": exId, "data-set-index": String(setIndex), "data-field": field, "data-delta": "-1" }, [
        el("i", { class: "ph-bold ph-minus" }),
      ]),
      el("div", { class: "stepper__value" }, [`${value}${unit}`]),
      el("button", { class: "stepper__btn", "data-action": "stepper", "data-exercise-id": exId, "data-set-index": String(setIndex), "data-field": field, "data-delta": "1" }, [
        el("i", { class: "ph-bold ph-plus" }),
      ]),
    ]);
  }

  function adjustStepper(exId, setIndex, field, delta) {
    const set = state.workout.sets[exId][setIndex];
    const step = field === "weight" ? 2.5 : 1;
    set[field] = Math.max(0, set[field] + step * delta);
    renderWorkoutExercise();
  }

  function toggleSet(exId, setIndex) {
    const plan = currentPlan();
    const set = state.workout.sets[exId][setIndex];
    set.done = !set.done;
    renderWorkoutExercise();

    if (set.done) {
      const isLastSetOfLastExercise =
        state.workout.exerciseIndex === plan.exerciseIds.length - 1 && setIndex === state.workout.sets[exId].length - 1;
      if (!isLastSetOfLastExercise) startRestTimer();
    }
  }

  function startRestTimer() {
    clearInterval(state.workout.restHandle);
    let remaining = 60;
    const ring = $("#rest-ring");
    const valueEl = $("#rest-ring-value");
    ring.style.setProperty("--p", "100");
    valueEl.textContent = String(remaining);
    $("#rest-timer").classList.add("is-visible");
    state.workout.restHandle = setInterval(() => {
      remaining -= 1;
      valueEl.textContent = String(Math.max(remaining, 0));
      ring.style.setProperty("--p", String(Math.max((remaining / 60) * 100, 0)));
      if (remaining <= 0) {
        clearInterval(state.workout.restHandle);
        $("#rest-timer").classList.remove("is-visible");
      }
    }, 1000);
  }

  function skipRest() {
    clearInterval(state.workout.restHandle);
    $("#rest-timer").classList.remove("is-visible");
  }

  function gotoExercise(index) {
    const plan = currentPlan();
    state.workout.exerciseIndex = Math.max(0, Math.min(plan.exerciseIds.length - 1, index));
    renderWorkoutExercise();
  }

  function finishWorkout() {
    stopWorkoutTimer();
    clearInterval(state.workout.restHandle);
    $("#rest-timer").classList.remove("is-visible");

    const plan = currentPlan();
    let volume = 0;
    let doneSets = 0;
    plan.exerciseIds.forEach((id) => {
      state.workout.sets[id].forEach((set) => {
        if (set.done) {
          volume += set.weight * set.reps;
          doneSets += 1;
        }
      });
    });
    const minutes = Math.max(1, Math.round(state.workout.elapsedSeconds / 60));

    $("#summary-plan-name").textContent = plan.name;
    $("#summary-duration").textContent = String(minutes);
    $("#summary-volume").textContent = String(Math.round(volume));
    $("#summary-sets").textContent = String(doneSets);

    $("#workout-active-view").classList.add("hidden");
    $("#workout-summary-view").classList.remove("hidden");
  }

  function closeWorkoutSummary() {
    $("#modal-workout").classList.remove("is-open");
    showToast("训练已保存到训练记录");
    state.training.segment = "log";
    setSegment("log");
    renderLogList();
  }

  /* ------------------------------------------------------------------ */
  /* Community                                                          */
  /* ------------------------------------------------------------------ */

  function avatarStyle(hue) {
    return `background: linear-gradient(135deg, hsl(${hue} 68% 52%), hsl(${hue + 24} 62% 40%));`;
  }

  function renderCommunityFeed() {
    const feed = $("#community-feed");
    feed.innerHTML = "";
    COMMUNITY_POSTS.forEach((post) => {
      feed.appendChild(buildPostCard(post, false));
    });
  }

  function buildPostCard(post, isDetail) {
    const card = el("div", { class: `card post-card ${isDetail ? "" : "is-tappable"}`, "data-post-id": post.id });
    const head = el("div", { class: "post-head" }, [
      el("div", { class: "avatar", style: avatarStyle(post.avatarHue) }, [post.name.charAt(0)]),
      el("div", {}, [
        el("div", { class: "post-head__name" }, [post.name]),
        el("div", { class: "post-head__time" }, [`${post.time} · ${post.tag}`]),
      ]),
    ]);
    card.appendChild(head);
    card.appendChild(el("div", { class: "post-card__text" }, [post.text]));
    const actions = el("div", { class: "post-actions" }, [
      el("button", { class: `post-action ${post.liked ? "is-liked" : ""} u-reset-btn`, style: "width:auto", "data-action": "like-post", "data-post-id": post.id }, [
        el("i", { class: post.liked ? "ph-fill ph-heart" : "ph ph-heart" }),
        String(post.likes),
      ]),
      el(
        "button",
        {
          class: "post-action u-reset-btn",
          style: "width:auto",
          "data-action": isDetail ? "focus-comment" : "open-post",
          "data-post-id": post.id,
        },
        [el("i", { class: "ph ph-chat-circle" }), String(post.comments.length)]
      ),
      el("button", { class: "post-action u-reset-btn", style: "width:auto", "data-action": "toast", "data-message": "分享功能即将上线" }, [
        el("i", { class: "ph ph-share-network" }),
      ]),
    ]);
    card.appendChild(actions);

    if (!isDetail) {
      card.style.cursor = "pointer";
      card.addEventListener("click", (e) => {
        if (e.target.closest("[data-action]")) return;
        openPost(post.id);
      });
    }
    return card;
  }

  function likePost(id) {
    const post = COMMUNITY_POSTS.find((p) => p.id === id);
    if (!post) return;
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    if (state.community.currentPostId === id) renderPostDetail(id);
    renderCommunityFeed();
  }

  function openPost(id) {
    state.community.currentPostId = id;
    renderPostDetail(id);
    pushScreen("community", "post-detail");
  }

  function renderPostDetail(id) {
    const post = COMMUNITY_POSTS.find((p) => p.id === id);
    if (!post) return;
    const scroll = $("#post-detail-scroll");
    scroll.innerHTML = "";
    scroll.appendChild(el("div", { class: "section" }, [buildPostCard(post, true)]));
    const commentsBlock = el("div", { class: "section" }, [el("div", { class: "section__head" }, [el("div", { class: "section__title" }, ["评论"])])]);
    const list = el("div", {});
    post.comments.forEach((c) => {
      list.appendChild(
        el("div", { class: "comment-row" }, [
          el("div", { class: "avatar", style: "width:30px;height:30px;font-size:12px;background:var(--bg-surface-2);color:var(--text-secondary);" }, [c.name.charAt(0)]),
          el("div", {}, [el("div", { class: "comment-row__name" }, [c.name]), el("div", { class: "comment-row__text" }, [c.text])]),
        ])
      );
    });
    if (post.comments.length === 0) {
      list.appendChild(el("div", { style: "color:var(--text-tertiary); font-size:13.5px; padding:8px 0;" }, ["还没有评论，来说第一句吧"]));
    }
    commentsBlock.appendChild(list);
    scroll.appendChild(commentsBlock);
  }

  function sendComment() {
    const input = $("#post-comment-input");
    const text = input.value.trim();
    if (!text) return;
    const post = COMMUNITY_POSTS.find((p) => p.id === state.community.currentPostId);
    if (!post) return;
    post.comments.push({ name: "Alex", text });
    input.value = "";
    renderPostDetail(post.id);
  }

  /* ------------------------------------------------------------------ */
  /* Profile                                                            */
  /* ------------------------------------------------------------------ */

  function renderProfileMenu() {
    const menu = $("#profile-menu");
    menu.innerHTML = "";
    MENU_ITEMS.forEach((item) => {
      menu.appendChild(
        el("button", { class: "list-row u-reset-btn", "data-action": "menu-item", "data-target": item.target }, [
          el("div", { class: "list-row__icon" }, [el("i", { class: `ph ph-${item.icon}` })]),
          el("div", { class: "list-row__label" }, [item.label]),
          el("div", { class: "list-row__chevron" }, [el("i", { class: "ph ph-caret-right" })]),
        ])
      );
    });
  }

  function handleMenuTarget(target) {
    if (target === "training:plan") {
      switchTabAndSelect("training");
      setSegment("plan");
    } else if (target === "training:log") {
      switchTabAndSelect("training");
      setSegment("log");
    } else if (target === "library") {
      switchTabAndSelect("library");
    } else if (target === "coach") {
      openCoach();
    } else if (target.startsWith("toast:")) {
      showToast(target.slice(6));
    }
  }

  function switchTabAndSelect(name) {
    switchTab(name);
  }

  /* ------------------------------------------------------------------ */
  /* AI Coach                                                           */
  /* ------------------------------------------------------------------ */

  function openCoach() {
    renderChat();
    $("#modal-coach").classList.add("is-open");
  }

  function closeCoach() {
    $("#modal-coach").classList.remove("is-open");
  }

  function renderChat() {
    const scroll = $("#chat-messages");
    scroll.innerHTML = "";
    state.coach.messages.forEach((m) => scroll.appendChild(buildChatBubble(m)));
    const replies = $("#chat-quick-replies");
    replies.innerHTML = "";
    COACH_QUICK_REPLIES.forEach((q) => {
      replies.appendChild(el("button", { class: "quick-reply", "data-action": "quick-reply", "data-text": q }, [q]));
    });
    scrollChatToBottom();
  }

  function buildChatBubble(m, isTyping) {
    const row = el("div", { class: `chat-bubble-row ${m.from === "user" ? "from-user" : ""}` }, [
      el("div", { class: "chat-avatar" }, [el("i", { class: m.from === "user" ? "ph-fill ph-user" : "ph-fill ph-sparkle" })]),
      el("div", { class: "chat-bubble" }, isTyping ? [buildTypingDots()] : [m.text]),
    ]);
    return row;
  }

  function buildTypingDots() {
    return el("div", { class: "typing-dots" }, [el("span"), el("span"), el("span")]);
  }

  function scrollChatToBottom() {
    const container = $("#chat-scroll");
    requestAnimationFrame(() => (container.scrollTop = container.scrollHeight));
  }

  function sendChatMessage(text) {
    const clean = text.trim();
    if (!clean) return;
    state.coach.messages.push({ from: "user", text: clean });
    renderChat();

    const typingRow = buildChatBubble({ from: "assistant" }, true);
    $("#chat-messages").appendChild(typingRow);
    scrollChatToBottom();

    setTimeout(() => {
      typingRow.remove();
      const reply = COACH_RESPONSES[clean] || COACH_RESPONSES.default;
      state.coach.messages.push({ from: "assistant", text: reply });
      renderChat();
    }, 950);
  }

  /* ------------------------------------------------------------------ */
  /* Event delegation                                                   */
  /* ------------------------------------------------------------------ */

  function onAction(action, target, e) {
    switch (action) {
      case "open-plan": {
        renderPlanDetail(target.dataset.planId);
        if (state.currentTab !== "training") switchTabAndSelect("training");
        pushScreen("training", "plan-detail");
        break;
      }
      case "open-log": {
        renderLogDetail(target.dataset.logId);
        pushScreen("training", "log-detail");
        break;
      }
      case "back": {
        popScreen(target.dataset.stack);
        break;
      }
      case "segment": {
        setSegment(target.dataset.segmentValue);
        break;
      }
      case "chip": {
        state.library.bodyPart = target.dataset.chipValue;
        $all("#library-chips .chip").forEach((c) => c.classList.toggle("is-active", c === target));
        renderLibraryGrid();
        break;
      }
      case "open-exercise": {
        openExerciseDetail(target.dataset.exerciseId);
        break;
      }
      case "add-to-plan": {
        closeAllOverlays();
        showToast("已加入今日训练计划");
        break;
      }
      case "open-filter": {
        openFilterSheet();
        break;
      }
      case "toggle-equipment-draft": {
        const eq = target.dataset.equipment;
        if (state.library.equipmentDraft.has(eq)) state.library.equipmentDraft.delete(eq);
        else state.library.equipmentDraft.add(eq);
        target.classList.toggle("is-active");
        break;
      }
      case "apply-filter": {
        state.library.equipment = new Set(state.library.equipmentDraft);
        updateFilterDot();
        renderLibraryGrid();
        closeAllOverlays();
        break;
      }
      case "clear-filter": {
        state.library.equipment = new Set();
        state.library.equipmentDraft = new Set();
        updateFilterDot();
        renderLibraryGrid();
        closeAllOverlays();
        break;
      }
      case "close-sheet":
      case "close-overlays": {
        closeAllOverlays();
        break;
      }
      case "start-workout": {
        closeAllOverlays();
        startWorkout(target.dataset.planId);
        break;
      }
      case "close-workout": {
        closeWorkout();
        break;
      }
      case "close-workout-summary": {
        closeWorkoutSummary();
        break;
      }
      case "toggle-set": {
        toggleSet(target.dataset.exerciseId, parseInt(target.dataset.setIndex, 10));
        break;
      }
      case "stepper": {
        adjustStepper(target.dataset.exerciseId, parseInt(target.dataset.setIndex, 10), target.dataset.field, parseInt(target.dataset.delta, 10));
        break;
      }
      case "prev-exercise": {
        gotoExercise(state.workout.exerciseIndex - 1);
        break;
      }
      case "next-exercise": {
        gotoExercise(state.workout.exerciseIndex + 1);
        break;
      }
      case "goto-exercise": {
        gotoExercise(parseInt(target.dataset.index, 10));
        break;
      }
      case "finish-workout": {
        finishWorkout();
        break;
      }
      case "skip-rest": {
        skipRest();
        break;
      }
      case "like-post": {
        likePost(target.dataset.postId);
        break;
      }
      case "open-post": {
        openPost(target.dataset.postId);
        break;
      }
      case "focus-comment": {
        $("#post-comment-input").focus();
        break;
      }
      case "send-comment": {
        sendComment();
        break;
      }
      case "publish-post": {
        showToast("发布功能即将上线");
        break;
      }
      case "new-plan": {
        showToast("新建计划功能即将上线");
        break;
      }
      case "menu-item": {
        handleMenuTarget(target.dataset.target);
        break;
      }
      case "open-coach": {
        openCoach();
        break;
      }
      case "close-coach": {
        closeCoach();
        break;
      }
      case "quick-reply": {
        sendChatMessage(target.dataset.text);
        break;
      }
      case "send-chat": {
        const input = $("#chat-input");
        sendChatMessage(input.value);
        input.value = "";
        break;
      }
      case "goto-stats": {
        switchTabAndSelect("training");
        setSegment("stats");
        break;
      }
      case "toast": {
        showToast(target.dataset.message);
        break;
      }
      default:
        break;
    }
  }

  function initDelegation() {
    document.getElementById("app-root").addEventListener("click", (e) => {
      const target = e.target.closest("[data-action]");
      if (!target) return;
      onAction(target.dataset.action, target, e);
    });

    document.getElementById("splash").addEventListener("click", hideSplash);

    $("#library-search").addEventListener("input", (e) => {
      state.library.search = e.target.value;
      renderLibraryGrid();
    });

    $all(".tab-item").forEach((btn) => {
      btn.addEventListener("click", () => switchTabAndSelect(btn.dataset.tabTarget));
    });

    ["#chat-input", "#post-comment-input"].forEach((sel) => {
      const input = $(sel);
      input.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;
        if (sel === "#chat-input") {
          sendChatMessage(input.value);
          input.value = "";
        } else {
          sendComment();
        }
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */

  function updateClock() {
    const now = new Date();
    $("#status-time").textContent = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: false });
  }

  function init() {
    initTabIconNames();
    initDelegation();
    initCollapseObservers();
    initSwipeBack();
    updateClock();
    setInterval(updateClock, 30000);

    renderHome();
    renderLibraryChips();
    renderLibraryGrid();
    renderLogList();
    renderPlanList();
    renderStats();
    renderCommunityFeed();
    renderProfileMenu();

    requestAnimationFrame(() => {
      const activeSeg = $("#training-segmented .segmented__item.is-active");
      if (activeSeg) positionSegmentIndicator(activeSeg);
    });

    setTimeout(hideSplash, 1500);
  }

  document.addEventListener("DOMContentLoaded", init);
})();

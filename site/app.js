"use strict";

// ======================
// Authentication
// ======================
var AUTH_KEY = "coursera-meta-fe-auth";

async function hashPassword(password) {
  var encoder = new TextEncoder();
  var data = encoder.encode(password);
  var hashBuffer = await crypto.subtle.digest("SHA-256", data);
  var hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
}

function getStoredHash() {
  return localStorage.getItem(AUTH_KEY);
}

function isPasswordSet() {
  return !!getStoredHash();
}

function isSessionUnlocked() {
  return sessionStorage.getItem("coursera-unlocked") === "1";
}

function setSessionUnlocked(val) {
  if (val) {
    sessionStorage.setItem("coursera-unlocked", "1");
  } else {
    sessionStorage.removeItem("coursera-unlocked");
  }
}

function showLockScreen() {
  document.getElementById("lock-screen").style.display = "flex";
  document.getElementById("app").style.display = "none";
  document.getElementById("lock-error").textContent = "";

  if (isPasswordSet()) {
    document.getElementById("lock-form-login").style.display = "flex";
    document.getElementById("lock-form-setup").style.display = "none";
    document.getElementById("lock-subtitle").textContent = "パスワードを入力してください";
    document.getElementById("lock-password").value = "";
    document.getElementById("lock-password").focus();
  } else {
    document.getElementById("lock-form-login").style.display = "none";
    document.getElementById("lock-form-setup").style.display = "flex";
    document.getElementById("lock-subtitle").textContent = "はじめに";
    document.getElementById("setup-password").value = "";
    document.getElementById("setup-password-confirm").value = "";
    document.getElementById("setup-password").focus();
  }
}

function showApp() {
  document.getElementById("lock-screen").style.display = "none";
  document.getElementById("app").style.display = "block";
}

function initAuth() {
  // Login form
  document.getElementById("lock-submit").addEventListener("click", async function () {
    var pw = document.getElementById("lock-password").value;
    if (!pw) {
      document.getElementById("lock-error").textContent = "パスワードを入力してください";
      return;
    }
    var hash = await hashPassword(pw);
    if (hash === getStoredHash()) {
      setSessionUnlocked(true);
      showApp();
      init();
    } else {
      document.getElementById("lock-error").textContent = "パスワードが正しくありません";
      document.getElementById("lock-password").value = "";
      document.getElementById("lock-password").focus();
    }
  });

  document.getElementById("lock-password").addEventListener("keydown", function (e) {
    if (e.key === "Enter") document.getElementById("lock-submit").click();
  });

  // Setup form
  document.getElementById("setup-submit").addEventListener("click", async function () {
    var pw1 = document.getElementById("setup-password").value;
    var pw2 = document.getElementById("setup-password-confirm").value;
    var errorEl = document.getElementById("lock-error");

    if (pw1.length < 4) {
      errorEl.textContent = "パスワードは4文字以上にしてください";
      return;
    }
    if (pw1 !== pw2) {
      errorEl.textContent = "パスワードが一致しません";
      return;
    }
    var hash = await hashPassword(pw1);
    localStorage.setItem(AUTH_KEY, hash);
    setSessionUnlocked(true);
    showApp();
    init();
  });

  document.getElementById("setup-password-confirm").addEventListener("keydown", function (e) {
    if (e.key === "Enter") document.getElementById("setup-submit").click();
  });

  // Lock button
  document.getElementById("lock-btn").addEventListener("click", function () {
    setSessionUnlocked(false);
    showLockScreen();
  });

  // Check session
  if (isPasswordSet() && isSessionUnlocked()) {
    showApp();
    init();
  } else {
    showLockScreen();
  }
}

// ======================
// Meta フロントエンド開発プロフェッショナル認定 コースデータ
const COURSES = [
  {
    id: 1,
    title: "Introduction to Front-End Development",
    titleJa: "フロントエンド開発入門",
    weeks: [
      { title: "Get started with web development", hours: 4 },
      { title: "Introduction to HTML and CSS", hours: 3 },
      { title: "UI Frameworks", hours: 5 },
      { title: "End-of-Course Graded Assessment", hours: 3 },
    ],
  },
  {
    id: 2,
    title: "Programming with JavaScript",
    titleJa: "JavaScriptプログラミング",
    weeks: [
      { title: "Introduction to JavaScript", hours: 4 },
      { title: "The Building Blocks of a Program", hours: 3 },
      { title: "Programming Paradigms", hours: 4 },
      { title: "Testing & Compatibility", hours: 4 },
      { title: "End-of-Course Graded Assessment", hours: 3 },
    ],
  },
  {
    id: 3,
    title: "Version Control",
    titleJa: "バージョン管理",
    weeks: [
      { title: "Software collaboration", hours: 5 },
      { title: "Command Line", hours: 3 },
      { title: "Working with Git", hours: 5 },
      { title: "End-of-Course Graded Assessment", hours: 3 },
    ],
  },
  {
    id: 4,
    title: "HTML and CSS in Depth",
    titleJa: "HTML・CSS 応用",
    weeks: [
      { title: "HTML in depth", hours: 5 },
      { title: "Interactive CSS", hours: 5 },
      { title: "Graded Assessment", hours: 3 },
    ],
  },
  {
    id: 5,
    title: "React Basics",
    titleJa: "React 基礎",
    weeks: [
      { title: "React Components", hours: 5 },
      { title: "Data and State", hours: 4 },
      { title: "Navigation, Updating and Assets in React", hours: 5 },
      { title: "Your first React app", hours: 3 },
    ],
  },
  {
    id: 6,
    title: "Advanced React",
    titleJa: "React 応用",
    weeks: [
      { title: "Components", hours: 4 },
      { title: "React Hooks and Custom Hooks", hours: 4 },
      { title: "JSX and Testing", hours: 4 },
      { title: "Final Project", hours: 3 },
    ],
  },
  {
    id: 7,
    title: "Principles of UX/UI Design",
    titleJa: "UX/UIデザインの原則",
    weeks: [
      { title: "Introduction to UX and UI design", hours: 4 },
      { title: "Evaluating interactive design", hours: 4 },
      { title: "Applied Design Fundamentals", hours: 5 },
      { title: "Designing your UI", hours: 5 },
    ],
  },
  {
    id: 8,
    title: "Front-End Developer Capstone",
    titleJa: "フロントエンド開発キャップストーン",
    weeks: [
      { title: "Starting the project", hours: 3 },
      { title: "Project foundations", hours: 5 },
      { title: "Project functionality", hours: 5 },
      { title: "Project Assessment", hours: 4 },
    ],
  },
  {
    id: 9,
    title: "Coding Interview Preparation",
    titleJa: "コーディング面接対策",
    weeks: [
      { title: "Introduction to the coding interview", hours: 5 },
      { title: "Introduction to Data Structures", hours: 4 },
      { title: "Introduction to Algorithms", hours: 3 },
      { title: "Final project", hours: 4 },
    ],
  },
];

const STORAGE_KEY = "coursera-meta-fe-schedule";

// State
let state = loadState();

function getDefaultState() {
  return {
    startDate: "",
    hoursPerWeek: 7,
    progress: {},
    notes: {},
  };
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // ignore parse errors
  }
  return getDefaultState();
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // ignore storage errors
  }
}

function isWeekCompleted(courseId, weekIndex) {
  const key = courseId + "-" + weekIndex;
  return !!state.progress[key];
}

function setWeekCompleted(courseId, weekIndex, completed) {
  const key = courseId + "-" + weekIndex;
  state.progress[key] = completed;
  saveState();
}

function getCourseProgress(course) {
  let completed = 0;
  for (let i = 0; i < course.weeks.length; i++) {
    if (isWeekCompleted(course.id, i)) {
      completed++;
    }
  }
  return completed;
}

function getCourseStatus(course) {
  const completed = getCourseProgress(course);
  if (completed === 0) return "not-started";
  if (completed === course.weeks.length) return "completed";
  return "in-progress";
}

function getStatusLabel(status) {
  switch (status) {
    case "completed":
      return "完了";
    case "in-progress":
      return "学習中";
    default:
      return "未着手";
  }
}

function getCourseTotalHours(course) {
  return course.weeks.reduce(function (sum, w) {
    return sum + w.hours;
  }, 0);
}

function getTotalHours() {
  return COURSES.reduce(function (sum, c) {
    return sum + getCourseTotalHours(c);
  }, 0);
}

function calculateScheduleDates(startDate, hoursPerWeek) {
  if (!startDate || !hoursPerWeek) return null;

  var dates = [];
  var currentDate = new Date(startDate);

  COURSES.forEach(function (course) {
    var courseStart = new Date(currentDate);
    course.weeks.forEach(function (week) {
      var weeksNeeded = Math.ceil(week.hours / hoursPerWeek);
      var weekStart = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + weeksNeeded * 7);
      dates.push({
        courseId: course.id,
        weekStart: weekStart,
        weekEnd: new Date(currentDate),
      });
    });
    dates.push({ courseId: course.id, courseStart: courseStart, courseEnd: new Date(currentDate) });
  });

  return {
    dates: dates,
    endDate: new Date(currentDate),
  };
}

function formatDate(date) {
  var y = date.getFullYear();
  var m = String(date.getMonth() + 1).padStart(2, "0");
  var d = String(date.getDate()).padStart(2, "0");
  return y + "/" + m + "/" + d;
}

// Rendering
function updateOverallProgress() {
  var totalWeeks = 0;
  var completedWeeks = 0;
  var completedCourses = 0;
  var inProgressCourses = 0;

  COURSES.forEach(function (course) {
    totalWeeks += course.weeks.length;
    var progress = getCourseProgress(course);
    completedWeeks += progress;
    var status = getCourseStatus(course);
    if (status === "completed") completedCourses++;
    if (status === "in-progress") inProgressCourses++;
  });

  var percent = totalWeeks > 0 ? Math.round((completedWeeks / totalWeeks) * 100) : 0;
  var remaining = COURSES.length - completedCourses - inProgressCourses;

  document.getElementById("overall-progress-bar").style.width = Math.max(percent, 3) + "%";
  document.getElementById("overall-progress-text").textContent = percent + "%";
  document.getElementById("stat-completed").textContent = completedCourses;
  document.getElementById("stat-in-progress").textContent = inProgressCourses;
  document.getElementById("stat-remaining").textContent = remaining;
  document.getElementById("stat-total-weeks").textContent = completedWeeks;
}

function renderCourses() {
  var container = document.getElementById("courses-container");
  container.innerHTML = "";

  var scheduleDates = null;
  if (state.startDate && state.hoursPerWeek) {
    scheduleDates = calculateScheduleDates(state.startDate, state.hoursPerWeek);
  }

  COURSES.forEach(function (course, courseIndex) {
    var status = getCourseStatus(course);
    var completedCount = getCourseProgress(course);
    var totalHours = getCourseTotalHours(course);
    var progressPercent = Math.round((completedCount / course.weeks.length) * 100);

    var card = document.createElement("div");
    card.className = "course-card";

    // Find schedule info for this course
    var courseSchedule = null;
    if (scheduleDates) {
      var courseDates = scheduleDates.dates.filter(function (d) {
        return d.courseId === course.id && d.courseStart;
      });
      if (courseDates.length > 0) {
        courseSchedule = courseDates[0];
      }
    }

    // Header
    var header = document.createElement("div");
    header.className = "course-card__header";
    header.innerHTML =
      '<span class="course-card__number">' + course.id + "</span>" +
      '<div class="course-card__info">' +
        '<div class="course-card__title">' + escapeHtml(course.title) + "</div>" +
        '<div class="course-card__meta">' +
          escapeHtml(course.titleJa) + " | " + course.weeks.length + "週 | 約" + totalHours + "時間" +
        "</div>" +
      "</div>" +
      '<span class="course-card__status course-card__status--' + status + '">' +
        getStatusLabel(status) +
      "</span>" +
      '<span class="course-card__toggle">&#9660;</span>';

    header.addEventListener("click", function () {
      var body = card.querySelector(".course-card__body");
      var toggle = card.querySelector(".course-card__toggle");
      body.classList.toggle("course-card__body--open");
      toggle.classList.toggle("course-card__toggle--open");
    });

    card.appendChild(header);

    // Body
    var body = document.createElement("div");
    body.className = "course-card__body";

    // Schedule info
    if (courseSchedule) {
      var schedDiv = document.createElement("div");
      schedDiv.className = "course-card__schedule";
      schedDiv.textContent =
        "予定期間: " + formatDate(courseSchedule.courseStart) + " ～ " + formatDate(courseSchedule.courseEnd);
      body.appendChild(schedDiv);
    }

    // Course progress bar
    var progressDiv = document.createElement("div");
    progressDiv.className = "course-card__progress";
    progressDiv.innerHTML =
      '<div class="progress-bar-container">' +
        '<div class="progress-bar" style="width:' + Math.max(progressPercent, 0) + '%"></div>' +
      "</div>" +
      '<span class="course-card__progress-label">' +
        completedCount + " / " + course.weeks.length + " 週完了 (" + progressPercent + "%)" +
      "</span>";
    body.appendChild(progressDiv);

    // Week items
    course.weeks.forEach(function (week, weekIndex) {
      var completed = isWeekCompleted(course.id, weekIndex);

      var weekItem = document.createElement("div");
      weekItem.className = "week-item";

      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = completed;
      checkbox.addEventListener("change", function () {
        setWeekCompleted(course.id, weekIndex, this.checked);
        renderCourses();
        updateOverallProgress();
      });

      var infoDiv = document.createElement("div");
      infoDiv.className = "week-item__info";

      var titleSpan = document.createElement("span");
      titleSpan.className = "week-item__title" + (completed ? " week-item__title--completed" : "");
      titleSpan.textContent = "Week " + (weekIndex + 1) + ": " + week.title;

      var detailSpan = document.createElement("span");
      detailSpan.className = "week-item__detail";
      detailSpan.textContent = "約" + week.hours + "時間";

      // Week schedule
      if (scheduleDates) {
        var weekDates = scheduleDates.dates.filter(function (d) {
          return d.courseId === course.id && !d.courseStart;
        });
        if (weekDates[weekIndex]) {
          detailSpan.textContent +=
            " | " + formatDate(weekDates[weekIndex].weekStart) + "～" + formatDate(weekDates[weekIndex].weekEnd);
        }
      }

      infoDiv.appendChild(titleSpan);
      infoDiv.appendChild(detailSpan);

      weekItem.appendChild(checkbox);
      weekItem.appendChild(infoDiv);
      body.appendChild(weekItem);
    });

    // Notes
    var notesDiv = document.createElement("div");
    notesDiv.className = "course-card__notes";
    var notesLabel = document.createElement("label");
    notesLabel.textContent = "メモ";
    var notesTextarea = document.createElement("textarea");
    notesTextarea.placeholder = "このコースのメモを入力...";
    notesTextarea.value = state.notes[course.id] || "";
    notesTextarea.addEventListener("input", function () {
      state.notes[course.id] = this.value;
      saveState();
    });
    notesDiv.appendChild(notesLabel);
    notesDiv.appendChild(notesTextarea);
    body.appendChild(notesDiv);

    card.appendChild(body);
    container.appendChild(card);
  });
}

function updateScheduleEstimate() {
  var el = document.getElementById("schedule-estimate");
  if (!state.startDate || !state.hoursPerWeek) {
    el.textContent = "";
    return;
  }

  var schedule = calculateScheduleDates(state.startDate, state.hoursPerWeek);
  if (schedule) {
    var totalHours = getTotalHours();
    var totalWeeksNeeded = Math.ceil(totalHours / state.hoursPerWeek);
    el.textContent =
      "合計約" + totalHours + "時間 | 週" + state.hoursPerWeek + "時間で約" +
      totalWeeksNeeded + "週間 | 完了予定日: " + formatDate(schedule.endDate);
  }
}

function escapeHtml(text) {
  var div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Initialization
function init() {
  // Restore settings
  var startDateInput = document.getElementById("start-date");
  var hoursInput = document.getElementById("hours-per-week");

  if (state.startDate) {
    startDateInput.value = state.startDate;
  } else {
    // Default to today
    var today = new Date();
    var yyyy = today.getFullYear();
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var dd = String(today.getDate()).padStart(2, "0");
    startDateInput.value = yyyy + "-" + mm + "-" + dd;
    state.startDate = startDateInput.value;
  }

  if (state.hoursPerWeek) {
    hoursInput.value = state.hoursPerWeek;
  }

  // Generate schedule button
  document.getElementById("generate-schedule").addEventListener("click", function () {
    state.startDate = startDateInput.value;
    state.hoursPerWeek = parseInt(hoursInput.value, 10) || 7;
    saveState();
    renderCourses();
    updateScheduleEstimate();
  });

  // Initial render
  renderCourses();
  updateOverallProgress();
  updateScheduleEstimate();
}

document.addEventListener("DOMContentLoaded", initAuth);

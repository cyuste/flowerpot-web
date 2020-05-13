// const URL_BASE = "http://localhost:3000/"; // Perhaps it's better to have the trailing slash when building the methods
const s = (selector) => {
  return document.querySelector(selector);
};

const URL_BASE = "http://esp32.local/";
const daemon = setInterval(updateStatus, 10000);
/**
 * HTML elements
 */
const onEl = s("#on");
const offEl = s("#off");
const irrTEl = s("#irrT");
const minHEl = s("#minH");
const configResultEl = s("#configResult");

let cfg = { irrT: "0", humMin: "100" };

function setOn() {
  onEl.setAttribute("class", "btn btn-success");
  offEl.setAttribute("class", "btn btn-secondary");
}

function setOff() {
  onEl.setAttribute("class", "btn btn-secondary");
  offEl.setAttribute("class", "btn btn-danger");
}

function updateOnOff(i) {
  switch (i) {
    case "on":
      setOn();
      break;
    case "off":
      setOff();
      break;
  }
}

async function updateStatus() {
  await fetch(`${URL_BASE}status`)
    .then(async (response) => {
      cfg = await response.json();
      s("#hValue").innerText = cfg.h;
      updateOnOff(cfg.status);
    })
    .catch((err) => {
      console.error(err);
      configResultEl.innerText = e;
      configResultEl.classList.add("alert-danger");
      configResultEl.style.display = "block";
    });
}

function refreshParams() {
  s("#irrT").innerText = cfg.irrT / 1000;
  s("#minH").innerText = cfg.humMin;
}

onEl.addEventListener("click", () => {
  fetch(`${URL_BASE}on`, { method: "POST" }).then(() => setOn());
});

offEl.addEventListener("click", () => {
  fetch(`${URL_BASE}off`, { method: "POST" }).then(() => setOff());
});

s("#config-form").addEventListener("submit", function (event) {
  event.preventDefault();
  const irrT = irrTEl.value * 1000;
  const minH = minHEl.value;
  const requestBody = { irrT: irrT, minH: minH };

  fetch(`${URL_BASE}config`, {
    method: "POST",
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      refreshParams();
      configResultEl.innerText = "Success!";
      configResultEl.setAttribute("class", "alert-success");
      configResultEl.style.display = "block";
      setTimeout(() => configResultEl.removeAttribute("style"), 3000);
    })
    .catch((err) => {
      console.error(err);
    });
});

document.addEventListener("DOMContentLoaded", async () => {
  await updateStatus();
  refreshParams();
});

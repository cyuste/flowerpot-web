// const URL_BASE = "http://localhost:3000/"; // Perhaps it's better to have the trailing slash when building the methods
const s = (selector) => {
  return document.querySelector(selector);
};

const URL_BASE = "http://esp32.local/";
const daemon = setInterval(updateStatus, 10000);

let cfg = { irrT: "0", humMin: "100" };

function setOn() {
  s("#on").setAttribute("class", "btn btn-success");
  s("#off").setAttribute("class", "btn btn-secondary");
}

function setOff() {
  s("#on").setAttribute("class", "btn btn-secondary");
  s("#off").setAttribute("class", "btn btn-danger");
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
      s("#configResult").innerText = e;
      s("#configResult").classList.add("alert-danger");
      s("#configResult").style.display = "block";
    });
}

function refreshParams() {
  s("#irrT").innerText = cfg.irrT / 1000;
  s("#minH").innerText = cfg.humMin;
}

s("#on").addEventListener("click", () => {
  fetch(`${URL_BASE}on`, { method: "POST" }).then(() => setOn());
});

s("#off").addEventListener("click", () => {
  fetch(`${URL_BASE}off`, { method: "POST" }).then(() => setOff());
});

s("#config-form").addEventListener("submit", function (event) {
  event.preventDefault();
  const irrT = s("#irrT").value * 1000;
  const minH = s("#minH").value;
  const requestBody = { irrT: irrT, minH: minH };

  fetch(`${URL_BASE}config`, {
    method: "POST",
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      refreshParams();
      s("#configResult").innerText = "Success!";
      s("#configResult").setAttribute("class", "alert-success");
      s("#configResult").style.display = "block";
      setTimeout(() => s("#configResult").removeAttribute("style"), 3000);
    })
    .catch((err) => {
      console.error(err);
    });
});

document.addEventListener("DOMContentLoaded", async () => {
  await updateStatus();
  refreshParams();
});

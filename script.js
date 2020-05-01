//var url_base = "http://localhost:3000/";

var url_base = "http://esp32.local/";

var daemon = setInterval( updateStatus, 10000);

var cfg = { irrT: "0", humMin: "100"};

function setOn() {
  $("#on").removeClass().addClass("btn btn-success");
  $("#off").removeClass().addClass("btn btn-secondary");
}

function setOff() {
  $("#on").removeClass().addClass("btn btn-secondary");
  $("#off").removeClass().addClass("btn btn-danger");
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
  try {
    cfg = await $.get( url_base + "status", null);
    $("#hValue").text(cfg.h);
    updateOnOff(cfg.status);
  } catch (e) {
    $("#configResult").text(e);
    $("#configResult").addClass("alert-danger");
    $("#configResult").show();
  }
}

function refreshParams() {
  $("#irrT").val(cfg.irrT/1000);
  $("#minH").val(cfg.humMin);
}

$("#on").on("click", function () {
  $.post( url_base + "on", {}, setOn);
});

$("#off").on("click", function () {
  $.post( url_base + "off", {}, setOff);
});

$("#config").submit(function(event) {
  event.preventDefault();
  var irrT = $("#irrT").val() * 1000;
  var minH = $("#minH").val();
  var body = { irrT: irrT, minH: minH }
  $.post( url_base + "config", body, function () {
    refreshParams();
    $("#configResult").text("Success!");
    $("#configResult").removeClass("alert-danger").addClass("alert-success");
    $("#configResult").show();
    setTimeout(() => $("#configResult").hide(), 3000);
  });
});

$(document).ready(async () => {
  await updateStatus();
  refreshParams();
});

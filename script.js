//var url_base = "http://esp32.local:3000/";

var url_base = "http://localhost:3000/";

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
  var res = await $.get( url_base + "status", null).promise();
  cfg = JSON.parse(res);
  $("#hValue").text(cfg.h);
  updateOnOff(cfg.status);
}

function refreshParams() {
  $("#irrT").val(cfg.irrT);
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
  var irrT = $("#irrT").val();
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

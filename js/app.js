
var imgBG, imgChromeLogo, imgGDLLogo, imgNamePlaccard, imgTitleCardChrome;
var fontSmall = "42pt Helvetica Neue";
var fontThin = "40pt Helvetica Neue LT Std";
var fontLarge = "56pt Helvetica Neue";
var fontLargeChrome = "62pt Open Sans";
var fontSmallChrome = "lighter 48pt Open Sans";

$("form").submit(createOverlays);
$("#selTitleCard").bind("change", changeTitleCardType);

$(document).ready(function(){
  imgChromeLogo = new Image();
  imgChromeLogo.src = "/assets/chrome-logo.png";
  imgGDLLogo = new Image();
  imgGDLLogo.src = "/assets/gdl-logo.png";
  imgNamePlaccard = new Image();
  imgNamePlaccard.src = "/assets/name.png";
  imgBG = new Image();
  imgBG.src = '/assets/blank-withurl.png';
  imgTitleCardChrome = new Image();
  imgTitleCardChrome.src = '/assets/titlecard-chrome.png';

  chrome.storage.sync.get("formData", function(val) {
    console.log(val);
    if (val.formData) {
      $("#showName").val(val.formData.showName);
      $("#presenterNames").val(val.formData.presenters);
      $("#questionsLink").val(val.formData.moderator);
      $("#docsLink").val(val.formData.docs);
      $("#inputOtherUpper").val(val.formData.otherUpper);
      $("#inputOtherLower").val(val.formData.otherLower);
      $("#selLogo").val(val.formData.icon);
      if (val.formData.titleCard) {
        $("#selTitleCard").val(val.formData.titleCard);
      }
      if (val.formData.tcUpper) {
        $("#inputTCUpper").val(val.formData.tcUpper);
      }
      if (val.formData.tcLower) {
        $("#inputTCLower").val(val.formData.tcLower);
      }
      if (val.formData.simpleThird) {
        $("#blankThird").attr("checked", "checked");
      }
      changeTitleCardType();
    }
  });
});

function changeTitleCardType(evt) {
  if ($("#selTitleCard").val() == "none") {
    $("#inputTCUpper, #inputTCLower").attr("disabled", "disabled");
  } else {
    $("#inputTCUpper, #inputTCLower").removeAttr("disabled");
  }
}


function createOverlays() {
  $("#butCreate").attr("disabled", "disabled");
  overlays = [];
  var details;
  var formData = {};
  formData.showName = $("#showName").val().trim();
  formData.presenters = $("#presenterNames").val().trim();
  formData.moderator = $("#questionsLink").val().trim();
  formData.docs = $("#docsLink").val().trim();
  formData.otherUpper = $("#inputOtherUpper").val().trim();
  formData.otherLower = $("#inputOtherLower").val().trim();
  formData.icon = $("#selLogo").val();
  formData.titleCard = $("#selTitleCard").val();
  formData.tcUpper = $("#inputTCUpper").val();
  formData.tcLower = $("#inputTCLower").val();
  formData.simpleThird = ($("#blankThird").attr("checked") === "checked");

  console.log("Creating Name Card Overlays");
  var allNames = formData.presenters;
  var lines = allNames.split('\n');
  lines.forEach(function(item, index, arr) {
    item = item.trim();
    if (item.length >= 1) {
      names = item.trim().split(";");
      filename = "names-" + (index+1).toString() + ".png";
      details = {
        "filename": filename,
        "lower": formData.showName,
        "icon": formData.icon
      };
      if (names.length == 1) {
        details.upperLeft = names[0].trim();
      }
      if (names.length == 2) {
        details.upperLeft = names[0].trim();
        details.upperRight = names[1].trim();
      }
      if (names.length == 3) {
        details.upperLeft = names[0].trim();
        details.upperCenter = names[1].trim();
        details.upperRight = names[2].trim();
      }
      if (names.length >= 1) {
        overlays.push(generateOverlay(details));
      }
    }
  });

  console.log("Creating Simple Name Overlay");
  if ($("#blankThird").attr("checked") === "checked") {
    details = {
      "filename": "simple.png",
      "lower": formData.showName,
      "icon": formData.icon
    };
    overlays.push(generateOverlay(details));
  }

  console.log("Creating Questions Overlay");
  if (formData.moderator !== "") {
    details = {
      "filename": "questions.png",
      "upperLeft": "Questions?",
      "lower": formData.moderator,
      "icon": formData.icon
    };
    overlays.push(generateOverlay(details));
  }

  console.log("Creating Docs Overlay");

  if (formData.docs !== "") {
    details = {
      "filename": "docs.png",
      "upperLeft": "Documentation",
      "lower": formData.docs,
      "icon": formData.icon
    };
    overlays.push(generateOverlay(details));
  }

  console.log("Creating Other Overlay");
  if (formData.otherLower !== "") {
    details = {
      'filename': 'other.png',
      'upperLeft': formData.otherUpper,
      'lower': formData.otherLower,
      'icon': formData.icon
    };
    overlays.push(generateOverlay(details));
  }

  console.log("Creating Title Card");
  if (formData.titleCard != "none") {
    overlays.push(generateTitleCard(formData.titleCard, formData.tcUpper, formData.tcLower));
  }

  chrome.storage.sync.set({"formData": formData}, function() {
    console.log("Saved Form Data", formData);
  });
  saveZip(overlays);
  $("#butCreate").removeAttr("disabled");
  return false;
}

function generateTitleCard(card, upper, lower) {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext('2d');
  
  ctx.clearRect(0, 0, 1920, 1080);

  if (card == "gdl") {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 1920, 1080);
    ctx.drawImage(imgGDLLogo, 500, 470);
    ctx.fillStyle = "black";
    ctx.font = fontLarge;
    ctx.textAlign = "center";
    ctx.fillText(upper, 960, 500);
    ctx.font = fontSmall;
    ctx.fillStyle = "#777777";
    ctx.fillText(lower, 960, 575);
  } else if (card == "chrome") {
    ctx.drawImage(imgTitleCardChrome, 0, 0);
    ctx.fillStyle = "black";
    ctx.font = fontLargeChrome;
    ctx.textAlign = "center";
    ctx.fillText(upper, 1440, 175);
    ctx.font = fontSmallChrome;
    ctx.fillStyle = "#777777";
    ctx.fillText(lower, 1440, 250);
  }

  var details = {};
  details.filename = "titlecard.png";
  details.image = canvas.toDataURL("image/png");
  return details;
}

function generateOverlay(details, callback) {
  var placcardX = 865;
  var left = 0;
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext('2d');
  ctx.textAlign = "left";
  
  ctx.clearRect(0, 0, 1920, 1080);
  
  ctx.drawImage(imgBG,0,0);
  
  if (details.upperLeft) {
    left = 178;
    ctx.drawImage(imgNamePlaccard, left, placcardX);
    ctx.fillStyle = "#4d4d4f";
    ctx.font = fontSmall;
    ctx.fillText(details.upperLeft, left+120, 932);
  }
  if (details.upperCenter) {
    left = 638;
    ctx.drawImage(imgNamePlaccard, left, placcardX);
    ctx.fillStyle = "#4d4d4f";
    ctx.font = fontSmall;
    ctx.fillText(details.upperCenter, left+120, 932);
  }
  if (details.upperRight) {
    left = 1098;
    ctx.drawImage(imgNamePlaccard, left, placcardX);
    ctx.fillStyle = "#4d4d4f";
    ctx.font = fontSmall;
    ctx.fillText(details.upperRight, left+120, 932);
  }
  if (details.lower) {
    ctx.fillStyle = "white";
    ctx.font = fontLarge;
    ctx.fillText(details.lower, 178, 1040);
  }
  if (details.icon) {
    if (details.icon == "chrome") {
      ctx.drawImage(imgChromeLogo, 1775, 965);
    } else {
      ctx.drawImage(imgGDLLogo, 1775, 965);
    }
  }
  details.image = canvas.toDataURL("image/png");
  return details;
}

function saveZip(images) {
  if (images.length >=1) {
    zip = new JSZip();
    images.forEach(function(item, index){
      var newImg = item.image.split(",")[1];
      zip.file(item.filename, newImg, {base64: true});
    });

    var config = {type: 'saveFile', suggestedName: "download.zip"};
    chrome.fileSystem.chooseEntry(config, function(writableEntry) {
      var content = "data:application/zip;base64," + zip.generate();
      var byteString = atob(content.split(",")[1]);
      var mimeString = content.split(',')[0].split(':')[1].split(';')[0];
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([ia], {type: 'application/zip'});
      writeFileEntry(writableEntry, blob, function(e) {
      });
    });
  }
}


function writeFileEntry(writableEntry, opt_blob, callback) {
  if (!writableEntry) {
    output.textContent = 'Nothing selected.';
    return;
  }

  writableEntry.createWriter(function(writer) {

    writer.onerror = errorHandler;
    writer.onwriteend = callback;

    // If we have data, write it to the file. Otherwise, just use the file we
    // loaded.
    if (opt_blob) {
      writer.write(opt_blob);
    } else {
      chosenFileEntry.file(function(file) {
        writer.write(file);
      });
    }
  }, errorHandler);
}

function errorHandler(e) {
  console.error(e);
}



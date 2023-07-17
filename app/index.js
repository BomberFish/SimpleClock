//Debug mode (PLEASE PLEASE PLEASE DISABLE IN PRODUCTION!!!)
//Every time you submit a build without turning this off, a puppy dies
const debug = true

import clock from "clock";
import * as document from "document";
import {me as appbit} from "appbit";
import {preferences} from "user-settings";
import * as utils from "../common/utils";
import {today as activity} from "user-activity";
import {HeartRateSensor} from "heart-rate";
import {goals} from "user-activity";
import {user} from "user-profile";
import {display} from "display";
if (debug = true) {
    console.log("All libraries imported!")
}

// Get a hold of all the elements
const time = document.getElementById("time");
const stepstext = document.getElementById("steps");
const azmtext = document.getElementById("azm");
const hrmtext = document.getElementById("hr");
const datetext = document.getElementById("datetext");
const stepsIcn = document.getElementById("stepsimg");
const hrIcn = document.getElementById("hrimg");
const azmIcn = document.getElementById("azmimg");
const hourHand = document.getElementById("hours");
const minHand = document.getElementById("mins");
const secHand = document.getElementById("secs");
const stepsArc = document.getElementById("stepsArc");
const azmArc = document.getElementById("azmArc");
const hrArc = document.getElementById("hrArc");
var aodHide = document.getElementsByClassName("aodHide");
if (debug = true) {
    console.log("All elements accounted for!")
}
//Make clock update every second
clock.granularity = "seconds";

// Initialise the Heartrate Monitor
const hrm = new HeartRateSensor();
hrm.addEventListener("reading", () => {});
hrm.start();
if (debug = true) {
    console.log("HRM Init!")
}

//Variables that don't need to be updated frequently
var stepsGoal = (`${goals.steps}`);
var azmGoal = (`${goals.activeZoneMinutes.total}`);
var maxhr = (`${user.maxHeartRate}`)

//Clock ontick
clock.ontick = (evt) => {
    let today = evt.date;
    // Date/Time related stuff
    let hours = today.getHours();
    let monthnum = today.getMonth();
    let daywknum = today.getDay();
    let day = utils.zeroPad(today.getDate());
    let monthnum = today.getMonth();
    let day = today.getDate();
    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    var daywk = new Array();
    daywk[0] = "Sun";
    daywk[1] = "Mon";
    daywk[2] = "Tue";
    daywk[3] = "Wed";
    daywk[4] = "Thu";
    daywk[5] = "Fri";
    daywk[6] = "Sat";
    let monthname = month[monthnum];
    let daywkname = daywk[daywknum];
    let secs = utils.zeroPad(today.getSeconds());
    let date = today.getDate();
    let hoursForHand = today.getHours() % 12;
    if (preferences.clockDisplay === "12h") {
        hours = utils.zeroPad(hours % 12 || 12);
    } else {
        hours = utils.zeroPad(hours);
    }
    let mins = utils.zeroPad(today.getMinutes());
    time.text = `${hours}:${mins}:${secs}`;
    hourHand.groupTransform.rotate.angle = utils.hoursToAngle(hoursForHand, mins);
    minHand.groupTransform.rotate.angle = utils.minutesToAngle(mins, secs);
    secHand.groupTransform.rotate.angle = utils.secondsToAngle(secs);

    // Stats
    var steps = (`${activity.adjusted.steps}`);
    var azm = (`${activity.adjusted.activeZoneMinutes.total}`);
    stepstext.text = utils.comma(steps);
    azmtext.text = `${azm}`;
    datetext.text = `${daywkname}, ${monthname} ${date}`;
    stepsArc.sweepAngle = (steps / stepsGoal) * 360
    azmArc.sweepAngle = (azm / azmGoal) * 360
}

hrm.onreading = function () {
  if (debug = true) {
    console.log("Got HRM reading event!")
  }
    var hr = (`${hrm.heartRate}`);
    if (hr === "null") {
      if (debug = true) {
        console.warn("HR is null!")
      }
        hrmtext.text = `--`;
    } else {
      hrmtext.text = `${hr}`;
    }
    hrArc.sweepAngle = (hr / maxhr) * 360
}

// does the device support AOD, and can I use it?
if (display.aodAvailable && appbit.permissions.granted("access_aod")) {
    if (debug = true) {
        console.log("AOD perms granted!")
    }
    // tell the system we support AOD
    display.aodAllowed = true;

    // respond to display change events
    display.addEventListener("change", () => {
        console.log("Got display change event!")
        // Is AOD inactive and the display is on?
        if (!display.aodActive && display.on) {
            if (debug = true) {
                console.log("AOD off!")
            }
            clock.granularity = "seconds";
            // Show elements & start sensors
            for (var i = 0; i < aodHide.length; i++) {
                aodHide[i].style.display = "inline";
            }
            hrm.start();
        } else {
            if (debug = true) {
                console.log("AOD on!")
            }
            clock.granularity = "minutes";
            // Hide elements & stop sensors
            for (var i = 0; i < aodHide.length; i++) {
                aodHide[i].style.display = "none";
            }
            hrm.stop();
        }
    });
} else {
  if (debug = true) {
      if (!display.aodAvailable) {
        console.warn("AOD not available! Is it enabled?")
      } else if (!appbit.permissions.granted("access_aod")) {
        console.warn("access_aod permission not granted!")
      }
    }
}
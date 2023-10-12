// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.

// All variables and functions are scoped to this function to prevent them from
// polluting the global namespace.
$(function () {
  // Settings and consts
  // const timeFormat = "h A"; // 12 hour time
  const timeFormat = "H:00"; // 24 hour time
  const timeBlockTemplate = $("#time-block-template");
  const timeBlockContainer = $("#time-block-container");

  // Set start and end hour for the schedule
  let startHour = 9;
  let endHour = 17;

  // Check if "full" URL parameter is present
  const urlParams = new URLSearchParams(window.location.search);
  if(urlParams.has("full")) {
    // Show all hours of the day
    startHour = 0;
    endHour = 24;
  }

  // Populate schedule with time blocks
  for(let hour = startHour; hour <= endHour; hour++) {
    // clone from template
    const timeBlock = timeBlockTemplate.clone();
    // Make clone visible
    timeBlock.removeClass("d-none");
    // Set the id of the time block to the hour
    timeBlock.attr("id", "hour-" + hour);
    // Set time block hour text
    timeBlock.find(".hour").text(dayjs().hour(hour).format(timeFormat));
    // Set past, present or future class based on the current hour
    updateTimeBlockColors(timeBlock);

    // Make button background color yellow when the text area is modified
    timeBlock.find("textarea").on("input", function() {
      timeBlock.find("button").addClass("saveBtnWarn");
    });

    // Read saved schedule from localStorage and update text area
    const schedule = JSON.parse(localStorage.getItem("schedule")) || {};
    timeBlock.find("textarea").val(schedule[hour] || "");

    // Add event listener to button to save text area content to localstorage
    timeBlock.find("button").on("click", function() {
      // retrieve, modify and save schedule
      const schedule = JSON.parse(localStorage.getItem("schedule")) || {};
      schedule[hour] = timeBlock.find("textarea").val();
      localStorage.setItem("schedule", JSON.stringify(schedule));
      // remove yellow background from button to indicate that the schedule has been saved
      timeBlock.find("button").removeClass("saveBtnWarn");
    });

    // Add to page
    timeBlockContainer.append(timeBlock);
  }

  // display the current date in the header of the page.
  const dayContainer = $("#currentDay");
  dayContainer.text(dayjs().format("dddd, MMMM D, YYYY"));

  // Update the colors every 10 seconds
  setInterval(updateTimeBlockColors, 10000);

  // Update colors for time blocks. If no timeBlock is passed, update all on page.
  function updateTimeBlockColors(timeBlock){
    if(timeBlock) {
      // Only proceed if the element has an hour-x ID. Uses short-circuiting to
      // prevent errors if the element doesn't have an ID.
      if(!timeBlock.attr("id") || !timeBlock.attr("id").includes("hour-")) {
        return;
      }
      // Get hour from ID
      const hour = timeBlock.attr("id").split("-")[1];
      if(currentHour() < hour) {
        timeBlock.addClass("future");
      } else if(currentHour() > hour) {
        timeBlock.addClass("past");
      } else {
        timeBlock.addClass("present");
      }
    } else {
      for(timeBlock of timeBlockContainer.children()) {
        // Call self with each found time block
        updateTimeBlockColors($(timeBlock));
      }
    }
  }

  // Proxy function for dayjs().hour() to make it easier to mock in tests
  function currentHour(){
    // return 11; // for testing
    return dayjs().hour();
  }
});
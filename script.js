// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
$(function () {
  // Settings and consts
  const timeFormat = "h A"; // 12 hour time
  // const timeFormat = "H:00"; // 24 hour time
  const timeBlockTemplate = $("#time-block-template");
  const timeBlockContainer = $("#time-block-container");
  // Range of hours to display in the schedule
  const startHour = 9;
  const endHour = 17;

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

    // Read saved schedule from localStorage and update text area
    const schedule = JSON.parse(localStorage.getItem("schedule")) || {};
    timeBlock.find("textarea").val(schedule[hour] || "");

    // Add event listener to button to save text area content to localstorage
    timeBlock.find("button").on("click", function() {
      // retrieve, modify and save schedule
      const schedule = JSON.parse(localStorage.getItem("schedule")) || {};
      schedule[hour] = timeBlock.find("textarea").val();
      localStorage.setItem("schedule", JSON.stringify(schedule));
    });

    // Add to page
    timeBlockContainer.append(timeBlock);
  }

  // display the current date in the header of the page.
  const dayContainer = $("#currentDay");
  dayContainer.text(dayjs().format("dddd, MMMM D, YYYY"));

  // Update colors every minute, at the start of each minute
  // Calculate the time until the next minute starts
  var now = new Date();
  var timeUntilNextMinute = (60 - now.getSeconds()) * 1000; // Convert to milliseconds
  // Add 1 second to ensure that the next minute has started
  timeUntilNextMinute += 1000;

  // Wait until the next minute starts
  setTimeout(function() {
    // Update the colors immediately when the minute starts
    updateTimeBlockColors();

    // Update the colors every minute
    setInterval(updateTimeBlockColors, 60000); // 60000 milliseconds = 1 minute
  }, timeUntilNextMinute)
});

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
    // TODO: share timeBlockContainer const from earlier in code
    const timeBlockContainer = $("#time-block-container");
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
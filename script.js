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
    // Add to page
    timeBlockContainer.append(timeBlock);
    // Set past, present or future class based on the current hour
    updateTimeBlockColors();
  }
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // display the current date in the header of the page.
  const dayContainer = $("#currentDay");
  dayContainer.text(dayjs().format("dddd, MMMM D, YYYY"));
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
    if(dayjs().hour() < hour) {
      timeBlock.addClass("future");
    } else if(dayjs().hour() > hour) {
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
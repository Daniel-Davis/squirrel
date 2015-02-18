// Code to universalize interpreter
if (typeof(process) == "object") {
  var print = function(args) {
	console.log(args);
	}
  var write = function(args) {
	process.stdout.write(args);
	}
} else {
  console = new Object();
  console.log = function(args) {
    print(args);
	}
  process = new Object();
  process.stdout = new Object();
  process.stdout.write = function(args) {
    write(args);
    }
  }

// File inclusion doesn't work with node :-(
load('journal.js');

function hasEvent(event, entry) {
  return entry.events.indexOf(event) != -1;
}

function tableFor(event, journal) { // function to create a table
  var table = [0, 0, 0, 0]; // creates an array with 4 num variables
  for (var i = 0; i < journal.length; i++) { // for looping thorugh the journal
    var entry = journal[i], index = 0; // creates a variable to store the events of said journal date
    if (hasEvent(event, entry)) index += 1; // if the event is there(calls a function to test) then go to next one
    if (entry.squirrel) index += 2; // if the entry
    table[index] += 1; // table increments the index by one
  } // end of for loop
  return table; // returns the table
} // end of function

function phi(table) {
  return (table[3] * table[0] - table[2] * table[1]) /
    Math.sqrt((table[2] + table[3]) *
              (table[0] + table[1]) *
              (table[1] + table[3]) *
              (table[0] + table[2]));
}

//print(tableFor("touched tree", JOURNAL));
//print(phi(tableFor("touched tree",JOURNAL)));
print(tableFor("work", JOURNAL));


for (var event in correlations) {
  var correlation = correlations[event];
  if (correlation > 0.1 || correlation < -0.1)
    print(event + ": " + correlation);
}

function gatherCorrelations(journal) {
  var phis = {};
  for (var entry = 0; entry < journal.length; entry++) {
    var events = journal[entry].events;
    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      if (!(event in phis))
        phis[event] = phi(tableFor(event, journal));
    }
  }
  return phis;
}

var correlations = gatherCorrelations(JOURNAL);

for (var event in correlations)
  console.log(event + ": " + correlations[event]);

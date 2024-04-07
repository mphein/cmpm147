// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  const fillers = {
    greeting: ["Ahoy", "Greetings", "Good evening", "Afternoon", "HELLO", "Hi", "Hey", "Rawr", "Long time no see", "Yo", "SUP SUP", "DAMN!"],
    alien1: ["Xen", "Astro", "Chrono", "Nebu", "Psycho", "Pi", "Grav", "Bio", "Mc", "Hyper", "Synth", "Squirrel", "QT", "Nova", "Hydro", "Proto", "Eaa", "Lisa", "Phi", "Fo", "Fum", "Ea", "Ast", "Oro", "Oreo", "Pala"],
    alien2: ["bot", "-99", "-101", "Double", "thos", "zeen", "'arcthar'", "-3.14", "ix", "ara", "on", "ox", "il", "us", "ex", "ith", "ez", "ornn", "phat", "babe", "plasm"],
    pleasure: ["yours", "mine", "ours"],
    planet1: ["Phi", "Fo", "Fum", "Ea", "Ast", "Oro", "Oreo", "Pala", "Poro", "Gre", "Xepho", "Astra", "Talo", "Phallus", "Schrechk", "Phlegm", "Moizt", "Limp", "AAAAA", "Tehe", "Hipopo", "Squeak"],
    planet2: ["oodle", "inator", "zilla", "nyah", "nuzzle", "hedoro", "kazing", "alien", "ius", "isu", "ine", "yne", "ith", "aris", "axos", "axia", "olus", "entia", "elle"],
    number: ["006", "626", "420", "000", "101", "229", "111", "222", "XXX", "wtf", "HOT", "WOW", "OwO", "UwU", "<3"],
    area: ["world", "universe", "galaxy", "sector", "buzz lightyear", "nebula", "cosmic domain", "star cluster", "oort cloud", "interstellar medium"],
    feature1: ["eyes", "noses", "hearts", "hairs", "fingers", "lumps", "genitals", "teeth", "nostrils", "earlobes", "belly buttons", "tentacles", "stingers", "stomachs", "nipples", "tails", "scales", "tongues", "fins", "wings", "hooves", "beards", "heads", "anntenae"],
    feature2: ["stank", "smell", "ooze", "grime", "rizz", "fluff", "belly", "charm", "aroma", "eyes", "thighs", "stench", "cheeks"],
    num1: ["six", "eight", "ten", "twelve", "two", "fourteen", "infinite", "five", "seven", "eighty-eight", "twenty-one", "sixty-nine", "three hundred and five", "one thousand"],
    desc: ["long", "heavenly", "dastardly", "erotic", "sexy", "translucent", "transparent", "googly", "seductive", "rugged", "gaseous", "luminous", "dusty", "glacial", "glistening", "volcanic", "radiant", "immortal", "supple", "strong", "massive", "primsatic"],
    state: ["scared", "excited", "emotional", "angry", "upset", "sorry", "happy", "delighted", "lugubrious", "frightened", "terrified", "hot and bothered", "sweaty", "stinky", "lame"],
    game: ["pin the moose on the donkey", "League of Legends", "drinking", "rub", "dancing", "ululating", "peristalsis", "arm wrestling", "chess", "scrabble", "Sudoku", "Among Us", "clothes", "fornication"],
    vibe: ["connection", "vibration", "relationship", "fling", "bond"]
  };
  
  const template = `$greeting, you must be $alien1$alien2. The pleasure is all $pleasure.
  
  I'm originally from $planet1$planet2. Looks like you're from $planet1$planet2 sector $number because your $desc $num1 $feature1, $num1 $feature1, and your $desc $feature2 are out of this $area. Do you like my $desc $num1 $feature1 or my $desc $num1 $feature1? They're homemade and all natural.
  
  I'd love to strengthen this $vibe, so I am pretty $state to say this, but let's get our $game on!
  `;
  
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    $("#box").text(story);
  }
  
  /* global clicker */
  $("#clicker").click(generate);  
  generate();  
}

// let's get this party started - uncomment me
main();
// Novation Launchpad script updated from the enchanced script
//
// Changes to the previous script
// Previous Script wss Launchpad Maxi
// https://github.com/wizgrav/launchpad-maxi
//
// UPDATE IN APRIL 2015
// Changed velocity settings so you can have a "high" and "low" velocity and a "velocity increment" using the user 2 and 3 buttons you can select the // correct velocity.
// Added flashing yellow led to playing tracks so you know you can stop them.
// Added UUID to make this unique version.
// Cleaned up note maps and keys. Holding shift and pressing the left and right keys will now cycle through the modes note modes.
// Added Yellow flashing LED on Track page when track is playing, red flashing when track is stopping.
// Cleaned up edit mode.  Pressing the session button and user 1 now implements Cut/Paste. Pressing the session button and user 2 now impletements   
// Copy/Paste.  Pressing the shift button and any of the mixer row buttons choses the length of clip to create for and touching the grid will create 
// an empty clip.
// Changed Mixer Buttons to toggle switches from Momentary
// Added Push Scale Modes (linear modes still accesable by pressing shift and D)
// Changed Pan Buttons so they are centered
// Added fine adjustments of all mixer controls
// Added toggle click (shift + user1 in key page)
// Fixed Launch Scene (Shift + Any Grid Button)

// TODO: Create scene from playing clips




// USER SETTINGS

//don't change this
var userVarPans = 8;

// Playing of pad on velocity change is turned off, setting this to true will turn it on
var userVelNote = false;

// New velocity setup, has a set number for low and high, and you use the two middle buttons to index the rest of the velocities.
// velHigh is the High velocity and velLow is the Low velocity
var velHigh = 127;
var velLow = 70;

var velocities2 = [];
for	(index = 127; index > -1; index--)
{
    velocities2[velocities2.length] = index;
}

// Start the API
loadAPI(1);

// This stuff is all about defining the script and getting it to autodetect and attach the script to the controller
host.defineController("Novation", "Launchpad Script v3", "1.0", "b73e476c-e61b-11e4-8a00-1681e6b88ec1");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["Launchpad"], ["Launchpad"]);
host.addDeviceNameBasedDiscoveryPair(["Launchpad S"], ["Launchpad S"]);
host.addDeviceNameBasedDiscoveryPair(["Launchpad Mini"], ["Launchpad Mini"]);

//Detect Multiple Launchpads
for(var i=1; i<20; i++)
{
   var name = i.toString() + "- Launchpad";
   host.addDeviceNameBasedDiscoveryPair([name], [name]);
   host.addDeviceNameBasedDiscoveryPair(["Launchpad MIDI " + i.toString()], ["Launchpad MIDI " + i.toString()]);
   host.addDeviceNameBasedDiscoveryPair(["Launchpad S " + i.toString()], ["Launchpad S " + i.toString()]);
   host.addDeviceNameBasedDiscoveryPair(["Launchpad S MIDI " + i.toString()], ["Launchpad S MIDI " + i.toString()]);
   host.addDeviceNameBasedDiscoveryPair(["Launchpad Mini " + i.toString()], ["Launchpad Mini " + i.toString()]);
   host.addDeviceNameBasedDiscoveryPair(["Launchpad Mini MIDI " + i.toString()], ["Launchpad Mini MIDI " + i.toString()]);

}

// Special section for Linux users
if(host.platformIsLinux())
{
	for(var i=1; i<16; i++)
	{
	   host.addDeviceNameBasedDiscoveryPair(["Launchpad S " + + i.toString() + " MIDI 1"], ["Launchpad S " + + i.toString() + " MIDI 1"]);
	   host.addDeviceNameBasedDiscoveryPair(["Launchpad Mini " + + i.toString() + " MIDI 1"], ["Launchpad Mini " + + i.toString() + " MIDI 1"]);
	}
}

// TempMode is a variable used for the Temporary views used in ClipLauncher mode.
var TempMode =
{
   OFF:-1,
   VOLUME:0,
   PAN:1,
   SEND_A:2,
   SEND_B:3,
   TRACK:4,
   SCENE:5,
   USER1:6,
   USER2:7,
   USER3:8
};

// loads up the other files needed
load("launchpad_constants.js"); // contains CCs, Colour values and other variables used across the scripts
load("launchpad_page.js"); // defines the page type which is used for the different pages on the Launchpad
load("launchpad_notemap.js"); // works out all the notemaps, the scales and drawing of the black and white keys
load("launchpad_grid.js"); // draws the main clip launcher and other pages such as volume, pan, sends, and user controls
load("launchpad_keys.js"); // draws the keys as set in launchpad_notemap and places them across the pads
load("launchpad_step_sequencer.js"); // everything to do with the step sequencer

// activePage is the page displayed on the Launchpad, the function changes the page and displays popups
var activePage = null;

function setActivePage(page)
{
   var isInit = activePage == null;
    
   if (!mixerButtonToggle)
   {
   ARMED=(TEMPMODE != TempMode.OFF)?TEMPMODE+1:false;
   }
    

   if (page != activePage)
   {
      activePage = page;
      if (!isInit)
      {
         host.showPopupNotification(page.title);
      }

      updateNoteTranlationTable();
      updateVelocityTranslationTable();

      // Update indications in the app
      for(var p=0; p<8; p++)
      {
         var track = trackBank.getTrack(p);
         track.getClipLauncher().setIndication(activePage == gridPage);
      }
   }
}

// This sets the order of the buttons on the track control temporary mode
var TrackModeColumn =
{
   STOP:0,
   SELECT:1,
   ARM:2,
   SOLO:3,
   MUTE:4,
   RETURN_TO_ARRANGEMENT:7
};


var TEMPMODE = -1;

var IS_GRID_PRESSED = false;
//var IS_EDIT_PRESSED = false;
var IS_KEYS_PRESSED = false;
//var IS_RECORD_PRESSED = false;
var IS_SHIFT_PRESSED = false;

// Declare arrays which are used to store information received from Bitwig about what is going on to display on pads
var volume = initArray(0, 8);
var pan = initArray(0, 8);
var mute = initArray(0, 8);
var solo = initArray(0, 8);
var arm = initArray(0, 8);
var isMatrixStopped = initArray(0, 8);
var isSelected = initArray(0, 8);
var isQueuedForStop = initArray(0, 8);
var trackExists = initArray(0, 8);
var sendA = initArray(0, 8);
var sendB = initArray(0, 8);
var vuMeter = initArray(0, 8);
var masterVuMeter = 0;
var isDrumMachine = false;

var userValue = initArray(0, 24);

var hasContent = initArray(0, 64);
var isPlaying = initArray(0, 64);
var isRecording = initArray(0, 64);
var isQueued = initArray(0, 64);
var isStopQueued = initArray(0, 64);

// Observer functions to store receive information into the above arrays
function getTrackObserverFunc(track, varToStore)
{
   return function(value)
   {
      varToStore[track] = value;
   }
}

function getGridObserverFunc(track, varToStore)
{
   return function(scene, value)
   {
      varToStore[scene*8 + track] = value;
   }
}

var noteOn = initArray(false, 128);
WRITEOVR = false;


// The init function gets called when initializing by Bitwig
function init()
{
   // setup MIDI in
   host.getMidiInPort(0).setMidiCallback(onMidi);

   noteInput = host.getMidiInPort(0).createNoteInput("Launchpad", "80????", "90????");
   noteInput.setShouldConsumeEvents(false);

   // Create a transport and application control section
   transport = host.createTransport();
   application = host.createApplication();

   transport.addLauncherOverdubObserver(function(state){
        WRITEOVR=state;
   });
   
   // a Trackbank is the tracks, sends and scenes being controlled, these arguments are set to 8,2,8 in the launchpad_constants.js file changing them will change the size of the grid displayed on the Bitwig Clip Launcher
   trackBank = host.createMainTrackBank(NUM_TRACKS, NUM_SENDS, NUM_SCENES);

   // This scrolls through the controllable tracks and clips and picks up the info from Bitwig to later display/control, it stores them in the arrays declared above
   for(var t=0; t<NUM_TRACKS; t++)
   {
      var track = trackBank.getChannel(t);

      track.getVolume().addValueObserver(8, getTrackObserverFunc(t, volume));
      track.getPan().addValueObserver(userVarPans, getTrackObserverFunc(t, pan));
      track.getSend(0).addValueObserver(8, getTrackObserverFunc(t, sendA));
      track.getSend(1).addValueObserver(8, getTrackObserverFunc(t, sendB));    
      track.getMute().addValueObserver(getTrackObserverFunc(t, mute));
      track.getSolo().addValueObserver(getTrackObserverFunc(t, solo));
      track.getArm().addValueObserver(getTrackObserverFunc(t, arm));
      track.getIsMatrixStopped().addValueObserver(getTrackObserverFunc(t, isMatrixStopped));
      track.exists().addValueObserver(getTrackObserverFunc(t, trackExists));
      track.addVuMeterObserver(7, -1, true, getTrackObserverFunc(t, vuMeter));
      track.addIsSelectedObserver(getTrackObserverFunc(t, isSelected));
      track.addIsQueuedForStopObserver(getTrackObserverFunc(t, isQueuedForStop));
       
      var clipLauncher = track.getClipLauncherSlots();

      clipLauncher.addHasContentObserver(getGridObserverFunc(t, hasContent));
      clipLauncher.addIsPlayingObserver(getGridObserverFunc(t, isPlaying));
      clipLauncher.addIsRecordingObserver(getGridObserverFunc(t, isRecording));
      clipLauncher.addIsQueuedObserver(getGridObserverFunc(t, isQueued));
      clipLauncher.addIsStopQueuedObserver(getGridObserverFunc(t, isStopQueued)); 
       
      //var primaryDevice = track.getDeviceChain.hasDrumPads(isDrumMachine);
       //println(isDrumMachine);
	  
      
   }

   // These next 4 pick up whether the Clip Launcher can be moved
   trackBank.addCanScrollTracksUpObserver(function(canScroll)
   {
      gridPage.canScrollTracksUp = canScroll;
   });

   trackBank.addCanScrollTracksDownObserver(function(canScroll)
   {
      gridPage.canScrollTracksDown = canScroll;
   });

   trackBank.addCanScrollScenesUpObserver(function(canScroll)
   {
      gridPage.canScrollScenesUp = canScroll;
   });

   trackBank.addCanScrollScenesDownObserver(function(canScroll)
   {
      gridPage.canScrollScenesDown = canScroll;
   });
   
   // Cursor track allow selection of a track
   cursorTrack = host.createArrangerCursorTrack(0, 0);
   cursorTrack.addNoteObserver(seqPage.onNotePlay);
   //deviceBank = cursorTrack.createDeviceBank(1);
   //primaryDevice = deviceBank.getDevice(1);
   //println(primaryDevice);
    //isDrumMachine = primaryDevice.addNameObserver(10, "noDevice", blah);

   // Picks up the Master Track from Bitwig for use displaying the VuMeter
   masterTrack = host.createMasterTrack(0);
   masterTrack.addVuMeterObserver(8, -1, true, function(level)
   {
      masterVuMeter = level;
   });

   // Picks up the controllable knobs, buttons which have been set via "Learn Controller Assignment". There are 24 set here because there are 3 pages of user controls with 8 assignable controls on each
   userControls = host.createUserControls(24);

   for(var u=0; u<24; u++)
   {
      var control = userControls.getControl(u);

      control.addValueObserver(8, getTrackObserverFunc(u, userValue));
      control.setLabel("U" + (u+1));
   }

   // Created a Cursor Clip section. I believe this section is used to create a section used on the Drum Machine device
   // ToDO: host.createCursorClipSection is deprecated and should be updated
   cursorClip = host.createCursorClip(SEQ_BUFFER_STEPS, 128);
   cursorClip.addStepDataObserver(seqPage.onStepExists);
   cursorClip.addPlayingStepObserver(seqPage.onStepPlay);
   
   cursorClip.addPlayingStepObserver(gridPage.onStepPlay);
   cursorClip.scrollToKey(0);

   // Call resetdevice which clears all the lights
   resetDevice();
   setGridMappingMode();
   enableAutoFlashing();
   setActivePage(gridPage);

   updateNoteTranlationTable();
   updateVelocityTranslationTable();
   // Calls the function just below which displays the funky Bitwig logo, which ends the initialization stage 
   animateLogo();
}

// Animates the Bitwig logo at the start. The pads that are drawn are defined further down this script in the drawBitwigLogo function
function animateLogo()
{
   if (logoPhase > 7)
   {
      setDutyCycle(2, 10);
      return;
   }
   else if (logoPhase > 6)
   {
      showBitwigLogo = false;
      var i = 0.5 - 0.5 * Math.cos(logoPhase * Math.PI);
      setDutyCycle(Math.floor(1 + 5 * i), 18);
   }
   else
   {
      var i = 0.5 - 0.5 * Math.cos(logoPhase * Math.PI);
      setDutyCycle(Math.floor(1 + 15 * i), 18);
   }

   logoPhase += 0.2;

   host.scheduleTask(animateLogo, null, 30);
}

var logoPhase = 0;
var showBitwigLogo = true;

// Function called on exit of the script
function exit()
{
   resetDevice();
}

// Reset all lights by sending MIDI and sets all values in the pendingLEDs array to 0
function resetDevice()
{
   sendMidi(0xB0, 0, 0);

   for(var i=0; i<80; i++)
   {
      pendingLEDs[i] = 0;
   }
   flushLEDs();
}

// I'm not sure what these functions do
// enableAutoFlashing and setGridMappingMode are called during initialization.
// setDutyCycle is called by the animateLogo function, They are likely something to do with light display

function enableAutoFlashing()
{
   sendMidi(0xB0, 0, 0x28);
}

function setGridMappingMode()
{
   sendMidi(0xB0, 0, 1);
}

function setDutyCycle(numerator, denominator)
{
   if (numerator < 9)
   {
      sendMidi(0xB0, 0x1E, 16 * (numerator - 1) + (denominator - 3));
   }
   else
   {
      sendMidi(0xB0, 0x1F, 16 * (numerator - 9) + (denominator - 3));
   }
}

function updateNoteTranlationTable()
{
   //println("updateNoteTranlationTable");
   var table = initArray(-1, 128);

   for(var i=0; i<128; i++)
   {
      var y = i >> 4;
      var x = i & 0xF;

      if (x < 8 && activePage.shouldKeyBeUsedForNoteInport(x, y))
      {
         table[i] = activeNoteMap.cellToKey(x, y);
      }
   }

   noteInput.setKeyTranslationTable(table);
}

function updateVelocityTranslationTable()
{
   var table = initArray(seqPage.velocity, 128);
   table[0] = 0;

   noteInput.setVelocityTranslationTable(table);
}

// This is the main function which runs whenever a MIDI signal is sent
// You can uncomment the printMIDI below to see the MIDI signals within Bitwigs Controller script console

function onMidi(status, data1, data2)
{
	printMidi(status, data1, data2);

   if (MIDIChannel(status) != 0) return;

   if (isChannelController(status))
   {
      // isPressed checks whether MIDI signal is above 0 in value declaring that button is being pressed
      var isPressed = data2 > 0;

	  // This section changes the page within the script displayed on the device
	  // data1 is the CC, the CC values are defined within the launchpad_contants script and range from 104 to 111 for the topbuttons
      switch(data1)
      {
         case TopButton.SESSION:
            activePage.onSession(isPressed);
            if (isPressed)
            {
               IS_GRID_PRESSED = true;
               println("here")
            }
            if (isPressed && !IS_SHIFT_PRESSED)
            {
                setActivePage(gridPage);
                gridPage.setTempMode(TempMode.SCENE);
            }
            else if (!isPressed)
            {
                gridPage.setTempMode(TempMode.OFF);
                if (IS_GRID_PRESSED)
                {
                    IS_GRID_PRESSED=false;
                    println("notehre")
                }
            } 
            break;

         case TopButton.USER1:
            activePage.onUser1(isPressed);
            if (isPressed)
            {
                IS_KEYS_PRESSED=true;
            }
            if (isPressed && !IS_SHIFT_PRESSED)
            {
               setActivePage(keysPage);
            }
            else
            {
                if(IS_KEYS_PRESSED)
                {
                    IS_KEYS_PRESSED=false;
                }
            }
            break;

         case TopButton.USER2:
            activePage.onUser2(isPressed);
            if (isPressed && !IS_SHIFT_PRESSED)
            {
                setActivePage(seqPage);
            }
            break;

         case TopButton.MIXER:
            activePage.onShift(isPressed);
                if (isPressed)
                {
                    IS_SHIFT_PRESSED = true;
                }
                else
                {
                    if(IS_SHIFT_PRESSED)
                    {
                        IS_SHIFT_PRESSED=false;
                    }
                }
            break;

         case TopButton.CURSOR_LEFT:
            activePage.onLeft(isPressed);
            break;

         case TopButton.CURSOR_RIGHT:
            activePage.onRight(isPressed);
            break;

         case TopButton.CURSOR_UP:
            activePage.onUp(isPressed);
            break;

         case TopButton.CURSOR_DOWN:
            activePage.onDown(isPressed);
            break;
      }
   }

   if (isNoteOn(status) || isNoteOff(status, data2))
   {
      var row = data1 >> 4;
      var column = data1 & 0xF;
         
      println("row = " + row + "col = " + column)
         
      if (column < 8)
      {
         activePage.onGridButton(row, column, data2 > 0);
      }
      else
      {
         activePage.onSceneButton(row, data2 > 0);
      }
   }
}

// Clears all the lights
function clear()
{
   for(var i=0; i<80; i++)
   {
      pendingLEDs[i] = Colour.OFF;
   }
}

function flush()
{
   if (showBitwigLogo)
   {
      drawBitwigLogo();
   }
   else
   {
      activePage.updateOutputState();
   }

   flushLEDs();
}

// Defines the Pads to be shown to draw the Bitwig logo
// calls the mixColour function within the launchpad_constants.js script
function drawBitwigLogo()
{
   clear();

   var c = mixColour(2, 1, false);

   for(var x=2;x<=5; x++) setCellLED(x, 2, c);
   for(var x=1;x<=6; x++) setCellLED(x, 3, c);

   setCellLED(1, 4, c);
   setCellLED(2, 4, c);
   setCellLED(5, 4, c);
   setCellLED(6, 4, c);
}

// Sends the Top LED lights to the pendingLEDs array. LED top have a value of 72 to 80
function setTopLED(index, colour)
{
   pendingLEDs[LED.TOP + index] = colour;
}

// Sends the right LED lights to the pendingLEDs array. LED scene have a value of 64 to 72
function setRightLED(index, colour)
{
   pendingLEDs[LED.SCENE + index] = colour;
}

// Sends the main pads to the pendingLEDs array. LED scene have a value of 0 to 63
function setCellLED(column, row, colour)
{
   var key = row * 8 + column;

   pendingLEDs[key] = colour;
}

/** Cache for LEDs needing to be updated, which is used so we can determine if we want to send the LEDs using the
 * optimized approach or not, and to send only the LEDs that has changed.
 */
 
 // arrays of 80 buttons, the main 64 pads and the 8 at the top and 8 at side. Pending is used for lights to be sent, active contains the lights already on

var pendingLEDs = new Array(80);
var activeLEDs = new Array(80);

// This function compares the LEDs in pending to those in active and if there is a difference it will send them via MIDI message
// If there is more than 30 lights changed it sends the MIDI in a single message ("optimized mode") rather than individually
function flushLEDs()
{

	// changedCount contains number of lights changed
   var changedCount = 0;

   // count the number of LEDs that are going to be changed by comparing pendingLEDs to activeLEDs array
   for(var i=0; i<80; i++)
   {
      if (pendingLEDs[i] != activeLEDs[i]) changedCount++;
   }

   // exit function if there are none to be changed
   if (changedCount == 0) return;

   //uncommenting this displays a count of the number of LEDs to be changed
   //println("Repaint: " + changedCount + " LEDs");

   // if there is a lot of LEDs, use an optimized mode (which looks to me like it sends all in one MIDI message
   if (changedCount > 30)
   {
      // send using channel 3 optimized mode
      for(var i = 0; i<80; i+=2)
      {
         sendMidi(0x92, pendingLEDs[i], pendingLEDs[i+1]);
         activeLEDs[i] = pendingLEDs[i];
         activeLEDs[i+1] = pendingLEDs[i+1];
      }
      sendMidi(0xB0, 104 + 7, activeLEDs[79]); // send dummy message to leave optimized mode
   }
   // if not a lot of LEDs need changing send them in individual MIDI messages
   else
   {
      for(var i = 0; i<80; i++)
      {
         if (pendingLEDs[i] != activeLEDs[i])
         {
            activeLEDs[i] = pendingLEDs[i];

            var colour = activeLEDs[i];

            if (i < 64) // Main Grid
            {
               var column = i & 0x7;
               var row = i >> 3;
               sendMidi(0x90, row*16 + column, colour);
            }
            else if (i < 72)    // Right buttons
            {
               sendMidi(0x90, 8 + (i - 64) * 16, colour);
            }
            else    // Top buttons
            {
               sendMidi(0xB0, 104 + (i - 72), colour);
            }
         }
      }
   }
}

// This function is not called anywhere within the rest of the Launchpad script. textToPattern sounds like it may have been the start of displaying text on the Launchpad, or could be left from another script for another device.

/* Format text into a bit pattern that can be displayed on 4-pixels height */

function textToPattern(text)
{
   var result = [];

   for(var i=0; i<text.length; i++)
   {
      if (i != 0) result.push(0x0); // mandatory spacing

      switch (text.charAt(i))
      {
         case '0':
            result.push(0x6, 0x9, 0x6);
            break;

         case '1':
            result.push(0x4, 0xF);
            break;

         case '2':
            result.push(0x5, 0xB, 0x5);
            break;

         case '3':
            result.push(0x9, 0x9, 0x6);
            break;

         case '4':
            result.push(0xE, 0x3, 0x2);
            break;
      }
   }

   return result;
}

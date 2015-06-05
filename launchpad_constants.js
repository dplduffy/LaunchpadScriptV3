
// CCs for the Top buttons
var TopButton =
{
   CURSOR_UP:104,
   CURSOR_DOWN:105,
   CURSOR_LEFT:106,
   CURSOR_RIGHT:107,
   SESSION:108,
   USER1:109,
   USER2:110,
   MIXER:111
};

// CCs for the Mixer Buttons
var MixerButton =
{
   VOLUME:0,
   PAN:1,
   SEND_A:2,
   SEND_B:3,
   STOP:4,
   TRK_ON:5,
   SOLO:6,
   ARM:7
};

// Called the scripts mainly within launchpad_grid
// It is used for the Bitwig logo and the VUmeter
function mixColour(red, green, blink)
{
   return (blink ? 8 : 12) | red | (green * 16);
}

// Defines the values to be sent for the colours
var Colour = // Novation are from the UK
{
   OFF:12,
   RED_LOW:13,
   RED_FULL:15,
   AMBER_LOW:29,
   AMBER_FULL:63,
   YELLOW_FULL:62,
   YELLOW_LOW: 0x2D,
   ORANGE:39,
   LIME:0x3D,
   HEADER:mixColour(0,1,false),
   GREEN_LOW:28,
   GREEN_FULL:60,
   RED_FLASHING:11,
   AMBER_FLASHING:59,
   YELLOW_FLASHING:58,
   GREEN_FLASHING:56
};

// defines the LED locations with the pending and active LED arrays for the lights
// They are used in the format LED.SCENE
var LED =
{
   GRID:0,
   SCENE:64,
   TOP:72,

   CURSOR_UP:0,
   CURSOR_DOWN:1,
   CURSOR_LEFT:2,
   CURSOR_RIGHT:3,
   SESSION:4,
   USER1:5,
   USER2:6,
   MIXER:7,

   VOLUME:0,
   PAN:1,
   SEND_A:2,
   SEND_B:3,
   STOP:4,
   TRK_ON:5,
   SOLO:6,
   ARM:7
};

// Number of tracks, sends and scenes, they are called from the Launchpad.control.js file only during the init() function
var NUM_TRACKS = 8;
var NUM_SENDS = 2;
var NUM_SCENES = 8;
var NUM_EFFECT_TRACKS = 1;
var NUM_EFFECT_SCENES = 1;

//new global variables
var mixerButtonToggle = false;
var mixerDetailMode = false;
var armedToggle = false;
var sessionButtonToggle = false;
var seqPageDrumMode = false;
var seqPageNoteMode = false;
var sendNumber = 0;
var setPan = 0;
var undo1 = false;



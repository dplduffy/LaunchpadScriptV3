/*
 * Note map
 *
 * */
 
 // Makes up all the Notemaps to be used within launchpad_keys.js

function NoteMap()
{
   this.rootKey = 36;
}

var ModernModesPush =
[
 [ 0, 2, 4, 5, 7,  9,  11 ] ,
 [ 0, 2, 3, 5, 7,  8,  10 ] ,
 [ 0, 2, 3, 5, 7,  9,  10 ] ,
 [ 0, 2, 4, 5, 7,  9,  10 ] ,
 [ 0, 2, 4, 6, 7,  9,  11 ] ,
 [ 0, 1, 3, 5, 7,  8,  10 ] ,
 [ 0, 1, 3, 4, 6,  8,  10 ] ,
 [ 0, 1, 3, 4, 6,  7,  9 ] ,
 [ 0, 2, 3, 5, 6,  8,  9  ] ,
 [ 0, 2, 4, 6, 8,  10 ] ,
 [ 0, 3, 5, 6, 7,  10 ] ,
 [ 0, 3, 5, 7, 10 ] ,
 [ 0, 2, 4, 7, 9  ] ,
 [ 0, 2, 3, 5, 7,  8,  11 ] ,
 [ 0, 2, 3, 5, 7,  9,  11 ] ,
 [ 0, 1, 3, 4, 6,  8,  10 ] ,
 [ 0, 1, 4, 5, 7,  8,  11 ] ,
 [ 0, 2, 3, 6, 7,  8,  11 ] ,
 [ 0, 1, 4, 5, 7,  8,  10 ] ,
 [ 0, 4, 6, 7, 11 ] ,
 [ 0, 1, 5, 7, 10 ] ,
 [ 0, 1, 5, 6, 10 ] ,
 [ 0, 2, 3, 7, 9  ] ,
 [ 0, 1, 3, 7, 8  ] ,
 [ 0, 1, 4, 5, 7,  9,  10 ] 
];

var ModernModesDiatonic =
[
 [ 0, 2, 4, 5, 7,  9,  11 , 12] ,
 [ 0, 2, 3, 5, 7,  8,  10 , 12] ,
 [ 0, 2, 3, 5, 7,  9,  10 , 12] ,
 [ 0, 2, 4, 5, 7,  9,  10 , 12] ,
 [ 0, 2, 4, 6, 7,  9,  11 , 12] ,
 [ 0, 1, 3, 5, 7,  8,  10 , 12] ,
 [ 0, 1, 3, 4, 6,  8,  10 , 12] ,
 [ 0, 1, 3, 4, 6,  7,  9 , 12] ,
 [ 0, 2, 3, 5, 6,  8,  9  , 12] ,
 [ 0, 2, 4, 6, 8,  10 , 12] ,
 [ 0, 3, 5, 6, 7,  10 , 12] ,
 [ 0, 3, 5, 7, 10 , 12] ,
 [ 0, 2, 4, 7, 9  , 12] ,
 [ 0, 2, 3, 5, 7,  8,  11 , 12] ,
 [ 0, 2, 3, 5, 7,  9,  11 , 12] ,
 [ 0, 1, 3, 4, 6,  8,  10 , 12] ,
 [ 0, 1, 4, 5, 7,  8,  11 , 12] ,
 [ 0, 2, 3, 6, 7,  8,  11 , 12] ,
 [ 0, 1, 4, 5, 7,  8,  10 , 12] ,
 [ 0, 4, 6, 7, 11 , 12] ,
 [ 0, 1, 5, 7, 10 , 12] ,
 [ 0, 1, 5, 6, 10 , 12] ,
 [ 0, 2, 3, 7, 9  , 12] ,
 [ 0, 1, 3, 7, 8  , 12] ,
 [ 0, 1, 4, 5, 7,  9,  10 , 12]
 ];

var ModernModesNames =
[
  ['Major'],
  ['Minor'],
  ['Dorian'],
  ['Mixolydian'],
  ['Lydian'],
  ['Phrygian'],
  ['Locrian'],
  ['Dimished'],
  ['Whole-half'],
  ['Whole Tone'],
  ['Minor Blues'],
  ['Minor Pentaonic'],
  ['Marjor Pentatonic'],
  ['Harmonic Minor'],
  ['Melodic Minor'],
  ['Super Locorian'],
  ['Bhairav'],
  ['Hungarian Minor'],
  ['Minor Gypsy'],
  ['Hirojoshi'],
  ['In-Sen'],
  ['Iwato'],
  ['Kumoi'],
  ['Pelog'],
  ['Spanish']
];

var RootNoteNames = 

[
  ['C'],
  ['C#'],
  ['D'],
  ['D# / Eb'],
  ['E'],
  ['F'],
  ['F#'],
  ['G'],
  ['G#'],
  ['A'],
  ['A# / Bb'],
  ['B']
];

NoteMap.prototype.cellToKey = function(x, y)
{
   // -1 means no key (gap)
   return -1;
};

NoteMap.prototype.cellToVelocity = function(x, y)
{
    return 90;
};

function isKeyBlack(key)
{
    var k = key % 12;

    switch (k)
    {
        case 1:
        case 3:
        case 6:
        case 8:
        case 10:
            return true;
    }

    return false;
}

NoteMap.prototype.keyIsBlack = function(key)
{
   return isKeyBlack(key);
};

NoteMap.prototype.drawCell = function(x, y, highlight)
{
   var key = this.cellToKey(x, y);

   // sets the colours of the black and white keys
   var white = highlight ? Colour.AMBER_FULL : Colour.AMBER_LOW;
   var black = highlight ? Colour.RED_FULL : Colour.RED_LOW;
   
   var colour = (key != -1) ? ((((((this.rootKey * key) / 12 ) / this.rootKey) % 1 ) == 0) ? Colour.AMBER_FULL: (this.keyIsBlack(key) ? black : white)) : Colour.OFF;
   
   if (noteOn[key])
   {
      colour = Colour.GREEN_FULL;
   }

   setCellLED(x, y, colour);
};

NoteMap.prototype.canScrollUp = function()
{
   return false;
};

NoteMap.prototype.canScrollDown = function()
{
   return false;
};

NoteMap.prototype.canScrollLeft = function()
{
   return false;
};

NoteMap.prototype.canScrollRight = function()
{
   return false;
};

//----------------------------------------------------------------------------------------------------------

pianoNoteMap = new NoteMap();

pianoNoteMap.cellToKey = function(x, y)
{
   var octave = 3 - Math.floor(y / 2);

   var xx = 0;
   var no_k = false;

   switch(x)
   {
      case 0:
         xx = 0;
         no_k = true;
         break;

      case 1:
         xx = 2;
         break;

      case 2:
         xx = 4;
         break;

      case 3:
         xx = 5;
         no_k = true;
         break;

      case 4:
         xx = 7;
         break;

      case 5:
         xx = 9;
         break;

      case 6:
         xx = 11;
         break;

      case 7:
         xx = 12;
         no_k = true;
         break;
   }

   var white = y & 1 != 0;

   if (!white && no_k)
   {
      return -1;
   }

   var key = this.rootKey + octave * 12 + xx;

   if (!white)
   {
      key -= 1;
   }

   return key;
};

pianoNoteMap.scrollUp = function()
{
   this.rootKey = Math.min(this.rootKey + 12, 108);
   updateNoteTranlationTable();
};

pianoNoteMap.scrollDown = function()
{
   this.rootKey = Math.max(this.rootKey - 12, 0);
   updateNoteTranlationTable();
};

//these next 2 functions were added to get rid of the error
pianoNoteMap.scrollLeft = function()
{
};

pianoNoteMap.scrollRight = function()
{
};



pianoNoteMap.canScrollUp = function()
{
   return this.rootKey < 108;
};

pianoNoteMap.canScrollDown = function()
{
   return this.rootKey > 0;
};

pianoNoteMap.mixerButton = function()
{
};

pianoNoteMap.getName = function()
{
   return "Piano";
}

//----------------------------------------------------------------------------------------------------------

largeDrumNoteMap = new NoteMap();

largeDrumNoteMap.cellToKey = function(x, y)
{
    var lx = x >> 1;
    var ly = y >> 1;
    return this.rootKey + (3 - ly) * 4 + lx;
};

largeDrumNoteMap.keyIsBlack = function(key)
{
    var s = key & 1 != 0;
    return key & 4 ? !s : s;
};

largeDrumNoteMap.scrollUp = function()
{
   println(IS_SHIFT_PRESSED)
   
   if (IS_SHIFT_PRESSED)
   {
      this.rootKey = Math.min(this.rootKey + 16, 112);
      updateNoteTranlationTable();
   }
   
   if (!IS_SHIFT_PRESSED)
   {
      this.rootKey = Math.min(this.rootKey + 1, 112);
      updateNoteTranlationTable();   
   }
   
};

largeDrumNoteMap.scrollDown = function()
{
   if (IS_SHIFT_PRESSED)
   {
      this.rootKey = Math.max(this.rootKey - 16, 0);
      updateNoteTranlationTable();
   }
   if (!IS_SHIFT_PRESSED)
   {
      this.rootKey = Math.max(this.rootKey - 1, 0);
      updateNoteTranlationTable();   
   }
   
};

largeDrumNoteMap.canScrollUp = function()
{
   return this.rootKey < 112;
};

largeDrumNoteMap.canScrollDown = function()
{
   return this.rootKey  > 4;
};

largeDrumNoteMap.canScrollLeft = function()
{
   return false;
};

largeDrumNoteMap.scrollLeft = function()
{
};

largeDrumNoteMap.canScrollRight = function()
{
   return true;
};

largeDrumNoteMap.scrollRight = function()
{
   activeNoteMap = smallDrumNoteMap;
   updateNoteTranlationTable();
   host.showPopupNotification("Scale: " + activeNoteMap.getName());
};

largeDrumNoteMap.mixerButton = function()
{
};

largeDrumNoteMap.getName = function()
{
   return "Drums (large)";
}

//----------------------------------------------------------------------------------------------------------

smallDrumNoteMap = new NoteMap();

smallDrumNoteMap.cellToKey = function(x, y)
{
   var subX = x & 3;
   var subY = y & 3;
   var page = (y < 4 ? 2 : 0) + (x >= 4 ? 1 : 0);

   return this.rootKey + (3 - subY) * 4 + subX + 16 * page;
};

smallDrumNoteMap.keyIsBlack = function(key)
{
    var s = key & 1 != 0;
    return key & 4 ? !s : s;
};

smallDrumNoteMap.scrollUp = function()
{
   if (IS_SHIFT_PRESSED) {
      this.rootKey = Math.min(this.rootKey + 16, 64);
      updateNoteTranlationTable();
   }
   if (!IS_SHIFT_PRESSED) {
   this.rootKey = Math.min(this.rootKey + 1, 64);
   updateNoteTranlationTable();
   }
};

smallDrumNoteMap.scrollDown = function()
{
   if (IS_SHIFT_PRESSED)
   {
      this.rootKey = Math.max(this.rootKey - 16, 0);
      updateNoteTranlationTable();
   }
   if (!IS_SHIFT_PRESSED)
   {
      this.rootKey = Math.max(this.rootKey - 1, 0);
      updateNoteTranlationTable();   
   }
   
};

smallDrumNoteMap.canScrollUp = function()
{
   return this.rootKey < 60;
};

smallDrumNoteMap.canScrollDown = function()
{
   return this.rootKey  > 4;
};

smallDrumNoteMap.canScrollLeft = function()
{
   return true;
};

smallDrumNoteMap.scrollLeft = function()
{
   activeNoteMap = largeDrumNoteMap;
   updateNoteTranlationTable();
   host.showPopupNotification("Scale: " + activeNoteMap.getName());
};

smallDrumNoteMap.canScrollRight = function()
{
   return false;
};

smallDrumNoteMap.scrollRight = function()
{
};

smallDrumNoteMap.mixerButton = function()
{
};

smallDrumNoteMap.getName = function()
{
   return "Drums (small)";
}

//----------------------------------------------------------------------------------------------------------

LinearGridNoteMap.prototype = new NoteMap();
LinearGridNoteMap.prototype.constructor = LinearGridNoteMap;
LinearGridNoteMap.mode = 0;
LinearGridNoteMap.root = 0;

function LinearGridNoteMap(stepsX, stepY)
{
    NoteMap.call(this);
    this.stepsX = stepsX;
    this.stepY = stepY;
}

LinearGridNoteMap.prototype.getName = function()
{
   return "Linear";
}

LinearGridNoteMap.prototype.xToOffset = function(x)
{
   var o = 0;

   for(var i=0; i<x; i++)
   {
      o += this.stepsX[i % this.stepsX.length];
   }
   return o;
};

LinearGridNoteMap.prototype.cellToKey = function(x, y)
{
   var key = this.rootKey + (7-y)*this.stepY + this.xToOffset(x);

   if (key >= 0 && key < 128)
   {
      return key;
   }

   return -1;
};

LinearGridNoteMap.prototype.scrollUp = function()
{
   this.rootKey = Math.min(this.rootKey + 12, 108);
   updateNoteTranlationTable();
};

LinearGridNoteMap.prototype.scrollDown = function()
{
   this.rootKey = Math.max(this.rootKey - 12, 4);
   updateNoteTranlationTable();
};

LinearGridNoteMap.prototype.canScrollUp = function()
{
   return this.rootKey < 108;
};

LinearGridNoteMap.prototype.canScrollDown = function()
{
   return this.rootKey  > 4;
};

LinearGridNoteMap.mixerButton = function()
{
};

LinearGridNoteMap.prototype.getName = function()
{
   return "Linear";
}

//----------------------------------------------------------------------------------------------------------

var linear14Grid = new LinearGridNoteMap([1], 3);
var linear34Grid = new LinearGridNoteMap([3], 4);
var linear25Grid = new LinearGridNoteMap([2], 5);
var noteMap23_12 = new LinearGridNoteMap([2, 3], 6);
var noteMap13_12 = new LinearGridNoteMap([1, 3], 6);

linear14Grid.canScrollRight = function()
{
   return true;
};

linear14Grid.canScrollLeft = function()
{
   return false;
};

linear14Grid.scrollRight = function()
{
   activeNoteMap = linear34Grid;
   updateNoteTranlationTable();
   host.showPopupNotification("Scale: Linear34");
};

linear14Grid.scrollLeft = function()
{
};

linear34Grid.canScrollLeft = function()
{
   return true;
};

linear34Grid.canScrollRight = function()
{
   return true;
};

linear34Grid.scrollLeft = function()
{
   activeNoteMap = linear14Grid;
   updateNoteTranlationTable();
   host.showPopupNotification("Scale: Linear14");
};

linear34Grid.scrollRight = function()
{
   activeNoteMap = linear25Grid;
   updateNoteTranlationTable(); 
   host.showPopupNotification("Scale: Linear25");
};

linear25Grid.canScrollLeft = function()
{
   return true;
};

linear25Grid.canScrollRight = function()
{
   return true;
};

linear25Grid.scrollLeft = function()
{
   activeNoteMap = linear34Grid;
   updateNoteTranlationTable();
   host.showPopupNotification("Scale: Linear34");
};

linear25Grid.scrollRight = function()
{
   activeNoteMap = noteMap23_12;
   updateNoteTranlationTable();
   host.showPopupNotification("Scale: Notemap23_12");
};

noteMap23_12.canScrollLeft = function()
{
   return true;
};

noteMap23_12.canScrollRight = function()
{
   return true;
};

noteMap23_12.scrollLeft = function()
{
   activeNoteMap = linear25Grid;
   updateNoteTranlationTable();
   host.showPopupNotification("Scale: Linear25");
};

noteMap23_12.scrollRight = function()
{
   activeNoteMap = noteMap13_12;
   updateNoteTranlationTable();
   host.showPopupNotification("Scale: Notemap13_12");
};

noteMap13_12.canScrollLeft = function()
{
   return true;
};

noteMap13_12.canScrollRight = function()
{
   return false;
};

noteMap13_12.scrollLeft = function()
{
   activeNoteMap = noteMap23_12;
   updateNoteTranlationTable();
   host.showPopupNotification("Scale: Notemap23_12");
};

noteMap13_12.scrollRight = function()
{
};

//----------------------------------------------------------------------------------------------------------

pushGridNoteMap = new NoteMap();
pushGridNoteMap.mode = 0;
pushGridNoteMap.root = 0;

pushGridNoteMap.getName = function()
{
   return "Push";
}

pushGridNoteMap.cellToKey = function(x, y)
{
   y = 7 - y
   var key = this.rootKey + ModernModesPush[pushGridNoteMap.mode][( ( y * 3 ) + x ) % 7] ;
   key = key + ( Math.floor( ( ( y * 3 ) + x ) / 7) * 12) 

   if (key >= 0 && key < 128)
   {
      return key;
   }

   return -1;
};

pushGridNoteMap.scrollUp = function()
{
   this.rootKey = Math.min(this.rootKey + 12, 96);
   updateNoteTranlationTable();
};

pushGridNoteMap.scrollDown = function()
{
   this.rootKey = Math.max(this.rootKey - 12, 0);
   updateNoteTranlationTable();
};

pushGridNoteMap.canScrollUp = function()
{
   return this.rootKey < 96;
};

pushGridNoteMap.canScrollDown = function()
{
   return this.rootKey  > 0;
};

pushGridNoteMap.scrollLeft = function()
{
    if(!IS_SHIFT_PRESSED)
    {
	   if(this.root > 0)
	    {
		this.rootKey = this.rootKey - 1;
	    }
        this.root = Math.max(0, this.root - 1);
    }
    if(IS_SHIFT_PRESSED)
    {
        if (pushGridNoteMap.mode > 0)
        {
        pushGridNoteMap.mode = pushGridNoteMap.mode - 1;
        }
    }
    
   updateNoteTranlationTable();
   host.showPopupNotification("Root: " + RootNoteNames[this.root] + " | Mode: " + ModernModesNames[pushGridNoteMap.mode]);
};

pushGridNoteMap.scrollRight = function()
{
    if(!IS_SHIFT_PRESSED)
    {
	   if(this.root < 11)
	   { 
		  this.rootKey = this.rootKey + 1;
	   }
	   this.root = Math.min(11, this.root + 1);
    }
    if(IS_SHIFT_PRESSED)
    {
        if (pushGridNoteMap.mode < ModernModesPush.length - 1)
        {
            pushGridNoteMap.mode = pushGridNoteMap.mode + 1;
        }
    }
   updateNoteTranlationTable();
   host.showPopupNotification("Root: " + RootNoteNames[this.root] + " | Mode: " + ModernModesNames[pushGridNoteMap.mode]);
};

pushGridNoteMap.canScrollUp = function()
{
   return this.rootKey < 72;
};

pushGridNoteMap.canScrollDown = function()
{
   return this.rootKey > 0;
};

pushGridNoteMap.canScrollLeft = function()
{
   if(!IS_SHIFT_PRESSED)
   {
       return this.root > 0;
   }
   if(IS_SHIFT_PRESSED)
   {
       return pushGridNoteMap.mode > 0;
   }
};

pushGridNoteMap.canScrollRight = function()
{
    if(!IS_SHIFT_PRESSED)
    {
    return (this.root + 1) < RootNoteNames.length;
    }
    if(IS_SHIFT_PRESSED)
    {
    return (pushGridNoteMap.mode +1) < ModernModesNames.length;
    }
};

pushGridNoteMap.mixerButton = function()
{
};

pushGridNoteMap.getName = function()
{
   return "Push";
}

//----------------------------------------------------------------------------------------------------------

diatonicNoteMap = new NoteMap();
diatonicNoteMap.mode = 0;
diatonicNoteMap.root = 0;

diatonicNoteMap.cellToKey = function(x, y)
{
   var octave = 7-y;
   var key = this.rootKey + octave * 12 + ModernModesDiatonic[this.mode][x];
   
   if (key >= 0 && key < 128)
   {
      return key;
   }

   return -1;
}

diatonicNoteMap.scrollUp = function()
{
   this.rootKey = Math.min(this.rootKey + 12, 72);
   updateNoteTranlationTable();
};

diatonicNoteMap.scrollDown = function()
{
   this.rootKey = Math.max(this.rootKey - 12, 0);
   updateNoteTranlationTable();
};

diatonicNoteMap.scrollLeft = function()
{
    if(!IS_SHIFT_PRESSED)
    {
	   if(this.root > 0)
	    {
		this.rootKey = this.rootKey - 1;
	    }
        this.root = Math.max(0, this.root - 1);
    }
    if(IS_SHIFT_PRESSED)
    {
        if (diatonicNoteMap.mode > 0)
        {
        diatonicNoteMap.mode = diatonicNoteMap.mode - 1;
        }
    }
    
   updateNoteTranlationTable();
   host.showPopupNotification("Root: " + RootNoteNames[this.root] + " | Mode: " + ModernModesNames[diatonicNoteMap.mode]);
};

diatonicNoteMap.scrollRight = function()
{
    if(!IS_SHIFT_PRESSED)
    {
	   if(this.root < 11)
	   { 
		  this.rootKey = this.rootKey + 1;
	   }
	   this.root = Math.min(11, this.root + 1);
    }
    if(IS_SHIFT_PRESSED)
    {
        if (diatonicNoteMap.mode < ModernModesDiatonic.length - 1)
        {
            diatonicNoteMap.mode = diatonicNoteMap.mode + 1;
        }
    }
   updateNoteTranlationTable();
   host.showPopupNotification("Root: " + RootNoteNames[this.root] + " | Mode: " + ModernModesNames[diatonicNoteMap.mode]);
};

diatonicNoteMap.canScrollUp = function()
{
   return this.rootKey < 72;
};

diatonicNoteMap.canScrollDown = function()
{
   return this.rootKey > 0;
};

diatonicNoteMap.canScrollLeft = function()
{
   if(!IS_SHIFT_PRESSED)
   {
       return this.root > 0;
   }
   if(IS_SHIFT_PRESSED)
   {
       return diatonicNoteMap.mode > 0;
   }
};

diatonicNoteMap.canScrollRight = function()
{
    if(!IS_SHIFT_PRESSED)
    {
    return (this.root + 1) < RootNoteNames.length;
    }
    if(IS_SHIFT_PRESSED)
    {
    return (diatonicNoteMap.mode +1) < ModernModesNames.length;
    }
};

diatonicNoteMap.shift = function(index)
{
};

diatonicNoteMap.mixerButton = function (index)
{
};
    

diatonicNoteMap.getName = function()
{
   return "Diatonic";
};

//----------------------------------------------------------------------------------------------------------

var noteMaps = [pianoNoteMap, largeDrumNoteMap, diatonicNoteMap, pushGridNoteMap, linear14Grid, null, null, null];

var activeNoteMap = pianoNoteMap;


/*
 * KEYS PAGE
 *
 * */

keysPage = new Page();

keysPage.title = "Keys / Drums";

keysPage.updateOutputState = function()
{
   clear();
   this.canScrollUp = activeNoteMap.canScrollUp();
   this.canScrollDown = activeNoteMap.canScrollDown();
   this.canScrollLeft = activeNoteMap.canScrollLeft();
   this.canScrollRight = activeNoteMap.canScrollRight();
   this.updateScrollButtons();
   setTopLED(5, WRITEOVR ? Colour.RED_FULL:Colour.YELLOW_FULL);

   for(var i=0; i<4; i++)
   {
       var isCurrent = noteMaps[i] == activeNoteMap;
       var hasMap = noteMaps[i] != null;
	   // sets the LED of the current notemap (top 4 side buttons)
       setRightLED(i, hasMap ? (isCurrent ? Colour.GREEN_FULL : Colour.GREEN_LOW) : Colour.OFF);
	   // sets the velocity button color (bottom 4 side buttons)
       setRightLED(4 + i, seqPage.velocityStep == i ? Colour.AMBER_LOW : Colour.AMBER_LOW);
   }
   setTopLED(7, gridPage.firstStep ? Colour.RED_FLASHING:Colour.GREEN_FULL);
   this.drawKeys();
};

keysPage.onSession = function(isPressed)
{
}

keysPage.onUser1 = function(isPressed)
{
   if (isPressed)
   {
      if (IS_SHIFT_PRESSED)
      {
        transport.toggleClick();
      }
      else
      {
        transport.toggleLauncherOverdub();  
      }
   }
}

keysPage.onUser2 = function(isPressed)
{
}

keysPage.onShift = function(isPressed)
{
   
}

keysPage.onSceneButton = function(row, isPressed)
{ 
   if (row >= 4 )
   {
      seqPage.setVelocity(row - 4);
   }
 
   if (noteMaps[row] != null && row != 4)
   {
      if (IS_SHIFT_PRESSED && row == 3)
      {
         row = 4;
      }
      activeNoteMap = noteMaps[row];
      host.showPopupNotification("Scale: " + activeNoteMap.getName());
      updateNoteTranlationTable(activeNoteMap);
   }
};

keysPage.onLeft = function(isPressed)
{
   if (isPressed)
   {
      activeNoteMap.scrollLeft();
   }
};

keysPage.onRight = function(isPressed)
{
   if (isPressed)
   {
      activeNoteMap.scrollRight();
   }
};

keysPage.onUp = function(isPressed)
{
   if (isPressed)
   {
      activeNoteMap.scrollUp();
   }
};

keysPage.onDown = function(isPressed)
{
   if (isPressed)
   {
      activeNoteMap.scrollDown();
   }
};

keysPage.scrollKey = function(offset)
{
   keysPage.rootKey = Math.max(0, Math.min(70, keysPage.rootKey + offset));
};

keysPage.onGridButton = function(row, column, pressed)
{
   /*var key = activeNoteMap.cellToKey(column, row);

   if (key >= 0)
   {
      var velocity = 90;

      if (pressed)
      {
         cursorTrack.startNote(key, velocity);
      }
      else
      {
         cursorTrack.stopNote(key, velocity);
      }
   }*/
};

// Draws the keys
keysPage.drawKeys = function()
{
   for(var y=0; y<8; y++)
   {
      for(var x=0; x<8; x++)
      {
         activeNoteMap.drawCell(x, y, false);
      }
   }
};

keysPage.shouldKeyBeUsedForNoteInport = function(x,y)
{
   return true;
}

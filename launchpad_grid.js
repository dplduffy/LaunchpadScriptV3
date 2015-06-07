
/*
*  GRID PAGE
*
* */



gridPage = new Page();

gridPage.mixerAlignedGrid = false;
gridPage.canScrollTracksUp = false;
gridPage.canScrollTracksDown = false;
gridPage.canScrollScenesUp = false;
gridPage.canScrollScenesDown = false;
gridPage.title = "Clip Launcher";

ARMED=false;

// Updates the scroll buttons
gridPage.updateOutputState = function()
{
   clear();

   this.canScrollUp = this.mixerAlignedGrid ? this.canScrollScenesUp : this.canScrollTracksUp;
   this.canScrollDown = this.mixerAlignedGrid ? this.canScrollScenesDown : this.canScrollTracksDown;
   this.canScrollLeft = !this.mixerAlignedGrid ? this.canScrollScenesUp : this.canScrollTracksUp;
   this.canScrollRight = !this.mixerAlignedGrid ? this.canScrollScenesDown : this.canScrollTracksDown;
    
   this.updateScrollButtons();
   this.updateGrid();
   var cls = ((WRITEOVR) ? [Colour.RED_FLASHING,Colour.RED_FULL]:[Colour.YELLOW_FLASHING,Colour.YELLOW_FULL]); 
    
   // Set the top LEDs while in Clip Launcher
   setTopLED(4, IS_SHIFT_PRESSED ? Colour.YELLOW_FULL : (gridPage.firstStep ? Colour.RED_FLASHING:Colour.GREEN_FULL));
   setTopLED(5, IS_SHIFT_PRESSED ? Colour.YELLOW_FULL : (ARMED == 9 ? (ARMED?cls[0]:cls[1]):Colour.OFF));
   setTopLED(6, IS_SHIFT_PRESSED ? Colour.YELLOW_FULL : (ARMED == 10 ? (ARMED?cls[0]:cls[1]):Colour.OFF));
   setTopLED(7, (TEMPMODE == TempMode.OFF ? (ARMED?cls[0]:cls[1]): Colour.YELLOW_FULL));
};

gridPage.onSession = function(isPressed)
{   
    
    if(TEMPMODE == TempMode.OFF && !IS_GRID_PRESSED)
    {
        if(IS_SHIFT_PRESSED)
            {
            application.undo();
            host.showPopupNotification("Undo");
            return;
            }
        else
        {
        this.mixerAlignedGrid = !this.mixerAlignedGrid;
          
	          if(this.mixerAlignedGrid)
              {
              application.setPerspective('MIX');
		      }
	          if(this.mixerAlignedGrid == false)
              {
	          application.setPerspective('ARRANGE');
		      }
          
              host.showPopupNotification("Orientation: " + (this.mixerAlignedGrid ? "Mix" : "Arranger"));
        }

    }
}

gridPage.onUser1 = function(isPressed)
{
  if (isPressed)
    {
        if(IS_SHIFT_PRESSED)
        {
        ARMED = 9;
        }
    }
}

gridPage.onUser2 = function(isPressed)
{
    if (isPressed)
    {
        if(IS_SHIFT_PRESSED)
        {
            ARMED = 10;
        }
    }
}

// This detects when the Mixer button is pressed and changes the orientation identifier mixerAlignedGrid and displays the text popup
gridPage.onShift = function(isPressed)
{
    if (mixerButtonToggle == true)
    {
    //add in FINE adjustments for mixer buttons
    }
    
    if(ARMED > 0 && armedToggle == false)
    {
    armedToggle = true;
    return;
    }
    
    if(ARMED > 0 && armedToggle == true)
    {
    armedToggle = false;
    ARMED = 0;
    this.setTempMode(TempMode.OFF);
    mixerButtonToggle = false;
    return;
    }
}


// This detects when one of the vertical buttons is pressed and changes the TempMode
gridPage.onSceneButton = function(row, isPressed)
{
   if (isPressed)
   {  
      if (IS_SHIFT_PRESSED)
      {
         ARMED = row+1;
         return;        
      }
       
      if(ARMED > 0)
      {
          return;
      }
       
      switch(row)
      {       
         case MixerButton.VOLUME:
            if (TEMPMODE != TempMode.VOLUME)
            {
            this.setTempMode(TempMode.VOLUME);
            host.showPopupNotification("Volume");
            mixerButtonToggle = true;
            }
            else
            {
            this.setTempMode(TempMode.OFF);
            mixerButtonToggle = false;
            }
            break;

         case MixerButton.PAN:
            if (TEMPMODE != TempMode.PAN)
            {
            this.setTempMode(TempMode.PAN);
            host.showPopupNotification("Pan");
            mixerButtonToggle = true;
            }
            else
            {
            this.setTempMode(TempMode.OFF);
            mixerButtonToggle = false;
            }
            break;

         case MixerButton.SEND_A:
            if (TEMPMODE != TempMode.SEND_A)
            {
            this.setTempMode(TempMode.SEND_A);
            host.showPopupNotification("Send 0");
            mixerButtonToggle = true;
            }
            else
            {
            this.setTempMode(TempMode.OFF);
            mixerButtonToggle = false;
            }
            break;

         case MixerButton.SEND_B:
            if (TEMPMODE != TempMode.SEND_B)
            {
            this.setTempMode(TempMode.SEND_B);
            host.showPopupNotification("Send 1");
            mixerButtonToggle = true;
            }
            else
            {
            this.setTempMode(TempMode.OFF);
            mixerButtonToggle = false;
            }
            break;

         case MixerButton.STOP:
            if (TEMPMODE != TempMode.USER1)
            {
            this.setTempMode(TempMode.USER1);
            host.showPopupNotification("User 1");
            mixerButtonToggle = true;
            }
            else
            {
            this.setTempMode(TempMode.OFF);
            mixerButtonToggle = false;
            }
            break;

         case MixerButton.TRK_ON:
            if (TEMPMODE != TempMode.USER2)
            {
            this.setTempMode(TempMode.USER2);
            host.showPopupNotification("User 2");
            mixerButtonToggle = true;
            }
            else
            {
            this.setTempMode(TempMode.OFF);
            mixerButtonToggle = false;
            }
            break;

         case MixerButton.SOLO:
            if (TEMPMODE != TempMode.USER3)
            {
            this.setTempMode(TempMode.USER3);
            host.showPopupNotification("User 3");
            mixerButtonToggle = true;
            }
            else
            {
            this.setTempMode(TempMode.OFF);
            mixerButtonToggle = false;
            }
            break;

         case MixerButton.ARM:
            if (TEMPMODE != TempMode.TRACK)
            {
            this.setTempMode(TempMode.TRACK);
            host.showPopupNotification("Track");
            mixerButtonToggle = true;
            }
            else
            {
            this.setTempMode(TempMode.OFF);
            mixerButtonToggle = false;
            }
            break;
      }
   }
};

// These following 4 functions control the scrolling arrow buttons allowing move around
gridPage.onLeft = function(isPressed)
{
   if (isPressed)
   {
        if (IS_SHIFT_PRESSED)
        {
         if (this.mixerAlignedGrid) trackBank.scrollTracksPageUp();
         else trackBank.scrollScenesPageUp();
        }
        else
        {
        if (this.mixerAlignedGrid) trackBank.scrollTracksUp();
        else trackBank.scrollScenesUp();
        }
   }
};

gridPage.onRight = function(isPressed)
{
   if (isPressed)
   {
        if (IS_SHIFT_PRESSED)
        {
         if (this.mixerAlignedGrid) trackBank.scrollTracksPageDown();
         else trackBank.scrollScenesPageDown();
        }
        else
        {
        if (this.mixerAlignedGrid) trackBank.scrollTracksDown();
        else trackBank.scrollScenesDown();
        }
   }
};

gridPage.onUp = function(isPressed)
{
   if (isPressed)
   {
      if (IS_SHIFT_PRESSED)
      {
      if (this.mixerAlignedGrid) trackBank.scrollScenesPageUp();
      else trackBank.scrollTracksaPageUp();
      }
      else
      {
      if (this.mixerAlignedGrid) trackBank.scrollScenesUp();
      else trackBank.scrollTracksUp();
      }
   }
};

gridPage.onDown = function(isPressed)
{
   if (isPressed)
   {
      if (IS_SHIFT_PRESSED)
      {
         if (this.mixerAlignedGrid) trackBank.scrollScenesPageDown();
         else trackBank.scrollTracksPageDown();
      }
      else
      {
      if (this.mixerAlignedGrid) trackBank.scrollScenesDown();
      else trackBank.scrollTracksDown();
	  }
   }
};
REFROW=false;
ROWARM=false;

gridPage.onStepPlay = function(step)
{
   gridPage.firstStep = !step;
};

gridPage.onGridButton = function(row, column, pressed)
{
   if (!pressed){ 
        REFROW--;
        if(!REFROW) ROWARM = false; 
        return;
   }else{
        REFROW++;
   }

   if (IS_SHIFT_PRESSED && TEMPMODE === TempMode.OFF)
   {
      trackBank.launchScene(this.mixerAlignedGrid ? row : column);
   }
   else if (TEMPMODE === TempMode.OFF)
   {
      var track = this.mixerAlignedGrid ? column : row;
      var scene = this.mixerAlignedGrid ? row : column;
      var t = trackBank.getTrack(track);
      var l = t.getClipLauncher();
        
      l.select(scene);
      if(ARMED)
      {
        //application.focusPanelAbove(); I believe this was causing the tracks to get cut and pasted
        if(ARMED === 9)
        {
            if(hasContent[track+8*scene]>0)
            {
            application.cut();
            host.showPopupNotification("Cut");
            }
            else
            {
            application.paste();
            host.showPopupNotification("Paste");
            }
        }
        if(ARMED === 10)
        {
            if(hasContent[track+8*scene]>0)
            {
            application.copy();
            host.showPopupNotification("Copy");
            }
            else
            {
            application.paste();
            host.showPopupNotification("Paste");
            }
        }
        if (ARMED < 9)
        {
            println(ARMED);
            if(hasContent[track+8*scene]>0)
            {
            host.showPopupNotification("Already Clip In Slot");
            }
            else
            {
            l.createEmptyClip(scene,4*(Math.pow(2,(ARMED-1))));
            host.showPopupNotification("Empty Clip Created");
            }    
        }
      }
      /*else if (IS_RECORD_PRESSED)
      {
      l.record(scene);
      }
      else if (IS_EDIT_PRESSED)
      {
      l.showInEditor(scene);
      }*/
      else
      {
      l.launch(scene);
      }
   }
   else if (TEMPMODE === TempMode.TRACK)
   {
	var track = this.mixerAlignedGrid ? column : row;
      var scene = this.mixerAlignedGrid ? row-2 : column;
	
	if (this.mixerAlignedGrid == false) {
      switch(scene)
		  {
		      case TrackModeColumn.STOP:
				trackBank.getTrack(track).getClipLauncher().stop();
				break;

			 case TrackModeColumn.SELECT:
				trackBank.getTrack(track).select();
				application.selectNone();
				break;

			 case TrackModeColumn.ARM:
				trackBank.getTrack(track).getArm().toggle();
				break;
				
			 case TrackModeColumn.SOLO:
				trackBank.getTrack(track).getSolo().toggle();
				break;
				
			 case TrackModeColumn.MUTE:
				trackBank.getTrack(track).getMute().toggle();
				break;

			 case TrackModeColumn.RETURN_TO_ARRANGEMENT:
				trackBank.getTrack(track).getClipLauncher().returnToArrangement();
				break;
		  }
	 }
	 else {
		  switch(scene)
		  {
		  	 case (TrackModeColumn.RETURN_TO_ARRANGEMENT - 2):
				trackBank.getTrack(track).getClipLauncher().returnToArrangement();
				break;
				
			 case (TrackModeColumn.SELECT - 2):
				trackBank.getTrack(track).select();
				application.selectNone();
				break;

			 case (TrackModeColumn.ARM - 2):
				trackBank.getTrack(track).getArm().toggle();
				break;
				
			 case (TrackModeColumn.SOLO - 2):
				trackBank.getTrack(track).getSolo().toggle();
				break;
				
			 case (TrackModeColumn.MUTE - 2):
				trackBank.getTrack(track).getMute().toggle();
				break;
			
			 case (TrackModeColumn.STOP - 2):
				trackBank.getTrack(track).getClipLauncher().stop();
				break;

		  }
	 }	  
	  

   }
   // setups the buttons functionality (not the colors) for all the Vol, Pan, Sends and user pages.
   else
   {
      var vv = this.mixerAlignedGrid ? -Math.abs(row)+7 : column;
      var cc = this.mixerAlignedGrid ? column : row;
      if(ARMED)
      {
        if(ROWARM)
        {
           vv = ROWARM[0]*16 + vv*2;
           cc = ROWARM[1];
        }
        else
        {
           ROWARM=[vv,cc];
           return;
        }
      }else{
        vv = vv*16;
      } 
      switch(TEMPMODE)
      {
         case TempMode.VOLUME:
            if(IS_SHIFT_PRESSED)
            {
                if(vv===80)
                {
                trackBank.getTrack(cc).getVolume().inc(5,128);
                }
                if(vv===64)
                {
                trackBank.getTrack(cc).getVolume().inc(1,128);
                }
                if(vv===48)
                {
                trackBank.getTrack(cc).getVolume().inc(-1,128);
                }
                if(vv===32)
                {
                trackBank.getTrack(cc).getVolume().inc(-5,128);
                }
            }
            else
            {
            trackBank.getTrack(cc).getVolume().set(vv,128);
            }
            break;

         case TempMode.PAN:
            if(IS_SHIFT_PRESSED)
            {
                if(vv===80)
                {
                trackBank.getTrack(cc).getPan().inc(5,128);
                }
                if(vv===64)
                {
                trackBank.getTrack(cc).getPan().inc(1,128);
                }
                if(vv===48)
                {
                trackBank.getTrack(cc).getPan().inc(-1,128);
                }
                if(vv===32)
                {
                trackBank.getTrack(cc).getPan().inc(-5,128);
                }
            }
            else
            {
               if (vv===0)
               {
                  setPan = 0
               }
               if (vv===16)
               {
                  setPan = 19
               }
               if (vv===32)
               {
                  setPan = 43;
               }
               if (vv===48||vv===64)
               {
                  setPan = 63.5;
               }
               if (vv===80)
               {
                  setPan = 84;
               }
               if (vv===96)
               {
                  setPan = 108;
               }
               if (vv===112)
               {
                  setPan = 128;
               }
               trackBank.getTrack(cc).getPan().set(setPan,128);
            }
            break;

         case TempMode.SEND_A:
            if(IS_SHIFT_PRESSED)
            {
                if(vv===80)
                {
                trackBank.getTrack(cc).getSend(0).inc(5,128);
                }
                if(vv===64)
                {
                trackBank.getTrack(cc).getSend(0).inc(1,128);
                }
                if(vv===48)
                {
                trackBank.getTrack(cc).getSend(0).inc(-1,128);
                }
                if(vv===32)
                {
                trackBank.getTrack(cc).getSend(0).inc(-5,128);
                }
            }
            else
            {
            trackBank.getTrack(cc).getSend(sendNumber).set(vv,128);
            }
            break;

         case TempMode.SEND_B:
            if(IS_SHIFT_PRESSED)
            {
                if(vv===80)
                {
                trackBank.getTrack(cc).getSend(1).inc(5,128);
                }
                if(vv===64)
                {
                trackBank.getTrack(cc).getSend(1).inc(1,128);
                }
                if(vv===48)
                {
                trackBank.getTrack(cc).getSend(1).inc(-1,128);
                }
                if(vv===32)
                {
                trackBank.getTrack(cc).getSend(1).inc(-5,128);
                }
            }
            else
            {
            trackBank.getTrack(cc).getSend(1).set(vv,128);
            }
            break;

         case TempMode.USER1:
            if(IS_SHIFT_PRESSED)
            {
                if(vv===80)
                {
                userControls.getControl(this.mixerAlignedGrid ? column : row).inc(5,128);
                }
                if(vv===64)
                {
                userControls.getControl(this.mixerAlignedGrid ? column : row).inc(1,128);
                }
                if(vv===48)
                {
                userControls.getControl(this.mixerAlignedGrid ? column : row).inc(-1,128);
                }
                if(vv===32)
                {
                userControls.getControl(this.mixerAlignedGrid ? column : row).inc(-5,128);
                }
            }
            else
            {
            userControls.getControl(this.mixerAlignedGrid ? column : row).set(vv,128);
            }
            break;

         case TempMode.USER2:
            if(IS_SHIFT_PRESSED)
            {
                if(vv===80)
                {
                userControls.getControl(this.mixerAlignedGrid ? column : row + 8).inc(5,128);
                }
                if(vv===64)
                {
                userControls.getControl(this.mixerAlignedGrid ? column : row + 8).inc(1,128);
                }
                if(vv===48)
                {
                userControls.getControl(this.mixerAlignedGrid ? column : row + 8).inc(-1,128);
                }
                if(vv===32)
                {
                userControls.getControl(this.mixerAlignedGrid ? column : row + 8).inc(-5,128);
                }
            }
            else
            {
            userControls.getControl(this.mixerAlignedGrid ? column : row + 8).set(vv,128);
            }
            break;

         case TempMode.USER3:
            if(IS_SHIFT_PRESSED)
            {
                if(vv===80)
                {
                userControls.getControl(this.mixerAlignedGrid ? column : row + 16).inc(5,128);
                }
                if(vv===64)
                {
                userControls.getControl(this.mixerAlignedGrid ? column : row + 16).inc(1,128);
                }
                if(vv===48)
                {
                userControls.getControl(this.mixerAlignedGrid ? column : row + 16).inc(-1,128);
                }
                if(vv===32)
                {
                userControls.getControl(this.mixerAlignedGrid ? column : row + 16).inc(-5,128);
                }
            }
            else
            {
            userControls.getControl(this.mixerAlignedGrid ? column : row + 16).set(vv,128);
            }
            break;
      }
   }
};

// updates the grid and VUmeters
gridPage.updateGrid = function()
{
   for(var t=0; t<8; t++)
   {
      this.updateTrackValue(t);
      this.updateVuMeter(t);
   }
};

// sets the colours for the VUmeters
// calls the mixColour function within the launchpad_constants.js script
function vuLevelColor(level)
{
   switch (level)
   {
      case 1:
         return mixColour(0, 1, false);

      case 2:
         return mixColour(0, 2, false);

      case 3:
         return mixColour(0, 3, false);

      case 4:
         return mixColour(2, 3, false);

      case 5:
         return mixColour(3, 3, false);

      case 6:
         return mixColour(3, 2, false);

      case 7:
         return mixColour(3, 0, false);
   }

   return Colour.OFF;
}

// even though this section is called updateVumeter, it also setups the colours of all side buttons when they are pressed
gridPage.updateVuMeter = function(track)
{
   var val = vuMeter[track];
   var colour = Colour.OFF;
   
   if(ARMED)
   {
       if (ARMED == 9)
       {
           colour = Colour.RED_FLASHING;
       }
       else if(ARMED == 10)
       {
           colour = Colour.YELLOW_FLASHING;
       }
       else if(track <= ARMED-1)
       {
            colour = Colour.ORANGE;
       }
   }
   else
   {
       if (this.mixerAlignedGrid)
       {
           var i = 7 - track;
           colour = masterVuMeter > i ? vuLevelColor(Math.max(1, i)) : Colour.OFF;
       }
       else
       {
           colour = vuLevelColor(masterVuMeter);
       }
	   
       // Sets the colours of all the right hand side buttons when they are pressed.
           switch(TEMPMODE)
           {
              case TempMode.VOLUME:
                 if (track === 0) colour = Colour.GREEN_FULL;
                 break;

              case TempMode.PAN:
                 if (track === 1) colour = Colour.AMBER_FULL;
                 break;

              case TempMode.SEND_A:
                 if (track === 2) colour = Colour.YELLOW_FULL;
                 break;

              case TempMode.SEND_B:
                 if (track === 3) colour = Colour.YELLOW_FULL;
                 break;

              case TempMode.USER1:
                 if (track === 4) colour = Colour.GREEN_FULL;
                 break;

              case TempMode.USER2:
                 if (track === 5) colour = Colour.GREEN_FULL;
                 break;

              case TempMode.USER3:
                 if (track === 6) colour = Colour.GREEN_FULL;
                 break;

              case TempMode.TRACK:
                 if (track === 7) colour = Colour.ORANGE;
                 break;
           }
   }
   setRightLED(track, colour);
};



gridPage.updateTrackValue = function(track)
{
   if (activePage != gridPage) return;
	// this section draws the pads for the main clip launcher
   if (TEMPMODE == TempMode.OFF || TEMPMODE == TempMode.SCENE)
   {
      for(var scene=0; scene<8; scene++)
      {
         var i = track + scene*8;

         var col = arm[track] ? Colour.RED_LOW : Colour.OFF;
		 
         var fullval = mute[track] ? 1 : 3;
		 
         if (hasContent[i] > 0)
         {
            if (isQueued[i] > 0)
            {
               col = Colour.GREEN_FLASHING;
            }
            else if (isRecording[i] > 0)
            {
               col = Colour.RED_FULL;
            }
            else if (isStopQueued[i] > 0)
            {
                col = Colour.RED_FLASHING
            }
            else if (isPlaying[i] > 0)
            {
               col = Colour.GREEN_FULL;
            }
            else
            {
               col = Colour.AMBER_FULL;
            }
         }

         setCellLED(this.mixerAlignedGrid ? track : scene, this.mixerAlignedGrid ? scene : track, col);
      }
   }

// this sets the buttons and lights for the solo/mute/arm track page. The variable TrackModeColumn is set in the main Launchpad script, so reordering them doesn't work.
   else if (TEMPMODE == TempMode.TRACK)
   {
	 if (this.mixerAlignedGrid == false) {
		  //for(var scene=5; scene<8; scene++)
		  //{
			// setCellLED(scene, track, Colour.OFF);
		  //}

		  if (trackExists[track])
		  {
			 setCellLED(TrackModeColumn.STOP, track, isQueuedForStop[track]  ? isMatrixStopped[track] ? Colour.OFF : Colour.RED_FLASHING : isMatrixStopped[track] ? Colour.OFF : Colour.YELLOW_FLASHING);
			 setCellLED(TrackModeColumn.SELECT, track, isSelected[track] ?  Colour.GREEN_FLASHING : Colour.GREEN_LOW);
			 setCellLED(TrackModeColumn.ARM, track, arm[track] ? Colour.RED_FULL : Colour.RED_LOW);
			 setCellLED(TrackModeColumn.SOLO, track, solo[track] ? Colour.YELLOW_FULL : Colour.YELLOW_LOW);
			 setCellLED(TrackModeColumn.MUTE, track, mute[track] ? Colour.ORANGE : Colour.AMBER_LOW);
			 setCellLED(TrackModeColumn.RETURN_TO_ARRANGEMENT, track, Colour.YELLOW_LOW);
		  }
		  else
		  {
			 //for(var scene=0; scene<5; scene++)
			 //{
				setCellLED(scene, track, Colour.OFF);
			 //}
		  }
	 }
	 else 
     {
             for(var scene=0; scene<2; scene++)
		  {
			 setCellLED(track, scene, Colour.OFF);
		  }

		  if (trackExists[track])
		  {
			 setCellLED(track, TrackModeColumn.STOP, isQueuedForStop[track]  ? isMatrixStopped[track] ? Colour.OFF : Colour.RED_FLASHING : isMatrixStopped[track] ? Colour.OFF : Colour.YELLOW_FLASHING);
			 setCellLED(track, TrackModeColumn.SELECT, isSelected[track] ?  Colour.GREEN_FLASHING : Colour.GREEN_LOW);
			 setCellLED(track, TrackModeColumn.ARM, arm[track] ? Colour.RED_FULL : Colour.RED_LOW);
			 setCellLED(track, TrackModeColumn.SOLO, solo[track] ? Colour.YELLOW_FULL : Colour.YELLOW_LOW);
			 setCellLED(track, TrackModeColumn.MUTE, mute[track] ? Colour.ORANGE : Colour.AMBER_LOW);
			 setCellLED(track, TrackModeColumn.RETURN_TO_ARRANGEMENT, Colour.YELLOW_LOW);
		  }
		  else
		  {
			 for(var scene=2; scene<7; scene++)
			 {
				setCellLED(track, scene, Colour.OFF);
			 }
		  }
	 }
   }
   // Sets the colour of buttons on the Volume Mode, it is special because of the Vumeter so is split from the rest below
   /*else if (TEMPMODE == TempMode.VOLUME)
   {
      if(mixerDetailMode)
      {
        for(var scene=0; scene<8; scene++)
        {
            setCellLED(this.mixerAlignedGrid ? track : scene, this.mixerAlignedGrid ? -Math.abs(scene)+7 : track, c)
        }
      }
      else
      {
        for(var scene=0; scene<8; scene++)
        {
            var c = (volume[track] == scene)
                ? Colour.GREEN_FULL
                : ((vuMeter[track] > scene))
                ? Colour.GREEN_LOW
                : Colour.OFF;

            setCellLED(this.mixerAlignedGrid ? track : scene, this.mixerAlignedGrid ? -Math.abs(scene)+7 : track, c);
        }
      //}
   }*/
    
   // Colouring of all other pages such as Volume, Pan, Sends and User are drawn here
   else
   {
      var value = 0;
      var oncolor = Colour.GREEN_FULL;
      var offcolor = Colour.OFF;

      switch (TEMPMODE)
      {
         case TempMode.VOLUME:
            value = volume[track];
                        println(value)
            oncolor = Colour.GREEN_FULL;
            break;
            
         case TempMode.PAN:
            value = pan[track];
            oncolor = Colour.AMBER_FULL;
            break;

         case TempMode.SEND_A:
            value = sendA[track];
			oncolor = Colour.YELLOW_FULL;
            break;

         case TempMode.SEND_B:
            value = sendB[track];
			oncolor = Colour.YELLOW_FULL;
            break;

         case TempMode.USER1:
            value = userValue[track];
            break;

         case TempMode.USER2:
            value = userValue[track + 8];
            break;
              
         case TempMode.USER3:
            value = userValue[track + 16];
            break;
      }
      
      var drawVal = (value > 0) ? (value + 1) : 0;

       
      if(IS_SHIFT_PRESSED)
      {        
        for(var scene=2; scene<6; scene++)
        {
        setCellLED(this.mixerAlignedGrid ? track : scene, this.mixerAlignedGrid ? -Math.abs(scene)+7 : track, trackExists[track] ? Colour.RED_FULL : offcolor);
        }
        for(var scene=3; scene<5; scene++)
        {
        setCellLED(this.mixerAlignedGrid ? track : scene, this.mixerAlignedGrid ? -Math.abs(scene)+7 : track, trackExists[track] ? Colour.RED_LOW :  offcolor);
        }
      }
      
      else if (TEMPMODE == TempMode.PAN && !IS_SHIFT_PRESSED)
      {
         
        if(!trackExists[track])
        {
         return
        }
        
        drawVal = (drawVal > 0) ? (drawVal - 1) : 0;
        
        for(var scene=2; scene>-1; scene--)
        {
        setCellLED(this.mixerAlignedGrid ? track : scene, this.mixerAlignedGrid ? -Math.abs(scene)+7 : track, (scene > drawVal - 1) ? oncolor: offcolor);
        }
        for(var scene=3; scene<5; scene++)
        {
        setCellLED(this.mixerAlignedGrid ? track : scene, this.mixerAlignedGrid ? -Math.abs(scene)+7 : track, (drawVal === 4 ) ? oncolor: Colour.AMBER_LOW);
        }
        for(var scene=5; scene<8; scene++)
        {
        setCellLED(this.mixerAlignedGrid ? track : scene, this.mixerAlignedGrid ? -Math.abs(scene)+7 : track, (scene < drawVal + 1) ? oncolor: offcolor);
        }
      }
      else
      {
        for(var scene=0; scene<8; scene++)
        {
        setCellLED(this.mixerAlignedGrid ? track : scene, this.mixerAlignedGrid ? -Math.abs(scene)+7 : track, (scene < drawVal) ? oncolor : offcolor);
        }
      }
   }
};



gridPage.setTempMode = function(mode)
{
   if (mode == TEMPMODE) return;
   
   if (mode === TempMode.SCENE && mixerButtonToggle == true)
   {
       TEMPMODE = (TempMode.OFF);
       mixerButtonToggle = false;
       return;
   }
   
   TEMPMODE = mode;

   // This updates the indicators (The rainbow displays on dials for controlls (userControls number 3 is missing? from original script)
   for(var p=0; p<8; p++)
   {
      var track = trackBank.getTrack(p);
      track.getVolume().setIndication(mode == TempMode.VOLUME);
      track.getPan().setIndication(mode == TempMode.PAN);
      track.getSend(0).setIndication(mode == TempMode.SEND_A);
      track.getSend(1).setIndication(mode == TempMode.SEND_B);
      userControls.getControl(p).setIndication(mode == TempMode.USER1);
      userControls.getControl(p + 8).setIndication(mode == TempMode.USER2);
      userControls.getControl(p + 16).setIndication(mode == TempMode.USER3);
   }
};

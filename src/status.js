// 
// Status Object
// ============
// Handles the state of the program at any given moment.
// It's purpose is to avoid overwhelming the program with
// input and commands; this simply discards extraneous 
// commands while the program is running and does not queue 
// them for later use.
// 

  'use strict';

  /**
   * Status object controls the current state of the program.
   * @attribute {inProcess} current state (true if event is firing)
   */
  const Status = {
    inProcess: false
  }

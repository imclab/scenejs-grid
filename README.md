scenejs-grid
=======================

SceneJS.Grid is a modular and extensible engine built on top of SceneJS V3.0, the WebGL-based 3D rendering engine.

Briefly, each module within the grid

 * manages the lifecycle and state of some portion of the scene graph
 * defines actions to expose its functionality, which can be executed via JSON RPC
 * fires events
 * can be dynamically loaded and unloaded

Modules are then orchestrated by JavaScript game scripts, which fire their actions and handle their events.

It's super simple, scales up quickly, and is rather addictive!


(TODO)

Modules
-------------------------


Scripts
-------------------------


Examples
-------------------------

A grid is served right out of this repository. That means that you can fork this repo, add some modules
and scripts, then once we've pulled in those changes, your modules and scripts instantly become part of this grid.

Here's a few examples for starters (might take a few seconds to load):

 * [Example 1](http://htmlpreview.github.com/?https://raw.github.com/xeolabs/scenejs-grid/master/index.html#script=tankDemo) - loads the boot script in [content/scripts/tankDemo](https://github.com/xeolabs/scenejs-grid/blob/master/content/scripts/tankDemo.js)
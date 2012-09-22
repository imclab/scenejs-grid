/**
 * Engine module which notifies of basic mouse events on the grid's canvas
 *
 */
define(function() {

    var _grid; // Saves grid for use in mouse handlers
    var yaw;
    var pitch;
    var lastX;
    var lastY;
    var dragging = false;

    function mouseDown(event) {
        lastX = event.clientX;
        lastY = event.clientY;
        dragging = true;

        _grid.fireEvent("mouse.down", { x: event.clientX, y: event.clientY });
    }

    function touchStart(event) {
        lastX = event.targetTouches[0].clientX;
        lastY = event.targetTouches[0].clientY;
        dragging = true;
    }

    function mouseUp() {
        dragging = false;
    }

    function touchEnd() {
        dragging = false;
    }

    function mouseMove(event) {
        var posX = event.clientX;
        var posY = event.clientY;
        actionMove(posX, posY);
    }

    function touchMove(event) {
        var posX = event.targetTouches[0].clientX;
        var posY = event.targetTouches[0].clientY;
        actionMove(posX, posY);
    }

    function actionMove(posX, posY) {
        if (dragging) {

            yaw += (posX - lastX) * 0.5;
            pitch += (posY - lastY) * 0.5;

            lastX = posX;
            lastY = posY;
        }
    }

    return {

        /**
         * Brief description of the module
         */
        description: "Fires touch events on the canvas",

        /**
         * Called by the grid to initialise the module.
         *
         * Via this method, the grid injects itself into the module, along with a map of grid
         * resources that the module may use. The resources contain things like the HTML canvas
         * and certain nodes in the scene graph that the module may graft additional nodes onto.
         *
         * Within this method, the module would typically create on the grid various actions
         * that it handles, as well as declare what events it fires.
         *
         * @param {Grid} grid The grid
         * @param {Object} resources Resources shared among all modules
         * @param {JSON} configs Module configs
         */
        init: function(grid, resources, configs) {
            _grid = grid; // Save grid in closure for use in mouse handlers

            var canvas = resources.canvas;  // Get the canvas from the grid resources

            grid.createEvent("mouse.down");
            grid.createEvent("mouse.move");
            grid.createEvent("mouse.up");
            grid.createEvent("touch.start");

            canvas.addEventListener('mousedown', mouseDown, true);
            canvas.addEventListener('mousemove', mouseMove, true);
            canvas.addEventListener('mouseup', mouseUp, true);
            canvas.addEventListener('touchstart', touchStart, true);
            canvas.addEventListener('touchmove', touchMove, true);
            canvas.addEventListener('touchend', touchEnd, true);
        },

        /**
         * Destroys this module, deleting anything that it
         * previously created on the grid via its #init method.
         */
        destroy: function(grid, resources) {

            var canvas = resources.canvas;

            grid.deleteEvent("camera.down");

            canvas.removeEventListener('mousedown', mouseDown, true);
            canvas.removeEventListener('mousemove', mouseMove, true);
            canvas.removeEventListener('mouseup', mouseUp, true);
            canvas.removeEventListener('touchstart', touchStart, true);
            canvas.removeEventListener('touchmove', touchMove, true);
            canvas.removeEventListener('touchend', touchEnd, true);
        }
    };
});

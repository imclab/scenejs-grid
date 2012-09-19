/**
 * Example module which manages a Newell Teapot model
 *
 */
define(function() {

    var rootNode;       // Root of subgraph containing the teapot, created in #init and destroyed in #destroy
    var rotateXNode;    // rotate node for X-axis
    var rotateYNode;    // rotate node for Y-axis

    return {

        description: "Demo teapot",

        init: function(grid, resources, configs) {

            /**
             * Define action to update teapot state
             */
            grid.createAction({
                action: "demos.teapot.set",
                fn: function(params) {

                    if (params.visible != undefined) {
                        rootNode.setEnabled(!!params.visible); // Set 'enabled' flag
                    }

                    if (params.rotateX) {
                        rotateXNode.setAngle(params.rotateX);
                    }

                    if (params.rotateY) {
                        rotateYNode.setAngle(params.rotateY);
                    }
                }
            });

            /**
             * Create the teapot in the scene graph
             */
            rootNode = resources.sceneNodes.content.addNode({
                type: "flags",
                flags: {
                    enabled: true
                }
            });

            rotateXNode = rootNode.addNode({
                type: "rotate",
                angle: 0.0,
                x : 1.0
            });

            rotateYNode = rotateXNode.addNode({
                type: "rotate",
                angle: 0.0,
                y : 1.0
            });

            rotateYNode.addNode({
                type: "material",
                emit: 0,
                baseColor:      { r: 0.5, g: 0.5, b: 0.6 },
                specularColor:  { r: 0.9, g: 0.9, b: 0.9 },
                specular:       1.0,
                shine:          70.0,

                nodes: [
                    {
                        type : "geometry",
                        asset: {
                            type: "teapot"
                        }
                    }
                ]
            });

        },

        destroy: function(grid, resources) {

            grid.deleteAction("demos.teapot.set");

            rootNode.destroy();
        }
    };
});

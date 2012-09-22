/*-----------------------------------------------------------------------------------------------------
 * The modules container
 *
 * https://github.com/xeolabs/scenejs-grid/wiki/Modules
 *----------------------------------------------------------------------------------------------------*/

define(["module", "app/grid"], // RequireJS native module
        function (module, grid) {

            /* Although not part of the RequireJS API, 'module' is a special dependency
             * that is processed by the RequireJS core, from which we can get the current
             * module fileName and path. This is not part of the RequireJS API however.
             *
             * http://www.angrycoding.com/2011/09/managing-dependencies-with-requirejs.html
             */
            var uri = module.uri;
            var basePath = uri.substring(0, uri.lastIndexOf("/"));

            var loadedModulesInfo = {}; // Info on modules that are currently loaded, for querying
            var loadedModules = {};     // Modules that are currently loaded


            /* Map of resources that will be shared among all modules. Some modules will
             * create resources, while others will use them. For example, a module that
             * defines a scene graph will put particular scene nodes on this map, while
             * another module that manipulates the scene graph would update those nodes.
             */
            var resources = {};

            /*---------------------------------------------------------------------------------
             * Module loading
             *-------------------------------------------------------------------------------*/

            var actionsCreated = {};

            grid.onEvent("action.created",
                    function(params) {
                        actionsCreated[params.action] = {};
                    });

            grid.createEvent("module.loaded");

            /**
             * Action to load one or more modules
             */
            grid.createAction({

                action: "module.load",

                fn: function(params, ok, error) {

                    var modules = params.modules;

                    if (!modules) {
                        throw "param expected: modules \nhttps://github.com/xeolabs/scenejs-grid/wiki/module.load";
                    }

                    var modulePaths = [];

                    for (var i = 0, len = modules.length; i < len; i++) {
                        modulePaths.push("../../content/components/modules/" + modules[i]);
                    }

                    var moduleConfigs = params.configs || {};

                    grid.fireEvent("taskstarted", {
                        taskId: "module.loading",
                        description: "Loading modules"
                    });

                    var docLocation = document.location.href;
                    var moduleBaseURL = docLocation.substring(0, docLocation.lastIndexOf("/"));

                    require(modulePaths, // Load the modules

                            function() {

                                var module;
                                var moduleId;

                                for (var i = 0, len = modules.length; i < len; i++) {

                                    module = arguments[i];

                                    if (!module.init) {
                                        error("module method missing: " + moduleId
                                                + ".init \nhttps://github.com/xeolabs/scenejs-grid/wiki/Modules");
                                        return;
                                    }

                                    if (!module.destroy) {
                                        error("module method missing: "
                                                + moduleId + ".destroy \nhttps://github.com/xeolabs/scenejs-grid/wiki/Modules");
                                        return;
                                    }

                                    actionsCreated = {};

                                    try {
                                        module.init(grid, resources, moduleConfigs); // Initialise the module

                                    } catch (e) {

                                        grid.fireEvent("error", {
                                            error: "module init failed - " + moduleId + ".init threw an exception: "
                                                    + (e.message || e) + "\nhttps://github.com/xeolabs/scenejs-grid/wiki/Module-init-failed"
                                        });

                                        continue;  // TODO: unload other modules in this list?
                                    }

                                    grid.fireEvent("taskdone", {
                                        taskId: "module.loading"
                                    });

                                    moduleId = modules[i];

                                    var moduleInfo = {
                                        description: module.description || "no description",
                                        src: moduleBaseURL + "/content/components/modules/" + modulePaths[i] + ".js",
                                        events: [],
                                        actions: actionsCreated
                                    };

                                    loadedModulesInfo[moduleId] = moduleInfo;

                                    loadedModules[moduleId] = module;

                                    grid.fireEvent("module.loaded", moduleInfo); // Notify that the module is loaded
                                }

                                ok();
                            });
                }
            });


            /**
             * Queries what modules are currently loaded on the grid
             */
            grid.createAction({

                action: "module.get",

                fn: function(params, ok) {

                    var moduleId = params.moduleId;

                    if (moduleId) {

                        var moduleInfo = loadedModulesInfo[moduleId];

                        if (moduleInfo) {
                            var data = {};
                            data[moduleId] = moduleInfo;
                            ok(data);
                        }
                    } else {
                        ok(loadedModulesInfo);
                    }
                }
            });


            /*---------------------------------------------------------------------------------
             * Module unloading
             *-------------------------------------------------------------------------------*/

            grid.createEvent("module.unloaded");

            grid.createAction({

                action: "module.unload",

                fn: function(params, ok, error) {

                    var modules = params.modules;
                    var moduleId;
                    var moduleInfo;
                    var module;

                    if (!modules) {

                        /* Unloading all modules
                         */
                        modules = [];

                        for (moduleId in loadedModules) {
                            if (loadedModules.hasOwnProperty(moduleId)) {
                                modules.push(moduleId);
                            }
                        }
                    }

                    /* Unload the module(s)
                     */
                    for (var i = 0, len = modules.length; i < len; i++) {

                        moduleId = modules[i];

                        moduleInfo = loadedModulesInfo[moduleId];

                        if (moduleInfo) { // Silently ignore absent modules

                            module = loadedModules[moduleId];

                            delete loadedModulesInfo[moduleId];
                            delete loadedModules[moduleId];

                            try {
                                module.destroy(grid, resources);
                            } catch (e) {

                                grid.fireEvent("error", {
                                    error: "module destroy failed - " + moduleId + ".destroy threw an exception: "
                                            + (e.message || e) + "\nhttps://github.com/xeolabs/scenejs-grid/wiki/Module-destroy-failed"
                                });

                                continue;  // TODO: unload other modules in this list?
                            }

                            grid.fireEvent("module.unloaded", moduleInfo); // Notify that each module is unloaded
                        }
                    }

                    ok();
                }
            });

            /**
             * Unload all modules on grid reset
             */
            grid.onEvent(
                    "reset",
                    function() {

                    });
        });

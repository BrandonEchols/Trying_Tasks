/**
 * Created by Brandon on 8/28/2016.
 */
(function (global) {
    var TaskList = function TaskList() {
        var initialTestRun = true;
        var taskModel = new TaskModel();
        var that;
        var taskTableElementId;
        TaskList.prototype.newList = function newList(elementId) {
            that = this;
            taskTableElementId = elementId;
            //Remove old Content
            document.getElementById(elementId).innerHTML = "";

            initTaskList(elementId);
        }

        TaskList.prototype.updateDisplay = function updateDisplay() {
            initTaskList("TaskList");
            if (taskModel.getListLength() > 0) {
                for (var i = 0; i < taskModel.getListLength(); i++) {
                    taskModel.displayTask(i);
                }
            }
        }

        TaskList.prototype.taskInit = function taskInit(name) {
            var name = document.getElementById("inputBox").value;
            document.getElementById("inputBox").value = "";
            if (name) {
                taskModel.initTask(name);
            }

        }

        /*taskTable.prototype.restoreList = function restoreList(elementId, gameState) {
         //Remove old Content
         document.getElementById(elementId).innerHTML = "";

         //Create a personalized greeting and display it in the welcome sign
         var greeting = "Welcome back to Trying Tasks " + gameState.name + "! :-)"
         document.getElementById("welcomeSign").innerHTML = greeting;

         //Create new game using parameters
         initTaskList(elementId, gameState.list);

         }*/

        /*taskTable.prototype.openTaskListFile = function openTaskListFile(files) {
         var fileReader = new FileReader();

         //Add a listener to the fileReader to wait until it is done reading
         fileReader.addEventListener("load", function(event) {
         var savedGame = JSON.parse(fileReader.result);
         that.restoreList(taskTableElementId, savedGame);
         })
         fileReader.readAsText(files[0]);
         }*/

        /** Constructor
         * */
        function initTaskList(elementId) {
            function initList(elementId) {
                var table = document.getElementById(elementId);
                table.innerHTML = "";
                var tableRow = document.createElement("TR");
                tableRow.className += " sign taskListMenu";

                var col0 = document.createElement("TH");
                col0.innerHTML = "#";
                tableRow.appendChild(col0);

                var col1 = document.createElement("TH");
                col1.innerHTML = "Task";
                tableRow.appendChild(col1);

                var col2 = document.createElement("TH");
                col2.innerHTML = "Created";
                tableRow.appendChild(col2);

                var col3 = document.createElement("TH");
                col3.innerHTML = "Completed?";
                tableRow.appendChild(col3);

                table.appendChild(tableRow);

            }

            initList(elementId);

            //TODO: THIS IS FOR DUBUGGING PURPOSES TEMPORARILY
            if (initialTestRun) {
                initialTestRun = false;
                tempTaskInit();
            }
            function tempTaskInit() {
                taskModel.initTask("Walk the dog");
                taskModel.initTask("Tell my wife I love her!");
                taskModel.initTask("Go sit outside");
                taskModel.initTask("Do the Dishes!!!!!!");
            }

            //^^^^^^^^^^^^^^^^
        }

        return this;


    };

    /**
     * export for CommonJS style
     */
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = new TaskList;
    } else {
        global.TaskList = TaskList;
    }

}(this));

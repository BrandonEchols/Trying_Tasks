/**
 * Created by Brandon on 8/28/2016.
 */

(function (global) {
    var TaskList = function TaskList() {
        var currentUser;
        var debuggingMode = false;
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
            if (taskModel.getListLength() > 0) {
                initTaskList("TaskList");
                for (var i = 0; i < taskModel.getListLength(); i++) {
                    taskModel.displayTask(i);
                }
            }
            else{
                document.getElementById("TaskList").innerHTML = "";
            }
        }

        TaskList.prototype.taskInit = function taskInit(name) {
            var name = document.getElementById("taskInputBox").value;
            document.getElementById("taskInputBox").value = "";
            if (name) {
                if(taskModel.getListLength() < 1){
                    initTaskList("TaskList", true);
                }
                taskModel.initTask(name);
                if(currentUser){
                    that.createTask(name);
                }
            }

        }

        TaskList.prototype.login = function login(inName, inPass) {
            if(inName && inPass){
                var user = {name : inName, password : inPass};
            }
            else{
                var n = document.getElementById("userNameInputBox").value;
                var p = document.getElementById("passwordInputBox").value;
                var user = {name : n, password : p};
            }
            if(user.name && user.password){
                if(currentUser && user.name == currentUser.name) alert("You are already logged in as " + currentUser.name);
                else {
                    $.get("/login/" + user.name.toUpperCase() + "/p/" + user.password.toUpperCase(), function (data) {
                        if(data) {
                            if(data[0]) data = JSON.parse(data);
                            if (data[0] && data[0].name == user.name.toUpperCase()) {
                                currentUser = user;
                                that.getTaskList(currentUser);
                                document.getElementById("WelcomeBanner").innerHTML = "Logged in as:\n" + currentUser.name;
                            }else {
                                alert("Username or password not recognized!");
                            }
                        }else{
                            alert("ERROR: no data returned from /login/:name");
                        }
                    });
                }
            }else{
                alert("You must fill in the email,\nand first name box to sign in!");
            }
        }

        TaskList.prototype.createLogin = function createLogin(inName, inPass) {
            if(inName && inPass) {
                var user = {name : inName, password : inPass};
            }
            else{
                var n = document.getElementById("userNameInputBox").value;
                var p = document.getElementById("passwordInputBox").value;
                var user = {name : n, password : p};
            }
            if(user.name && user.password){
                $.get("/checkForLogin/" + user.name.toUpperCase(), function(data){
                    if(data) {
                        if (data[0]) data = JSON.parse(data);
                        if (data[0] && data[0].name == user.name.toUpperCase()) {
                            alert("That user already exists! Please try logging in as " + user.name + " instead.");
                        } else {
                            $.get("/createLogin/" + user.name.toUpperCase() + "/p/" + user.password.toUpperCase(), function (data) {
                                that.login(user.name, user.password);
                            });
                        }
                    }else{
                        alert("ERROR: no data returned from /checkForLogin/:name");
                    }
                });
            }else{
                alert("You must fill in the email,\nand the first name box to create a login!");
            }
        }

        TaskList.prototype.deleteLogin = function deleteLogin(inName) {
            if(inName){
                $.get("/deleteLogin/" + inName.toUpperCase(),  function(data) {
                    if(data){
                    }else{
                        alert("ERROR: data not returned from /deleteLogin/");
                    }
                });
            }
        }

        TaskList.prototype.getTaskList = function getTaskList(user) {
            $.get("/gettasks/" + user.name.toUpperCase(), function(data) {
                if(data){
                     if (data[0]) {
                         console.log("LOOK: inside getTaskList typeof data = " + typeof data);
                         console.log("LOOK: inside getTaskList data = ", data);
                         data = JSON.parse(data);
                         taskModel.clearList();
                         for (var i = 0; i < data.length; i++){
                             taskModel.initTask(data[i].description, data[i].completed);
                         }
                     }
                }
                else{
                    alert("ERROR: data not returned from /gettasks/");
                }
                that.updateDisplay();
             });
        }

        TaskList.prototype.createTask = function createTask(name) {
            if(currentUser){
                $.get("/createTask/" + currentUser.name.toUpperCase() + "/d/" + name, function(data) {
                    if(data){
                    }else{
                        alert("ERROR: data not returned from /createTask/");
                    }
                });
            }
        }

        TaskList.prototype.updateTask = function updateTask(idx) {
            console.log("/updateTask/" + currentUser.name.toUpperCase() + "/d/" + taskModel.getTask(idx).name + "/c/" + taskModel.isComplete(idx));
            if(currentUser){
                $.get("/updateTask/" + currentUser.name.toUpperCase() + "/d/" + taskModel.getTask(idx).name + "/c/" + taskModel.isComplete(idx), function(data) {
                    if(data){
                        console.log("LOOK: just updated a task, data = ", data);
                    }else{
                        alert("ERROR: data not returned from /updateTask/");
                    }
                });
            }
        }

        TaskList.prototype.deleteTask = function deleteTask(idx) {
            if(currentUser){
                ///deleteTask/:name/d/:desc
                $.get("/deleteTask/" + currentUser.name.toUpperCase() + "/d/" + taskModel.getTask(idx).name, function(data) {
                    if(data){
                    }else{
                        alert("ERROR: data not returned from /deleteTask/");
                    }
                });
            }
        }

        /** Constructor
         * */
        function initTaskList(elementId, startUp) {
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

            if(taskModel.getListLength() > 0 || startUp) initList(elementId);

            //TODO: THIS IS FOR DUBUGGING PURPOSES TEMPORARILY
            if (debuggingMode) {
                debuggingMode = false;
                tempTaskInit();
            }
            function tempTaskInit() {
                var testLogin = {name : "Admin@nowhere.com", password : "password"};
                that.login(testLogin.name, testLogin.password);

                /*taskModel.initTask("Walk the dog");
                taskModel.initTask("Tell my wife I love her!");
                taskModel.initTask("Go sit outside");
                taskModel.initTask("Do the Dishes!!!!!!");*/
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

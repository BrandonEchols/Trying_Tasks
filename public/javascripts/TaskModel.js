/**
 * Created by Brandon on 8/28/2016.
 */
(function(global) {

    /** Constructor */
    var TaskModel = function TaskModel(){

        var model = {
            list : []
        }

        //Public functions
        this.getListLength = function getListLength(){
            return model.list.length;
        }
        this.isComplete = function isComplete(taskIdx)
        {
            if(taskIdx < model.list.length) {
                var queryComplete = model.list[taskIdx].isComplete;
                return queryComplete;
            }
            return false;
        }

        this.initTask = function initTask(name){
            var task = {
                name: name ? name : untitled, //This is the default name, untitled
                timeMade : "TBD", //TODO: timeMade = current time stamp
                isComplete : false
            }
            model.list[model.list.length] = task;
            this.displayTask(model.list.length - 1);
        }

        this.displayTask = function displayTask(i){
            var table = document.getElementById("TaskList");

            var row = document.createElement("TR");
            row.className = "task";
            var col = document.createElement("TH");
            col.innerHTML = "" + (i + 1);
            row.appendChild(col);

            var col = document.createElement("TD");
            col.innerHTML = "" + model.list[i].name;
            col.className += " taskName";
            row.appendChild(col);

            var col = document.createElement("TD");
            col.innerHTML = "" + model.list[i].timeMade;
            row.appendChild(col);

            var col = document.createElement("TD");
            if(model.list[i].isComplete) {
                col.innerHTML = "&#10003";
            }
            else{
                col.innerHTML = "&#10007";
            }
            row.appendChild(col);

            //Create a button that is either a complete button if the task
            //is not complete, or a remove button if it is complete
            var btn = document.createElement("BUTTON");
            btn.className += " button";
            if (model.list[i].isComplete == true)
            {
                var t = document.createTextNode("Remove");       // Create a text node
                btn.appendChild(t);
                btn.onclick = function () {
                    for (var j = i; j < model.list.length - 1; j++){
                        model.list[j] = model.list[j + 1];
                    }
                    model.list.splice(model.list.length - 1);
                    tl.updateDisplay();
                }
            }
            else {
                var t = document.createTextNode("Complete");       // Create a text node
                btn.appendChild(t);
                btn.onclick = function () {
                    model.list[i].isComplete = true;
                    tl.updateDisplay();
                }
            }
            row.appendChild(btn);
            table.appendChild(row);
        }

        //Private functions
        /*function initGrid(){

         var tiles = [];
         for(var i = 0; i < model.height * model.width; i++)
         {
         tiles.push(i);
         }
         shuffle(tiles);

         model.rows = [];
         for (var rowIdx = 0; rowIdx < model.height; rowIdx++){
         var row = [];
         for (var colIdx = 0; colIdx < model.width; colIdx++)
         {
         var cell = tiles[(rowIdx * model.width) + colIdx];
         row.push(cell);
         }
         model.rows.push(row);
         }
         }*/

        function init(){
            //TODO: If a saved task list is present, init saved list
        }

        init();
        return this;
    }

    /**
     * export for CommonJS style
     */
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = TaskModel;
    } else {
        global.TaskModel = TaskModel;
    }

}(this));


class DB {
    constructor() {
        this.user = window.localStorage.getItem('user');
        this.taskTime = 0;
        this.count = 0;
        this.id = 1;
        this.tasks = [];
    }


    get() {
        return this.tasks;
    }

    // post a task
    post(task) {
        if (task.time.h < 0 || task.time.m < 0) return "No negative values!"
        this.tasks.push({ id: this.id, name: task.name, description: task.description, date: task.date, time: task.time });
        this.count += 1;
        this.id += 1;
    }

    //deleta a task
    delete(id) {
        let target = this.tasks.find(obj => obj.id == id);
        this.tasks.splice(this.tasks.indexOf(target), 1);
        this.count -= 1;
    }

   //update a task
    put(task, id) {
        let target = this.tasks.find(obj => obj.id === id);
        console.log(target);
        console.log(task)
        const updateObj = { id: target.id };
        let name = task.name;
        let description = task.description;
        let date = task.date;
        let time = { h: task.time.h, m: task.time.m };
        if (name != '') updateObj.name = name;
        else updateObj.name = target.name;

        if (description != '') updateObj.description = description;
        else updateObj.description = target.description;

        if (time.h || time.m) {
            if (time.h < 0 || time.m < 0) {
                return "Cant do negative values"
            }
            updateObj.time = {};
            updateObj.time.h = time.h;
            updateObj.time.m = time.m;

            while (updateObj.time.m >= 60) {
                updateObj.time.m -= 60;
                updateObj.time.h += 1;
            }

        } else updateObj.time = target.time;
        if (date) updateObj.date = date; else updateObj.date = target.date;
        console.log(updateObj)     
        this.tasks[this.tasks.indexOf(target)] = updateObj;
        console.log(this.tasks[target])
        console.log(db.get());
    }

    // number of tasks
    getCount() {
        return this.count;
    }

    //  total time of the tasks
    getTotalTime() {
        let timeArray = this.tasks.map(
            obj => ({ h: obj.time.h, m: obj.time.m })
        )

        let totalObj = timeArray.reduce((acc, curr) => ({ h: acc.h + curr.h, m: acc.m + curr.m }));

        // minutes into hours 
        while (totalObj.m >= 60) {
            totalObj.m -= 60;
            totalObj.h += 1;
        }

        return totalObj;
    }

    getUserName() {
        return this.user;
    }
}

class Task {
    constructor(name, description, date, time) {
        this.name = name;
        this.description = description;
        this.date = date;
        this.time = time;
    }
}

const db = new DB("", 2);
db.post({ name: "task1", description: "descriere", date: Date.now(), time: { h: 3, m: 11 } })
db.post({ name: "task2", description: "descriere", date: Date.now(), time: { h: 4, m: 10 } })
db.post({ name: "task3", description: "descriere", date: Date.now(), time: { h: 9, m: 19 } })


class Render {

    render_target;

    component;

    set component(component) {
        this.component = component;
    }

    set main_componenet(prop) {
        this.main_componenet = prop;
    }

    static render(id, component) {
        this.render_target = document.querySelector(id);
        this.component = component;
        this.render_target.innerHTML = component;
    }

    static update(update) {
        this.render_target.innerHTML = update;
    }
}


function listRender(dataList) {
    return `
        ${dataList.map(x => `
            <div class="card mr5 mt5" style="${db.taskTime > x.time.h ? "color:black" : "color:yellow"}">
                <button id="update" class="main" onclick="toggleModal().open(${x.id})">Update</button>
                <button id="del" class="danger"value="${x.id}" onclick="deleteObject(event)">X</button>
                <p class="card-title">${x.name}</p>
                <p class="card-description">${x.description}</p>
                <p class="card-date">${x.date}</p>
                <p class="card-time">${x.time.h} : ${x.time.m}</p>
            </div>
        `).join('')}
    `;
}

function navbar() {
    return `
        <div class="navbar">  
            <div class="bold">
            <img src="images/logo.jpg" style="width: 15px">
            ${db.getUserName()}
        </div> 
		</div>
            <div class="bold mr5">Numarul total de ore lucrate: ${db.getTotalTime()}h</div>  
        </div>
		</div>
    `;
}

function inputForm() {
    return `
        <div id='taskForm'>
            <input type="text" placeholder="Titlul task-ului"/>
            <textarea width="50" height="50" resize="none" placeholder="Descrierea task-ului"></textarea>
            <input type="date" name="Date">
            <input 
                type="number" maxlength="2" name="hours" width="10" min="00" max="23" 
                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" /> 
            <b>:</b> 
            <input 
                type="number" name="minutes" width="10" min="00" max="60" maxlength="2" 
                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength)"/>
            <button id="send" onclick="addTask()">Send</button> 
        </div>
    `;
}

function maxHoursInput(prop) {
    return `
        <label>Stabilieste timpul pentru fiecare task</label>
        <input type="number" name="maxHours" width="10" 
               min="1" max="23" maxlength="1" 
               value="${prop}" maxlength="1" 
               oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength)"/>
        <button onclick="updateTaskTime(event)">Aplica</button>
    `;
}



function app() {
    return `${navbar()}
    <div id="taskList">
        <div>
            ${maxHoursInput(db.tasTime)}
        </div>
        ${listRender(db.get())}
    </div>
    ${inputForm()}
    ${toggleModal().component}
    `;
}


Render.render('#app', app());


function deleteObject(e) {
    // Delete
    db.delete(event.target.value);
    Render.update(app()) 
}

function addTask() {
    // Add 
    let form = document.querySelector('#taskForm').children;
    let title = form[0].value, desc = form[1].value, date = form[2].value, time = { h: form[3].value, m: form[5].value };
    db.post(new Task(title, desc, date, time))
    console.log(form)
    Render.update(app()) 
}

function toggleUpdateModal() {
    document.querySelector("#updateModal").style.display = "block";
}


function updateTask(e) {

    let form = document.querySelector('#taskForm').children;
    let title = form[0].value, desc = form[1].value, date = form[2].value, time = { h: form[3].value, m: form[5].value };
    db.post(new Task(title, desc, date, time))
    console.log(form)
    Render.update(app()) 
}
function updateMaxTime(e) {
    db.taskTime = e.target.value;
    Render.update(app()) 
}
function toggleModal() {
    this.target;
    return {
        component: `
        <div id="updateModal" style="display: none">
            <button onclick="toggleModal().close()">X</button>
            <input type="text" name="updateTitle" placeholder="Titlul task-ului"/>
            <textarea width="50" height="50" resize="none" placeholder="Titlul task-ului"></textarea>
            <input type="date" name="Date">
            <input 
                type="number" maxlength="2" name="hours" width="10" min="00" max="23" 
                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);" /> 
            <b>:</b> 
            <input 
                type="number" name="minutes" width="10" min="00" max="60" maxlength="2" 
                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength)"/>
            <button onclick="toggleModal().update()">Update</button>
        </div>
        `,
        close: function () {
            document.querySelector("#updateModal").style.display = "none";
        },
        open: function (prop) {
            document.querySelector("#updateModal").style.display = "block";
            target = prop
        },
        update: function () {
            console.log(target);
            let form = document.querySelector('#updateModal').children;
            console.log(form)
            let name = form[1].value, description = form[2].value, date = form[3].value, time = { h: form[4].value, m: form[6].value };
            let updateObj = { name, description, date, time }
            db.put(updateObj, target)
            Render.update(app()) 
        }
    }
}


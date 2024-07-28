const { Component, mount, xml, useState, useEnv, reactive } = owl;


class Task extends Component {
    static template = xml`  <div class="d-flex justify-content-between mt-3">
                    <div class="form-check align-self-center">
                        <input class="form-check-input" type="checkbox" value="" t-att-checked="props.task.isCompleted" t-on-click="()=>store.toggleTask(props.task)" t-att-id="props.task.id" />
                        <label class="form-check-label" t-att-for="props.task.id" t-attf-class="#{props.task.isCompleted ? 'text-decoration-line-through':''}">
                       <t t-esc="props.task.name" />
                        </label>
                    </div>
                    <button type="button" class="btn btn-danger" t-on-click="()=>store.deleteTask(props.task)">Delete</button>

                  </div>
                     `
    static props = ["task"]
    setup() {
        this.store = useStore();
    }
}


class Root extends Component {
    static template = xml`    
                <div class="input-group mb-3">
                    <input type="text" class="form-control" t-model="state.name" placeholder="Add new task"
                        aria-label="Add new task" aria-describedby="button-addon2"/>
                    <button class="btn btn-outline-secondary" type="button" t-on-click="addTask" id="button-addon2">Add</button>
                </div>

                <div t-foreach="store.tasks" t-as="task" t-key="task.id">
                     <Task task="task"/>
                 
                </div>
      `
    static components = { Task }
    setup() {
        this.store = useStore();
        this.state = useState({ name: "" })
    }
    addTask() {
        this.store.addTask(this.state.name);
        this.state.name = '';
    }
}
class TaskListStore {
    constructor(tasks) {
        this.tasks = tasks || [];
        const taskIds = this.tasks.map((t) => t.id);
        this.nextId = taskIds.length ? Math.max(...taskIds) + 1 : 1;
    }

    addTask(text) {
        text = text.trim();
        if (text) {
            const task = {
                id: this.nextId++,
                name: text,
                isCompleted: false,
            };
            this.tasks.push(task);
        }
    }

    toggleTask(task) {
        task.isCompleted = !task.isCompleted;
    }

    deleteTask(task) {

        const index = this.tasks.findIndex((t) => t.id === task.id);
        this.tasks.splice(index, 1);
    }
}
function useStore() {
    const env = useEnv();
    return useState(env.store);
}
function createTaskStore() {
    const taskStore = reactive(new TaskListStore([]));
    return taskStore;
}
const env = { store: createTaskStore() };
mount(Root, document.getElementById("root"), { env });

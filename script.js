document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task-input');
    const addTaskBtn = document.getElementById('submit-task-btn');
    const taskList = document.getElementById('tasks-list');
    const emptyImage = document.querySelector('.empty-state-image');
    const progressBar = document.getElementById('progress-indicator');
    const progressNumbers = document.getElementById('task-stats');

    //empty image toggle 
    const toggleEmptyState = () => {
        const isEmpty = taskList.children.length === 0;
        emptyImage.style.display = isEmpty ? 'block' : 'none';
    };

    // update progress bar
    const updateProgress = () => {
        const totalTask = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;
        const percent = totalTask?(completedTasks/totalTask)*100:0;

        progressBar.style.width = `${percent}%`;
        progressNumbers.textContent = `${completedTasks}/${totalTask}`;

        if (totalTask >0 && completedTasks === totalTask){
            const defaults = {
                spread: 360,
                ticks: 100,
                gravity: 0,
                decay: 0.94,
                startVelocity: 30,
                shapes: ["heart"],
                colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
              };
              
              confetti({
                ...defaults,
                particleCount: 50,
                scalar: 2,
              });
              
              confetti({
                ...defaults,
                particleCount: 25,
                scalar: 3,
              });
              
              confetti({
                ...defaults,
                particleCount: 10,
                scalar: 4,
              });
        }
    }


    const saveTasksToLocalStorage = () => {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text: li.querySelector('.task-text').textContent,
            completed: li.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const loadTasksFromLocalStorage = () => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(({ text, completed }) => {
            createTaskElement(text, completed);
        });
        toggleEmptyState();
        updateProgress();
    };


    const createTaskElement = (taskText, completed = false) => {
        const li = document.createElement('li');
        // li.textContent = taskText;
        li.innerHTML = `<input type="checkbox" class= "checkbox" ${completed ? 'checked' : ''}>
        <span class="task-text"> ${taskText}</span>
        <div class="task-buttons">
        <button class= "edit-btn"><i class= "fa-solid fa-pen"></i></button>
        <button class= "delete-btn"><i class= "fa-solid fa-trash"></i></button>
        </div>
        `

        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');
        const taskSpan = li.querySelector('.task-text');

        checkbox.addEventListener('change', () => {
            li.classList.toggle('completed', checkbox.checked);
            editBtn.disabled = checkbox.checked;
            editBtn.style.opacity = checkbox.checked ? '0.5' : '1';
            editBtn.style.pointerEvents = checkbox.checked ? 'none' : "auto";
            saveTasksToLocalStorage();
            updateProgress();
        });
        //edit function
        editBtn.addEventListener('click', () => {
            if (!checkbox.checked) {
                taskInput.value = li.querySelector('span').textContent;
                li.remove();
                toggleEmptyState();
                updateProgress();
            }
        });

        //delete function
        deleteBtn.addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
            saveTasksToLocalStorage();
            updateProgress();
        });

        editBtn.addEventListener('click', () => {
            if (checkbox.checked) return;
            const currentText = taskSpan.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            input.className = 'edit-input';
            li.replaceChild(input, taskSpan);
            input.focus();
            const saveEdit = () => {
                const newText = input.value.trim();
                if (newText) {
                    taskSpan.textContent = newText;
                    li.replaceChild(taskSpan, input);
                } else {
                    li.remove();
                    toggleEmptyState();
                }
            };
            input.addEventListener('blur', saveEdit);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') saveEdit();
            });
        });

        taskList.appendChild(li);
        updateProgress();
        taskInput.value = '';
        toggleEmptyState();
    };

    // Add new task
    const addTask = (Event) => {
        Event.preventDefault();
        const taskText = taskInput.value.trim();
        if (!taskText) { return; }
        createTaskElement(taskText);
        taskInput.value = '';
        toggleEmptyState();
        saveTasksToLocalStorage();
    };

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask(e);
        };
    });
    toggleEmptyState();
    loadTasksFromLocalStorage();
});
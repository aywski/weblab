const todo = {
    action(e) {
      const target = e.target;
      if (target.classList.contains('todo__action')) {
        const action = target.dataset.todoAction;
        const elemItem = target.closest('.todo__item');
        if (action === 'deleted' && elemItem.dataset.todoState === 'deleted') {
          elemItem.remove();
        } else {
          elemItem.dataset.todoState = action;
          const lexicon = {
            active: 'відновлено',
            completed: 'завершено',
            deleted: 'видаленно'
          };
          const elTodoDate = elemItem.querySelector('.todo__date');
          const html = `<span>${lexicon[action]}: ${new Date().toLocaleString().slice(0, -3)}</span>`;
          elTodoDate.insertAdjacentHTML('beforeend', html);
        }
        this.save();
      } else if (target.classList.contains('todo__add')) {
        this.add();
        this.save();
      }
    },
    add() {
      const elemText = document.querySelector('.todo__text');
      if (elemText.disabled || !elemText.value.length) {
        return;
      }
      document.querySelector('.todo__items').insertAdjacentHTML('beforeend', this.create(elemText.value));
      elemText.value = '';
    },
    create(text) {
      const date = JSON.stringify({ add: new Date().toLocaleString().slice(0, -3) });
      return `<li class="todo__item" data-todo-state="active" draggable="true">
        <span class="todo__task">
          ${text}
          <span class="todo__date" data-todo-date="${date}">
            <span>додано: ${new Date().toLocaleString().slice(0, -3)}</span>
          </span>
        </span>
        <span class="todo__action todo__action_restore" data-todo-action="active"></span>
        <span class="todo__action todo__action_complete" data-todo-action="completed"></span>
        <span class="todo__action todo__action_delete" data-todo-action="deleted"></span></li>`;
    },
    init() {
      const fromStorage = localStorage.getItem('todo');
      if (fromStorage) {
        document.querySelector('.todo__items').innerHTML = fromStorage;
      }
      
      // Drag-and-Drop functionality
        const items = document.querySelectorAll('.todo__items li');
            for (const item of items) {
                item.classList.add('draggable');
                item.addEventListener('dragstart', this.dragStart.bind(this));
            }
            document.addEventListener('dragover', this.dragOver.bind(this));
            document.addEventListener('drop', this.drop.bind(this));
        
            document.querySelector('.todo__options').addEventListener('change', this.update);
            document.addEventListener('click', this.action.bind(this));
    },
    update() {
      const option = document.querySelector('.todo__options').value;
      document.querySelector('.todo__items').dataset.todoOption = option;
      document.querySelector('.todo__text').disabled = option !== 'active';
    },
    dragStart(e) {
        // Check if the element has an id attribute
        if (!e.target.hasAttribute('id')) {
            // Add an id attribute
            e.target.setAttribute('id', Math.random().toString(36).substring(7));
        }
        
        // Set the data to be transferred
        e.dataTransfer.setData('text', e.target.id);
    },
    dragOver(e) {
        e.preventDefault();
    },
    dragStart(e) {
        // Check if the element has an id attribute
        if (!e.target.hasAttribute('id')) {
          // Add an id attribute
          e.target.setAttribute('id', Math.random().toString(36).substring(7));
        }
        
        // Set the data to be transferred
        e.dataTransfer.setData('text', e.target.id);
      },
      dragOver(e) {
        e.preventDefault();
      },
      drop(e) {
        const data = e.dataTransfer.getData('text');
        const droppedElement = document.getElementById(data);
        const targetElement = e.target;
        if (targetElement.classList.contains('todo__item')) {
          const droppedElementParent = droppedElement.parentElement;
          const targetElementParent = targetElement.parentElement;
          
          // Swap the elements using insertBefore()
          targetElementParent.insertBefore(droppedElement, targetElement);
          droppedElementParent.insertBefore(targetElement, droppedElement);
    
          todo.save();
        }
      },
      
      
            
    save() {
      localStorage.setItem('todo', document.querySelector('.todo__items').innerHTML);
    }
};
  
  todo.init();
  
enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}
class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, desc: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      desc,
      numOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;
  const { min, max, minLength, maxLength, required, value } = validatableInput;
  if (required) {
    isValid = isValid && value.toString().trim().length !== 0;
  }
  if (minLength != null && typeof value === 'string') {
    isValid = isValid && value.length >= minLength;
  }
  if (maxLength != null && typeof value === 'string') {
    isValid = isValid && value.length <= maxLength;
  }
  if (min != null && typeof value === 'number') {
    isValid = isValid && value >= min;
  }
  if (max != null && typeof value === 'number') {
    isValid = isValid && value <= max;
  }
  return isValid;
}

//////// METHOD DECORATOR ////////
function autobind(_: object, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}
//////// METHOD DECORATOR ////////

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  ELEMENT: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = <HTMLTemplateElement>(
      document.getElementById(templateId)
    );
    this.hostElement = document.getElementById(hostElementId) as T;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.ELEMENT = importedNode.firstElementChild as U;
    if (newElementId) {
      this.ELEMENT.id = newElementId;
    }
    this.attach(insertAtStart);
  }
  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? 'afterbegin' : 'beforeend',
      this.ELEMENT
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

// Single Project Class
class SingleProject extends Component<HTMLElement, HTMLLIElement> {
  constructor() {
    super('single-project', 'project', false);
    this.configure();
    this.renderContent();
  }
  configure() {
    console.log("I'm in Single Project");
    console.log('Single Project', this);
  }
  renderContent() {}
}
// Single Project Class

// ProjectList Class
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  configure() {
    const _this = this;
    projectState.addListener(function (projects: Project[]) {
      const relevantProjects = projects.filter(function (proj) {
        return _this.type === 'active'
          ? proj.status === ProjectStatus.Active
          : proj.status === ProjectStatus.Finished;
      });

      _this.assignedProjects = relevantProjects;
      _this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.ELEMENT.querySelector('ul')!.id = listId;
    this.ELEMENT.querySelector('h2')!.textContent =
      this.type.toUpperCase() + 'PROJECTS';
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    ) as HTMLUListElement;
    listEl.innerHTML = '';
    for (const prjItem of this.assignedProjects) {
      const listItem = document.createElement('ul');
      listItem.textContent = prjItem.title;
      listEl.appendChild(listItem);
    }
  }
}

// ProjectInput Class
class ProjectInput extends Component<HTMLInputElement, HTMLElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;
  constructor() {
    super('project-input', 'app', true, 'user-input');

    this.titleInputElement = this.ELEMENT.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionInputElement = this.ELEMENT.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.peopleInputElement = this.ELEMENT.querySelector(
      '#people'
    ) as HTMLInputElement;

    this.configure();
    this.renderContent();
  }
  configure() {
    this.ELEMENT.addEventListener('submit', this.submitHandler);
  }
  renderContent() {}

  private gatherUserInput(): [string, string, number] | void {
    const title = this.titleInputElement.value;
    const people = this.peopleInputElement.value;
    const description = this.descriptionInputElement.value;

    const titleValidatable: Validatable = {
      value: title,
      required: true,
    };
    const peopleValidatable: Validatable = {
      value: +people,
      required: true,
      min: 1,
    };
    const descriptionValidatable: Validatable = {
      value: description,
      required: true,
      minLength: 5,
    };
    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert('invalid input, please try again.');
      return;
    }
    return [title, description, parseFloat(people)];
  }

  @autobind
  private submitHandler(event: Event) {
    event && event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      this.clear();
    }
    return;
  }

  private clear() {
    this.titleInputElement.value = '';
    this.peopleInputElement.value = '';
    this.descriptionInputElement.value = '';
  }
}

// const project = new ProjectInput();
// const activePrjList = new ProjectList('active');
// const finshedPrjList = new ProjectList('finished');
const singleProject = new SingleProject();

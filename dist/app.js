"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
var Project = /** @class */ (function () {
    function Project(id, title, description, people, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.people = people;
        this.status = status;
    }
    return Project;
}());
var ProjectState = /** @class */ (function () {
    function ProjectState() {
        this.listeners = [];
        this.projects = [];
        //...
    }
    ProjectState.getInstance = function () {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    };
    ProjectState.prototype.addListener = function (listenerFn) {
        this.listeners.push(listenerFn);
    };
    ProjectState.prototype.addProject = function (title, desc, numOfPeople) {
        var newProject = new Project(Math.random().toString(), title, desc, numOfPeople, ProjectStatus.Active);
        this.projects.push(newProject);
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var listenerFn = _a[_i];
            listenerFn(this.projects.slice());
        }
    };
    return ProjectState;
}());
var projectState = ProjectState.getInstance();
function validate(validatableInput) {
    var isValid = true;
    var min = validatableInput.min, max = validatableInput.max, minLength = validatableInput.minLength, maxLength = validatableInput.maxLength, required = validatableInput.required, value = validatableInput.value;
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
function autobind(_, _2, descriptor) {
    var originalMethod = descriptor.value;
    var adjDescriptor = {
        configurable: true,
        get: function () {
            var boundFn = originalMethod.bind(this);
            return boundFn;
        },
    };
    return adjDescriptor;
}
//////// METHOD DECORATOR ////////
// Single Project Class
var SingleProject = /** @class */ (function () {
    function SingleProject() {
        this.templateElement = document.getElementById('single-project');
        // const importedNode = document.importNode(
        //   this.templateElement.content,
        //   true
        // );
        this.liElement = this.templateElement.querySelector('li');
    }
    return SingleProject;
}());
// Single Project Class
var Component = /** @class */ (function () {
    function Component(templateId, hostElementId, insertAtStart, newElementId) {
        this.templateElement = (document.getElementById(templateId));
        this.hostElement = document.getElementById(hostElementId);
        var importedNode = document.importNode(this.templateElement.content, true);
        this.ELEMENT = importedNode.firstElementChild;
        if (newElementId) {
            this.ELEMENT.id = newElementId;
        }
        this.attach(insertAtStart);
    }
    Component.prototype.attach = function (insertAtBeginning) {
        this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.ELEMENT);
    };
    return Component;
}());
// ProjectList Class
var ProjectList = /** @class */ (function (_super) {
    __extends(ProjectList, _super);
    function ProjectList(type) {
        var _this_1 = _super.call(this, 'project-list', 'app', false, type + "-projects") || this;
        _this_1.type = type;
        _this_1.assignedProjects = [];
        _this_1.configure();
        _this_1.renderContent();
        return _this_1;
    }
    ProjectList.prototype.renderProjects = function () {
        var listEl = document.getElementById(this.type + "-projects-list");
        listEl.innerHTML = '';
        for (var _i = 0, _a = this.assignedProjects; _i < _a.length; _i++) {
            var prjItem = _a[_i];
            var listItem = document.createElement('ul');
            listItem.textContent = prjItem.title;
            listEl.appendChild(listItem);
        }
    };
    ProjectList.prototype.configure = function () {
        console.log(this);
        var _this = this;
        projectState.addListener(function (projects) {
            var relevantProjects = projects.filter(function (proj) {
                return _this.type === 'active'
                    ? proj.status === ProjectStatus.Active
                    : proj.status === ProjectStatus.Finished;
            });
            _this.assignedProjects = relevantProjects;
            _this.renderProjects();
        });
    };
    ProjectList.prototype.renderContent = function () {
        var listId = this.type + "-projects-list";
        this.ELEMENT.querySelector('ul').id = listId;
        this.ELEMENT.querySelector('h2').textContent =
            this.type.toUpperCase() + 'PROJECTS';
    };
    return ProjectList;
}(Component));
// ProjectInput Class
var ProjectInput = /** @class */ (function (_super) {
    __extends(ProjectInput, _super);
    function ProjectInput() {
        var _this_1 = _super.call(this, 'project-input', 'app', true, 'user-input') || this;
        _this_1.titleInputElement = _this_1.ELEMENT.querySelector('#title');
        _this_1.descriptionInputElement = _this_1.ELEMENT.querySelector('#description');
        _this_1.peopleInputElement = _this_1.ELEMENT.querySelector('#people');
        _this_1.configure();
        _this_1.getThis();
        return _this_1;
    }
    ProjectInput.prototype.renderContent = function () { };
    ProjectInput.prototype.getThis = function () {
        console.log(this);
        this.renderContent();
    };
    ProjectInput.prototype.gatherUserInput = function () {
        var title = this.titleInputElement.value;
        var people = this.peopleInputElement.value;
        var description = this.descriptionInputElement.value;
        var titleValidatable = {
            value: title,
            required: true,
        };
        var peopleValidatable = {
            value: +people,
            required: true,
            min: 1,
        };
        var descriptionValidatable = {
            value: description,
            required: true,
            minLength: 5,
        };
        if (!validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)) {
            alert('invalid input, please try again.');
            return;
        }
        return [title, description, parseFloat(people)];
    };
    ProjectInput.prototype.submitHandler = function (event) {
        event && event.preventDefault();
        var userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            var title = userInput[0], description = userInput[1], people = userInput[2];
            projectState.addProject(title, description, people);
            this.clear();
        }
        return;
    };
    ProjectInput.prototype.clear = function () {
        this.titleInputElement.value = '';
        this.peopleInputElement.value = '';
        this.descriptionInputElement.value = '';
    };
    ProjectInput.prototype.configure = function () {
        this.ELEMENT.addEventListener('submit', this.submitHandler);
    };
    __decorate([
        autobind
    ], ProjectInput.prototype, "submitHandler", null);
    return ProjectInput;
}(Component));
var project = new ProjectInput();
var activePrjList = new ProjectList('active');
// const finshedPrjList = new ProjectList('finished');
//# sourceMappingURL=app.js.map
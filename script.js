var viewModal = document.getElementById('view-modal');
var modalContent = document.getElementById('modal-content');
var plusBtn = document.getElementById('plusBtn');
var taskList = document.getElementById('task-list');

var LIST;
var data = localStorage.getItem('lists');

var edit = false;

if (data) {
    LIST = JSON.parse(data);
    loadList();
} else {
    LIST = [];
}

function addTask(id, title, date) {
    const li = `<li class="list-item" id="${id}">
    <i class="fa-solid fa-file file-icon"></i>
    <p class="task-name"><strong>${title}</strong></p>
    <p class="task-time">${date}</p>
    <div class="option-list">
        <i class="fa-solid fa-pen-to-square edit"></i>
        <i class="fa-solid fa-download download"></i>
        <i class="fa-solid fa-trash-can delete"></i>
    </div>
    </li>`;
    taskList.insertAdjacentHTML('afterbegin', li);
}

function pushToList(title_input, content_input, date_input) {
    LIST.push({
        title: title_input,
        content: content_input,
        id: LIST.length,
        date: date_input,
    });
    localStorage.setItem('lists', JSON.stringify(LIST));
}

function loadList() {
    for (var i = 0; i < LIST.length; i++) {
        addTask(LIST[i].id, LIST[i].title, LIST[i].date);
    }
}

taskList.addEventListener('click', function (event) {
    const element = event.target;
    var ID;
    if (element.className == 'list-item') {
        ID = element.id;
    } else if (element.className == "fa-solid fa-file file-icon"
        || element.className == "task-name" || element.className == "task-time") {
        ID = element.parentElement.id;
    } else {
        ID = element.parentElement.parentElement.id;
    }

    sessionStorage.setItem('IDTemp', ID);
    sessionStorage.setItem('TitleTemp', LIST[ID].title);
    sessionStorage.setItem('ContentTemp', LIST[ID].content);

    if (element.className == 'list-item' || element.className == "fa-solid fa-file file-icon"
        || element.className == "task-name" || element.className == "task-time") {
        const temp = `<h3 class="file-title">${LIST[ID].title}</h3>
                    <p class="file-content">${LIST[ID].content}</p>`;
        modalContent.innerHTML = temp;
        viewModal.style.display = "block";
    }

    if (element.className == 'fa-solid fa-pen-to-square edit') {
        location.href = 'edit-task.html';
        edit = true;
        sessionStorage.setItem('isEdit', edit);
    }

    if (element.className == 'fa-solid fa-trash-can delete') {
        element.parentElement.parentElement.remove();
        LIST.splice(ID, 1);
        for (var i = ID; i < LIST.length; i++) {
            LIST[i].id--;
        }
        localStorage.setItem('lists', JSON.stringify(LIST));
    }

    if (element.className == 'fa-solid fa-download download') {
        var base64doc = btoa(unescape(encodeURIComponent(LIST[ID].content))),
            a = document.createElement('a'),
            e = new MouseEvent('click');

        a.download = `${LIST[ID].title}.txt`;
        a.href = 'data:text/plain;base64,' + base64doc;
        a.dispatchEvent(e);
    }
});

window.onclick = function (event) {
    if (event.target == viewModal) {
        viewModal.style.display = "none";
    }
}

plusBtn.onclick = function () {
    location.href = "add-task.html";
}

function clickOnAddBtn() {
    var titleInput = document.getElementById('task-title').value;
    var contentInput = tinymce.get('task-content').getContent().replace(/(<([^>]+)>)/ig, '');
    var date = new Date().toLocaleString();
    if (titleInput == '' || contentInput == '') {
        alert("Tên file hoặc nội dung file đang bị bỏ trống!");
        return;
    }
    pushToList(titleInput, contentInput, date);
    location.href = "index.html";
    addTask(LIST.length - 1, titleInput, date);
}

function clickOnCancelBtn() {
    location.href = "index.html";
}

function clickOnChangeBtn() {
    var titleInput = document.getElementById('task-title-change').value;
    var contentInput = tinymce.get('task-content-change').getContent().replace(/(<([^>]+)>)/ig, '');
    var date = new Date().toLocaleString();
    if (titleInput == '' || contentInput == '') {
        alert("Tên file hoặc nội dung file đang bị bỏ trống!");
        return;
    }

    sessionStorage.setItem('TitleTemp', titleInput);
    sessionStorage.setItem('ContentTemp', contentInput);
    sessionStorage.setItem('DateTemp', date);

    var i = JSON.parse(sessionStorage.getItem('IDTemp'));
    LIST[i].title = titleInput;
    LIST[i].content = contentInput;
    LIST[i].date = date;
    localStorage.setItem('lists', JSON.stringify(LIST));
    location.href = 'index.html';
    loadList();
}
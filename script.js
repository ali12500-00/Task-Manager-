const formbtn = document.querySelector("header button");
const form = document.querySelector("#form-section");
let myform = document.querySelector("form");
const close = document.querySelector(".form i");
let title = document.querySelector("#title");
let category = document.querySelector("#category");
const submitForm = document.querySelector("form .btn");
let taskSection = document.querySelector(".tasks-section");
let taskcounter = document.querySelector(".taskcounter");
formbtn.addEventListener("click", function () {
  form.style.display = "flex";
});
close.addEventListener("click", function () {
  form.style.display = "none";
});
// form.addEventListener("click",function(){
// form.style.display="none"
// })

const tasks = [];
let select = document.querySelector("select");

// function filtersUi() {
//   select.innerHTML=""
//   let taskFilter = tasks.map((elem) => elem.category);
//   let filters = new Set(taskFilter);

//   console.log(filters)
//   filters.forEach((elem)=>{
//
//       select.appendChild(option);
//   })

function filtersUi() {
  select.innerHTML = "";
  let option = document.createElement("option");
  option.textContent = "All";
  select.appendChild(option);
  option.value = "all";

  let filters = tasks.reduce(function (acc, current) {
    if (!acc.includes(current.category)) {
      acc.push(current.category);
    }
    return acc;
  }, []);
  filters.forEach((elem) => {
    let option = document.createElement("option");
    option.textContent = elem;
    option.value = elem;
    select.appendChild(option);
  });
}

let pending = document.querySelector(".pending");
let complete = document.querySelector(".complete");

let statusList = ["Pending", "In-Proc", "Complete"];
let currentStatus;
function ui(list = tasks) {
  taskSection.innerHTML = "";

  list.forEach((elem, index) => {
    let div = document.createElement("div");
    div.innerHTML = `<div class="task">
      <div class="left-box">
        <i class="ri-todo-line"></i>
      </div>
      <div class="right-box">
        <div class="heading">
          <h3>${elem.title}</h3>
          <h4>${elem.category}</h4>
        </div>
        <div class="option">
          <h5>Status: <span class="status-bar">${elem.status}</span></h5>
          <div>
            <i class="ri-shield-check-line" title="next"></i>
            <i class="ri-edit-line" title="Edit"  onclick="editTask('${elem.title}')"></i>
            <i class="ri-delete-bin-line" title="Delete" onclick="deleteTask('${elem.title}')"></i>
          </div>
        </div>
      </div>
    </div>`;

    const pendingCount = tasks.filter(
      (elem) => elem.status === "Pending",
    ).length;
    pending.innerHTML = pendingCount;
    const completeCount = tasks.filter(
      (elem) => elem.status === "Complete",
    ).length;
    complete.innerHTML = completeCount;
    div
      .querySelector(".ri-shield-check-line")
      .addEventListener("click", function () {
        let current = statusList.indexOf(elem.status);
        let next = (current + 1) % statusList.length;
        elem.status = statusList[next];
        currentStatus = next;
        filtersUi();
  ui(getVisibleTasks())
      });
    taskSection.appendChild(div);
  });
}
let updateIndex = null;
let updateStatus = null;

const editTask = (name) => {
  form.style.display = "flex";
  taskSection.innerHTML = "";
  let updateTask = tasks.find((elem) => elem.title == name);
  updateStatus = updateTask.status;
  updateIndex = tasks.findIndex((elem) => elem.title === name);
  updateStatus = tasks[updateIndex].status;

  title.value = updateTask.title;
  category.value = updateTask.category;

 filtersUi();
  ui(getVisibleTasks())

  tasks.splice(updateIndex, 1);
};
const getVisibleTasks=()=>{
  const category=select.value;
  return category==="all"? tasks : tasks.filter((elem) => elem.category === category);
}
select.addEventListener("change", () => {
  ui(getVisibleTasks())
});
const deleteTask = (name) => {
  let deletetask = tasks.findIndex((elem) => elem.title == name);
  tasks.splice(deletetask, 1);
  taskcounter.innerHTML = tasks.length;
  if (tasks.length == []) {
    pending.innerHTML = 0;
    complete.innerHTML = 0;
  }

  filtersUi();
  ui(getVisibleTasks())
};

submitForm.addEventListener("click", function (e) {
  e.preventDefault();
  taskSection.innerHTML = "";
  let obj = {
    title: title.value,
    category: category.value,
    status: "Pending",
  };
  if (updateIndex !== null) {
    tasks[updateIndex] = obj;
    obj.status = updateStatus;
    updateIndex = null;
    updateStatus = null;
  } else {
    tasks.push(obj);
  }

  myform.reset();
  form.style.display = "none";
  taskcounter.innerHTML = tasks.length;

  filtersUi();
  ui(getVisibleTasks())
});

const search = document.querySelector("#seaching");

search.addEventListener("input", function () {
  const value = search.value.toLowerCase();

  const filteredTasks = getVisibleTasks().filter((task) =>
    task.title.toLowerCase().includes(value),
  );

  if (value == "") {
      filtersUi();
    ui(getVisibleTasks())
  } else {
    function ui2() {
      taskSection.innerHTML = "";

      filteredTasks.forEach((elem, index) => {
        let div = document.createElement("div");
        div.innerHTML = `<div class="task">
      <div class="left-box">
        <i class="ri-todo-line"></i>
      </div>
      <div class="right-box">
        <div class="heading">
          <h3>${elem.title}</h3>
          <h4>${elem.category}</h4>
        </div>
        <div class="option">
          <h5>Status: <span class="status-bar">${elem.status}</span></h5>
          <div>
            <i class="ri-shield-check-line" title="next"></i>
            <i class="ri-edit-line" title="Edit"  onclick="editTask('${elem.title}')"></i>
            <i class="ri-delete-bin-line" title="Delete" onclick="deleteTask('${elem.title}')"></i>
          </div>
        </div>
      </div>
    </div>`;

        const pendingCount = tasks.filter(
          (elem) => elem.status === "Pending",
        ).length;
        pending.innerHTML = pendingCount;
        const completeCount = tasks.filter(
          (elem) => elem.status === "Complete",
        ).length;
        complete.innerHTML = completeCount;
        div
          .querySelector(".ri-shield-check-line")
          .addEventListener("click", function () {
            let current = statusList.indexOf(elem.status);
            let next = (current + 1) % statusList.length;
            elem.status = statusList[next];
            currentStatus = next;
            ui(showtask);
          });
        taskSection.appendChild(div);
      });
    }
    ui2();
  }
});

// const card=document.querySelectorAll(".card")
// const statsIcon=document.querySelector(".card i")
// card.addEventListener("mouseenter",function(){
//     statsIcon.style.backgroundColor="#eee7d8"
// })

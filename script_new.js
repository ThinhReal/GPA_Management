// Function to calculate GPA based on user input (grade and credit)
function addRow() {
    const container = document.getElementById("extra-rows-container");
    const row = document.createElement("div");
    row.className = "input-container";
    row.innerHTML = `<div class="course-name-column">
            <input type="text" class="course-name" placeholder="Enter course name">
            </div>
            <div class="credit-column">
              <select class="credit">
                <option value="">Select Credit</option>
                <option value=12>12</option>
                <option value=24>24</option>
              </select>
           </div>
            <div class="grade-column">
            <input type="number" class="grade" placeholder="Enter grade">
         </div>`;
    container.appendChild(row);
    
    // Add event listeners to the new grade input
    const newGradeInput = row.querySelector('.grade');
    
    // When input is focused
    newGradeInput.addEventListener('focus', function() {
        this.placeholder = '';
        this.classList.remove('grade-placeholder');
    });

    // When input is clicked
    newGradeInput.addEventListener('click', function() {
        this.placeholder = '';
        this.classList.remove('grade-placeholder');
    });

    // When input loses focus (blur)
    newGradeInput.addEventListener('blur', function() {
        if (!this.value) {  // If input is empty
            this.placeholder = 'Enter grade';
        }
    });

    // Save to local storage after adding row
    saveToLocalStorage();
}

function removeRow() {
  const container = document.getElementById("extra-rows-container");
  const rows = container.getElementsByClassName("input-container");
  
  if (rows && rows.length > 0) {
    const lastRow = rows[rows.length - 1];
    container.removeChild(lastRow);
    // Save after removing row
    saveToLocalStorage();
  } else {
    alert("Cannot remove the first row!");
  }
}

// Initialize yearCount
let yearCount = 1;

function addYear() {
    if (yearCount >= 4) {
        alert("You can only add up to 4 years!");
        return;
    }
    
    // Save current year state before adding new year
    const currentActiveYear = document.querySelector('.extra-year.active-year');
    if (currentActiveYear) {
        const currentYearNumber = parseInt(currentActiveYear.innerHTML.split(' ')[1]);
        saveCurrentYearState(currentYearNumber);
    }
    
    yearCount++;
    
    // Create and add the new year button
    const extraYear = document.querySelector(".extra-year-container");
    const year = document.createElement("button");
    year.className = "extra-year";
    year.innerHTML = `Year ${yearCount}`;
    year.onclick = function() { moveToYear(yearCount); }; // Use function to ensure proper binding
    extraYear.appendChild(year);
    
    // Initialize storage for the new year if it doesn't exist
    if (!localStorage.getItem(`year${yearCount}Data`)) {
        // Initialize empty state for the new year
        localStorage.setItem(`year${yearCount}Data`, JSON.stringify({
            courses: [{
                courseName: "",
                credit: "",
                grade: ""
            }]
        }));
        
        // Set default HTML structure for the new year
        const defaultHTML = `
            <div class="input-container first-row">
                <div class="course-name-column">
                    <p>Course Name</p>
                    <input type="text" class="course-name" placeholder="Enter course name">
                </div>
                <div class="credit-column">
                    <p>Credits</p>
                    <select class="credit">
                        <option value="">Select Credit</option>
                        <option value="12">12</option>
                        <option value="24">24</option>
                    </select>
                </div>
                <div class="grade-column">
                    <p>Grade</p>
                    <input type="number" class="grade" placeholder="Enter grade">
                </div>
            </div>
            <div id="extra-rows-container"></div>
        `;
        localStorage.setItem(`year${yearCount}HTML`, defaultHTML);
        
        // Initialize GPAs
        localStorage.setItem(`year${yearCount}TargetGPA`, "");
        localStorage.setItem(`year${yearCount}CurrentGPA`, "");
    }
    
    // Switch to the new year
    moveToYear(yearCount);
}

function removeYear() {
    if (yearCount <= 1) {
        alert("Cannot remove Year 1!");
        return;
    }
    
    const extraYear = document.querySelector(".extra-year-container");
    const years = extraYear.getElementsByClassName("extra-year");
    if (years.length > 0) {
        const yearToRemove = years[years.length - 1];
        const yearNumber = yearToRemove.innerHTML.split(' ')[1];
        
        // If we're removing the active year, switch to the previous year first
        if (yearToRemove.classList.contains('active-year')) {
            moveToYear(yearCount - 1);
        }
        
        // Remove the year button
        extraYear.removeChild(yearToRemove);
        yearCount--;
        
        // Clean up storage for the removed year
        localStorage.removeItem(`year${yearNumber}Data`);
        localStorage.removeItem(`year${yearNumber}HTML`);
        localStorage.removeItem(`year${yearNumber}TargetGPA`);
        localStorage.removeItem(`year${yearNumber}CurrentGPA`);
    }
}
function moveToYear(year) {
    if (!year) return;
    
    const currentActiveYear = document.querySelector('.extra-year.active-year');
    if (currentActiveYear) {
        // Save current year's data and state
        const currentYearNumber = currentActiveYear.innerHTML.split(' ')[1];
        saveCurrentYearState(currentYearNumber);
    }

    // Load the selected year's data and state
    loadYearState(year);

    // Update active year styling
    document.querySelectorAll('.extra-year').forEach(btn => {
        btn.classList.remove('active-year');
        if (btn.innerHTML === `Year ${year}`) {
            btn.classList.add('active-year');
        }
    });

    // Add event listeners to the loaded inputs
    addInputEventListeners();
    
    // Reset current GPA display
    document.getElementById("current-GPA").innerHTML = "";
}

function saveCurrentYearState(yearNumber) {
    const container = document.getElementById("large-input-container");
    
    // Save the HTML structure
    localStorage.setItem(`year${yearNumber}HTML`, container.innerHTML);
    
    // Save the courses data
    saveCurrentYearData();
    
    // Save target GPA
    const targetGPA = document.getElementById("target-GPA").value;
    localStorage.setItem(`year${yearNumber}TargetGPA`, targetGPA);
    
    // Save current GPA
    const currentGPA = document.getElementById("current-GPA").innerHTML;
    localStorage.setItem(`year${yearNumber}CurrentGPA`, currentGPA);
}

function loadYearState(year) {
    const targetYear = document.getElementById("large-input-container");
    
    // Try to load saved HTML for the selected year
    const savedHTML = localStorage.getItem(`year${year}HTML`);
    if (savedHTML) {
        // If we have saved HTML for this year, use it
        targetYear.innerHTML = savedHTML;
    } else {
        // If no saved HTML exists, create default structure
        targetYear.innerHTML = `
            <div class="input-container first-row">
                <div class="course-name-column">
                    <p>Course Name</p>
                    <input type="text" class="course-name" placeholder="Enter course name">
                </div>
                <div class="credit-column">
                    <p>Credits</p>
                    <select class="credit">
                        <option value="">Select Credit</option>
                        <option value="12">12</option>
                        <option value="24">24</option>
                    </select>
                </div>
                <div class="grade-column">
                    <p>Grade</p>
                    <input type="number" class="grade" placeholder="Enter grade">
                </div>
            </div>
            <div id="extra-rows-container"></div>
        `;
    }

    // Load the year's data
    const yearData = localStorage.getItem(`year${year}Data`);
    if (yearData) {
        const data = JSON.parse(yearData);
        
        // Fill in the first row
        const firstRow = targetYear.querySelector(".input-container");
        if (firstRow && data.courses[0]) {
            firstRow.querySelector(".course-name").value = data.courses[0].courseName || '';
            firstRow.querySelector(".credit").value = data.courses[0].credit || '';
            firstRow.querySelector(".grade").value = data.courses[0].grade || '';
        }

        // Fill in additional rows
        const container = targetYear.querySelector("#extra-rows-container");
        for (let i = 1; i < data.courses.length; i++) {
            if (!container.children[i-1]) {
                // Create new row if it doesn't exist
                const row = document.createElement("div");
                row.className = "input-container";
                row.innerHTML = `
                    <div class="course-name-column">
                        <input type="text" class="course-name" value="${data.courses[i].courseName || ''}" placeholder="Enter course name">
                    </div>
                    <div class="credit-column">
                        <select class="credit">
                            <option value="" ${!data.courses[i].credit ? 'selected' : ''}>Select Credit</option>
                            <option value="12" ${data.courses[i].credit === '12' ? 'selected' : ''}>12</option>
                            <option value="24" ${data.courses[i].credit === '24' ? 'selected' : ''}>24</option>
                        </select>
                    </div>
                    <div class="grade-column">
                        <input type="number" class="grade" value="${data.courses[i].grade || ''}" placeholder="Enter grade">
                    </div>
                `;
                container.appendChild(row);
            } else {
                // Update existing row
                const row = container.children[i-1];
                row.querySelector(".course-name").value = data.courses[i].courseName || '';
                row.querySelector(".credit").value = data.courses[i].credit || '';
                row.querySelector(".grade").value = data.courses[i].grade || '';
            }
        }
    }
    
    // Load target GPA
    const savedTargetGPA = localStorage.getItem(`year${year}TargetGPA`);
    if (savedTargetGPA) {
        document.getElementById("target-GPA").value = savedTargetGPA;
    } else {
        document.getElementById("target-GPA").value = "";
    }
    
    // Load current GPA
    const savedCurrentGPA = localStorage.getItem(`year${year}CurrentGPA`);
    if (savedCurrentGPA) {
        document.getElementById("current-GPA").innerHTML = savedCurrentGPA;
    } else {
        document.getElementById("current-GPA").innerHTML = "";
    }
}

function saveCurrentYearData() {
    // Get current active year
    const activeYear = document.querySelector('.extra-year.active-year');
    if (!activeYear) return;
    
    const yearNumber = activeYear.innerHTML.split(' ')[1];
    
    const rows = [
        document.querySelector(".input-container"),
        ...document.querySelectorAll("#extra-rows-container .input-container")
    ];

    const coursesData = rows.map(row => ({
        courseName: row.querySelector(".course-name").value,
        credit: row.querySelector(".credit").value,
        grade: row.querySelector(".grade").value,
        placeholder: row.querySelector(".grade").placeholder,
        hasPlaceholderClass: row.querySelector(".grade").classList.contains("grade-placeholder")
    }));

    // Save courses data
    localStorage.setItem(`year${yearNumber}Data`, JSON.stringify({
        courses: coursesData
    }));
    
    // Save current HTML state
    const container = document.getElementById("large-input-container");
    localStorage.setItem(`year${yearNumber}HTML`, container.innerHTML);
    
    // Save GPAs
    localStorage.setItem(`year${yearNumber}TargetGPA`, document.getElementById("target-GPA").value);
    localStorage.setItem(`year${yearNumber}CurrentGPA`, document.getElementById("current-GPA").innerHTML);
}

function addInputEventListeners() {
    // Add event listeners to grade inputs
    document.querySelectorAll('.grade').forEach(input => {
        input.addEventListener('focus', function() {
            this.placeholder = '';
            this.classList.remove('grade-placeholder');
        });
        
        input.addEventListener('click', function() {
            this.placeholder = '';
            this.classList.remove('grade-placeholder');
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.placeholder = 'Enter grade';
            }
        });
    });

    // Add change event listeners for saving
    document.querySelectorAll('.course-name, .credit, .grade').forEach(input => {
        input.addEventListener('change', function() {
            saveCurrentYearData();
        });
    });
}

function calculateTotalGPA() {
  const rows = [ 
    document.querySelector(".input-container"),
    ...document.querySelectorAll("#extra-rows-container .input-container")
  ];
  
  let totalCredits = 0;
  let totalGradePoints = 0;

  rows.forEach((row) => {
    const creditSelect = row.querySelector(".credit");
    const gradeInput = row.querySelector(".grade");
    // Stop when Grade is entered but Credit is not
    if(!creditSelect.value && gradeInput.value) {
      alert("Please select credit for the course with grade");
      return;
    }

    if (!creditSelect.value || !gradeInput.value) {   // Only calculate if both credit and grade are entered
      
      return;
    }
    
    const creditNumber = parseFloat(creditSelect.value);
    const grade = parseFloat(gradeInput.value);

    if (grade < 50 || grade > 100) {
      alert("Please enter valid grades between 50 and 100 because you have to pass the course (grade >= 50) to get GPA");
      return;
    }

    let gradePointValue;
    if (grade >= 80) gradePointValue = 4;
      else if (grade >= 70) gradePointValue = 3;
      else if (grade >= 60) gradePointValue = 2;
      else if (grade >= 50) gradePointValue = 1;
      else alert("You have to pass the course (grade >= 50) to get GPA");

    totalCredits += creditNumber;
    totalGradePoints += creditNumber * gradePointValue;
  });


  const GPA = totalGradePoints / totalCredits;
  document.getElementById("current-GPA").innerHTML = GPA.toFixed(2);
  
  // Save after calculating GPA
  saveToLocalStorage();
}

function suggest() {
  calculateTotalGPA(); // cập nhật GPA hiện tại nếu có thay đổi

  const targetGPA = parseFloat(document.getElementById("target-GPA").value);

  // Kiểm tra giá trị nhập vào
  if(!targetGPA) {
    alert("Please enter a target GPA to get suggestions!");
    return;
  }
  if (targetGPA < 0 || targetGPA > 4 ) {
    alert("Please enter a valid target GPA between 0 and 4");
    return;
  }

  // Lấy tất cả các dòng (bao gồm dòng đầu + các dòng thêm)
  const rows = [
    document.querySelector(".input-container"),
    ...document.querySelectorAll("#extra-rows-container .input-container")
  ];

  let totalCredits = 0;           // Tổng số tín chỉ của tất cả môn
  let totalGradePoints = 0;       // Tổng điểm đã có (grade × credit)
  let coursesToSuggest = [];      // Danh sách các môn chưa nhập grade

  // Duyệt qua từng dòng
  rows.forEach((row) => {
    const creditSelect = row.querySelector(".credit");
    const gradeInput = row.querySelector(".grade");

    if (!creditSelect.value) return; // nếu chưa chọn tín chỉ → bỏ qua

    const creditNumber = parseFloat(creditSelect.value);

    if (gradeInput.value) {
      const grade = parseFloat(gradeInput.value);
      let gradePointValue;
      // Chuyển điểm phần trăm → thang GPA (4.0)
      if (grade >= 80) gradePointValue = 4;
      else if (grade >= 70) gradePointValue = 3;
      else if (grade >= 60) gradePointValue = 2;
      else if (grade >= 50) gradePointValue = 1;
      else alert("You have to pass the course (grade >= 50) to get GPA");

      totalCredits += creditNumber;
      totalGradePoints += creditNumber * gradePointValue;
    } else {
      // Nếu chưa có grade but have Credit
      coursesToSuggest.push({ row, credit: creditNumber });
      totalCredits += creditNumber;
    }
  });

  // Nếu không có môn nào để gợi ý
  if (coursesToSuggest.length === 0) {
    alert("Please add courses and corresponding credits without grades to get suggestions!");
    return;
  }

  // Tính tổng số điểm cần đạt để đạt target GPA
  const totalPointsNeeded = targetGPA * totalCredits;

  // Số điểm còn thiếu
  const remainingPointsNeeded = totalPointsNeeded - totalGradePoints;

  let bestCombination = null;
  let minDiff = Infinity;
  let minGPA4Count = Infinity; //thêm biến để theo dõi số lượng GPA 4.0 trong tổ hợp tốt nhất

  // Check nếu điểm suggest max có thể đạt được vẫn thấp hơn target GPA.
  let maxPossiblePoints = totalGradePoints;
    coursesToSuggest.forEach((course) => {
    maxPossiblePoints += 4.0 * course.credit;
    });
    const maxPossibleGPA = maxPossiblePoints / totalCredits;

  if (maxPossibleGPA < targetGPA) {
  alert(`With all remaining courses scoring 80% (GPA 4.0) your GPA is ${maxPossibleGPA}, your target GPA of ${targetGPA} is not achievable. Please lower your target.`);
  return;
}
  // Hàm đệ quy (DFS) để tìm tổ hợp điểm gần nhất với target GPA
  
 function dfs(index, currentPoints, currentGrades, gpa4Count = 0) {
    if (index === coursesToSuggest.length) {
      const total = totalGradePoints + currentPoints;
      const actualGPA = total / totalCredits;
      const diff = actualGPA >= targetGPA ? actualGPA - targetGPA : Infinity;

      if (
        diff < minDiff ||
        (diff === minDiff && gpa4Count < minGPA4Count)
      ) {
        minDiff = diff;
        minGPA4Count = gpa4Count;
        bestCombination = [...currentGrades];
      }
      return;
    }

    const credit = coursesToSuggest[index].credit;
    for (let gpa of [1.0, 2.0, 3.0, 4.0]) {
      const nextGPA4Count = gpa === 4.0 ? gpa4Count + 1 : gpa4Count;
      dfs(index + 1, currentPoints + gpa * credit, [...currentGrades, gpa], nextGPA4Count);
    }
}

  // Bắt đầu tìm kiếm
  dfs(0, 0, []);
  console.log("bestCombination:", bestCombination);//xuất ra console để kiểm tra tổ hợp tốt nhất

  if (!bestCombination) {
    alert("Cannot suggest grades to meet target GPA.");
    return;
  }
  

  // Gán kết quả ra placeholder các ô chưa có điểm
  coursesToSuggest.forEach((course, i) => {
    const gradeInput = course.row.querySelector(".grade");
    const suggestedPercent = Math.ceil(50 + (bestCombination[i] - 1.0) * 10);
    gradeInput.placeholder = `Need ${suggestedPercent}%`;
    gradeInput.classList.add("grade-placeholder");
  });
}


// Mảng lưu trữ lịch sử các trạng thái
let stateHistory = [];
let currentStateIndex = -1;

// Hàm lưu trạng thái hiện tại vào lịch sử
function saveState() {
    const rows = [
        document.querySelector(".input-container"),
        ...document.querySelectorAll("#extra-rows-container .input-container")
    ];

    const currentState = {
        courses: rows.map(row => {
            const gradeInput = row.querySelector(".grade");
            return {
                courseName: row.querySelector(".course-name").value,
                credit: row.querySelector(".credit").value,
                grade: gradeInput.value,
                placeholder: gradeInput.placeholder,
                hasPlaceholderClass: gradeInput.classList.contains("grade-placeholder")
            };
        }),
        targetGPA: document.getElementById("target-GPA").value,
        currentGPA: document.getElementById("current-GPA").innerHTML
    };

    // Xóa các trạng thái phía trước nếu đang ở giữa lịch sử
    if (currentStateIndex < stateHistory.length - 1) {
        stateHistory = stateHistory.slice(0, currentStateIndex + 1);
    }

    stateHistory.push(currentState);
    currentStateIndex = stateHistory.length - 1;
}

//Undo Button
function undo() {
    if (currentStateIndex <= 0) {
        alert("No more actions to undo!");
        return;
    }

    currentStateIndex--;
    const previousState = stateHistory[currentStateIndex];

    // Restore previous state
    const firstRow = document.querySelector(".input-container");
    if (previousState.courses.length > 0) {
        const firstCourse = previousState.courses[0];
        firstRow.querySelector(".course-name").value = firstCourse.courseName || "";
        firstRow.querySelector(".credit").value = firstCourse.credit || "";
        const firstGradeInput = firstRow.querySelector(".grade");
        firstGradeInput.value = firstCourse.grade || "";
        firstGradeInput.placeholder = firstCourse.placeholder || "Enter grade";
        firstGradeInput.classList.remove("grade-placeholder");
    }    // Restore extra rows
    const container = document.getElementById("extra-rows-container");
    container.innerHTML = "";
    for (let i = 1; i < previousState.courses.length; i++) {
        const course = previousState.courses[i];
        const row = document.createElement("div");
        row.className = "input-container";
        row.innerHTML = `<div class="course-name-column">
            <input type="text" class="course-name" value="${course.courseName || ''}" placeholder="Enter course name">
            </div>
            <div class="credit-column">
                <select class="credit">
                    <option value="" ${!course.credit ? "selected" : ""}>Select Credit</option>
                    <option value=12 ${course.credit === "12" ? "selected" : ""}>12</option>
                    <option value=24 ${course.credit === "24" ? "selected" : ""}>24</option>
                </select>
            </div>
            <div class="grade-column">
                <input type="number" class="grade" value="${course.grade || ''}" placeholder="${course.placeholder || 'Enter grade'}">
            </div>`;
        
        // Set grade placeholder class after the row is created
        const gradeInput = row.querySelector('.grade');
        if (course.hasPlaceholderClass) {
            gradeInput.classList.add('grade-placeholder');
        }
        container.appendChild(row);
    }

    // Khôi phục target GPA và current GPA
    document.getElementById("target-GPA").value = previousState.targetGPA || "";
    document.getElementById("current-GPA").innerHTML = previousState.currentGPA || "";

    // Lưu trạng thái mới vào localStorage
    localStorage.setItem('gpaData', JSON.stringify(previousState));
}

function saveToLocalStorage() {
    const rows = [
        document.querySelector(".input-container"),
        ...document.querySelectorAll("#extra-rows-container .input-container")
    ];

    const coursesData = rows.map(row => {
        const courseNameInput = row.querySelector(".course-name");
        const creditSelect = row.querySelector(".credit");
        const gradeInput = row.querySelector(".grade");
        return {
            courseName: courseNameInput.value,
            credit: creditSelect.value,
            grade: gradeInput.value
        };
    });

    const targetGPA = document.getElementById("target-GPA").value;
    const currentGPA = document.getElementById("current-GPA").innerHTML;

    const data = {
        courses: coursesData,
        targetGPA: targetGPA,
        currentGPA: currentGPA
    };

    localStorage.setItem('gpaData', JSON.stringify(data));
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('gpaData');
    if (!savedData) return;

    const data = JSON.parse(savedData);

    if (data.courses.length > 0) {
        const firstRow = document.querySelector(".input-container");
        const courseNameInput = firstRow.querySelector(".course-name");
        const creditSelect = firstRow.querySelector(".credit");
        const gradeInput = firstRow.querySelector(".grade");
        
        courseNameInput.value = data.courses[0].courseName || "";
        creditSelect.value = data.courses[0].credit || "";
        gradeInput.value = data.courses[0].grade || "";
    }

    const container = document.getElementById("extra-rows-container");
    for (let i = 1; i < data.courses.length; i++) {
        const row = document.createElement("div");
        row.className = "input-container";
        row.innerHTML = `<div class="course-name-column">
            <input type="text" class="course-name" value="${data.courses[i].courseName || ''}" placeholder="Enter course name">
            </div>
            <div class="credit-column">
                <select class="credit">
                    <option value="" ${!data.courses[i].credit ? "selected" : ""}>Select Credit</option>
                    <option value=12 ${data.courses[i].credit === "12" ? "selected" : ""}>12</option>
                    <option value=24 ${data.courses[i].credit === "24" ? "selected" : ""}>24</option>
                </select>
            </div>
            <div class="grade-column">
                <input type="number" class="grade" value="${data.courses[i].grade || ''}" placeholder="Enter grade">
            </div>`;
        container.appendChild(row);
    }

    document.getElementById("target-GPA").value = data.targetGPA || "";
    document.getElementById("current-GPA").innerHTML = data.currentGPA || "";
}

// Add event listener to load data when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Year 1 button
    const year1Button = document.querySelector('.extra-year');
    if (year1Button) {
        year1Button.onclick = function() { moveToYear(1); };
    }
    
    // Restore existing years
    for (let i = 1; i <= 4; i++) {
        if (localStorage.getItem(`year${i}Data`)) {
            if (i > 1) {
                yearCount = i;
                const extraYear = document.querySelector(".extra-year-container");
                const year = document.createElement("button");
                year.className = "extra-year";
                year.innerHTML = `Year ${i}`;
                year.onclick = function() { moveToYear(i); };
                extraYear.appendChild(year);
            }
        } else if (i === 1) {
            // Initialize year 1 data if it doesn't exist
            localStorage.setItem('year1Data', JSON.stringify({
                courses: [{
                    courseName: "",
                    credit: "",
                    grade: ""
                }]
            }));
            
            const defaultHTML = `
                <div class="input-container first-row">
                    <div class="course-name-column">
                        <p>Course Name</p>
                        <input type="text" class="course-name" placeholder="Enter course name">
                    </div>
                    <div class="credit-column">
                        <p>Credits</p>
                        <select class="credit">
                            <option value="">Select Credit</option>
                            <option value="12">12</option>
                            <option value="24">24</option>
                        </select>
                    </div>
                    <div class="grade-column">
                        <p>Grade</p>
                        <input type="number" class="grade" placeholder="Enter grade">
                    </div>
                </div>
                <div id="extra-rows-container"></div>
            `;
            localStorage.setItem('year1HTML', defaultHTML);
            localStorage.setItem('year1TargetGPA', "");
            localStorage.setItem('year1CurrentGPA', "");
        }
    }
    
    // Load year 1 state and set it as active
    moveToYear(1);
    
    // Add auto-save functionality
    document.querySelector('#wrapper').addEventListener('change', function(e) {
        if (e.target.matches('input') || e.target.matches('select')) {
            saveCurrentYearData();
        }
    });
});

// Add event listener when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Get all grade inputs including the first one
    const allGradeInputs = document.querySelectorAll('.grade');
    
    // Add event listeners to each grade input
    allGradeInputs.forEach(input => {
        // When input is focused, remove placeholder and grade-placeholder class
        input.addEventListener('focus', function() {
            this.placeholder = '';
            this.classList.remove('grade-placeholder');
        });
        
        // When input is clicked, remove placeholder and grade-placeholder class
        input.addEventListener('click', function() {
            this.placeholder = '';
            this.classList.remove('grade-placeholder');
        });

        // When input loses focus (blur)
        input.addEventListener('blur', function() {
            if (!this.value) {  // If input is empty
                this.placeholder = 'Enter grade';
            }
        });
    });
});

// Add input event listeners to save data as user types
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#wrapper').addEventListener('change', function(e) {
        if (e.target.matches('input') || e.target.matches('select')) {
            saveToLocalStorage();
            saveState(); // Lưu trạng thái mới vào lịch sử
        }
    });

    // Lưu trạng thái ban đầu sau khi tải dữ liệu
    setTimeout(() => {
        saveState();
    }, 100);
});

// Function to calculate GPA based on user input (grade and credit)
function addRow() {
  const container = document.getElementById("extra-rows-container");
  const row = document.createElement("div");
  row.id = "input-container";
  row.innerHTML = `<div id="course-name-column">
          <input type="text" id="course-name" placeholder="Enter course name">
          </div>
          <div id="credit-column">
            <select id="credit">
              <option value="" disabled selected>Select Credit</option>
              <option value=0>0</option>
              <option value=12>12</option>
              <option value=24>24</option>
            </select>
         </div>
          <div id="grade-column">
          <input type="number" id="grade" placeholder="Enter grade">
       </div>`;
    container.appendChild(row);
    
    // Add event listeners to the new grade input
    const newGradeInput = row.querySelector('#grade');
    newGradeInput.addEventListener('focus', function() {
        this.placeholder = '';
        this.classList.remove('grade-placeholder');
    });
    newGradeInput.addEventListener('click', function() {
        this.placeholder = '';
        this.classList.remove('grade-placeholder');
    });

    // Save to local storage after adding row
    saveToLocalStorage();
}

function removeRow() {
  const container = document.getElementById("extra-rows-container");
  const rows = container.querySelectorAll("#input-container");
  
  if (rows && rows.length > 0) {
    const lastRow = rows[rows.length - 1];
    container.removeChild(lastRow);
    // Save after removing row
    saveToLocalStorage();
  } else {
    alert("Cannot remove the first row!");
  }
}

function calculateTotalGPA() {
  const rows = [ 
    document.getElementById("input-container"),
    ...document.querySelectorAll("#extra-rows-container #input-container")
  ];
  
  let totalCredits = 0;
  let totalGradePoints = 0;

  rows.forEach((row) => {
    const creditSelect = row.querySelector("#credit");
    const gradeInput = row.querySelector("#grade");

    if (!creditSelect.value || !gradeInput.value) {
      return;
    }

    const creditNumber = parseFloat(creditSelect.value);
    const grade = parseFloat(gradeInput.value);

    if (grade <= 0 || grade > 100) {
      alert("Please enter valid grades between 0 and 100");
      return;
    }

    let gradePointValue;
    if (grade >= 80) gradePointValue = 4;
    else if (grade >= 70) gradePointValue = 3;
    else if (grade >= 60) gradePointValue = 2; 
    else if (grade >= 50) gradePointValue = 1;
    else gradePointValue = 0;

    totalCredits += creditNumber;
    totalGradePoints += creditNumber * gradePointValue;
  });

  if (totalCredits === 0) {
    alert("Please enter valid credits");
    return;
  }

  const GPA = totalGradePoints / totalCredits;
  document.getElementById("current-GPA").innerHTML = GPA.toFixed(2);
  // Save after calculating GPA
  saveToLocalStorage();
}

function suggest() {
  // Get Target GPA
  const targetGPA = parseFloat(document.getElementById("target-GPA").value);
  
  if (targetGPA < 0 || targetGPA > 4) {
    alert("Please enter a valid target GPA between 0 and 4");
    return;
  }

  const rows = [
    document.getElementById("input-container"),
    ...document.querySelectorAll("#extra-rows-container #input-container")
  ];

  let totalCredits = 0;
  let totalGradePoints = 0;

  // Calculate total for rows with grades
  rows.forEach((row) => {
    const creditSelect = row.querySelector("#credit");
    const gradeInput = row.querySelector("#grade");
    
    // Skip if no credit selected
    if (!creditSelect.value) return;

    const creditNumber = parseFloat(creditSelect.value);
    
    // If grade exists, calculate grade points
    if (gradeInput.value) {
      const grade = parseFloat(gradeInput.value);
      let gradePointValue;
      
      if (grade >= 80) gradePointValue = 4;
      else if (grade >= 70) gradePointValue = 3;
      else if (grade >= 60) gradePointValue = 2;
      else if (grade >= 50) gradePointValue = 1;
      else gradePointValue = 0;

      totalCredits += creditNumber;
      totalGradePoints += creditNumber * gradePointValue;
    }
  });

  // Calculate credits for courses without grades
  let totalCreditWithoutGrade = 0;
  rows.forEach((row) => {
    const creditSelect = row.querySelector("#credit");
    const gradeInput = row.querySelector("#grade");
    
    if (creditSelect.value && !gradeInput.value) {
      totalCreditWithoutGrade += parseFloat(creditSelect.value);
    }
  });

  // Check if there are any courses without grades
  if (totalCreditWithoutGrade === 0) {
    alert("Please add courses without grades to get suggestions!");
    return;
  }

  const minimumGrade = (targetGPA * (totalCredits + totalCreditWithoutGrade) - totalGradePoints) / totalCreditWithoutGrade;

  // Check if minimum grade is achievable
  if (minimumGrade > 100) {
    alert("Target GPA is not achievable with current grades!");
    return;
  }

  if (minimumGrade < 0) {
    alert("You've already achieved higher than target GPA!");
    return;
  }

  // Convert minimum GPA to required percentage grade
  let requiredGrade;
  if (minimumGrade >= 4) requiredGrade = 80;
  else if (minimumGrade >= 3) requiredGrade = 70;
  else if (minimumGrade >= 2) requiredGrade = 60;
  else if (minimumGrade >= 1) requiredGrade = 50;
  else requiredGrade = Math.max(minimumGrade * 20, 0); // Convert GPA to percentage, minimum 0

  // Display the suggested grade in empty grade inputs
  rows.forEach((row) => {
    const gradeInput = row.querySelector("#grade");
    const creditSelect = row.querySelector("#credit");
    
    if (creditSelect.value && !gradeInput.value) {
      gradeInput.placeholder = `Need ${Math.ceil(requiredGrade)}%`;
      gradeInput.classList.add('grade-placeholder');
    }
  });

  // Show a message with the required grade
  alert(`To achieve a GPA of ${targetGPA}, you need at least ${Math.ceil(requiredGrade)}% in remaining courses.`);
}

function resetAll() {
    // Reset all inputs
    const rows = [
        document.getElementById("input-container"),
        ...document.querySelectorAll("#extra-rows-container #input-container")
    ];
    
    rows.forEach(row => {
        // Reset course name
        const courseName = row.querySelector("#course-name");
        if (courseName) courseName.value = "";
        
        // Reset credit
        const credit = row.querySelector("#credit");
        if (credit) credit.value = "0";
        
        // Reset grade
        const grade = row.querySelector("#grade");
        if (grade) {
            grade.value = "";
            grade.placeholder = "Enter grade";
            grade.classList.remove('grade-placeholder');
        }
    });
    
    // Reset target GPA
    const targetGPA = document.getElementById("target-GPA");
    if (targetGPA) {
        targetGPA.value = "";
        targetGPA.placeholder = "Enter target GPA";
    }
    
    // Reset current GPA display
    const currentGPA = document.getElementById("current-GPA");
    if (currentGPA) currentGPA.innerHTML = "";
    
    // Remove all extra rows
    const container = document.getElementById("extra-rows-container");
    container.innerHTML = "";

    // Clear local storage when resetting
    localStorage.removeItem('gpaData');
}

// Function to save data to local storage
function saveToLocalStorage() {
    const rows = [
        document.getElementById("input-container"),
        ...document.querySelectorAll("#extra-rows-container #input-container")
    ];

    const coursesData = rows.map(row => ({
        courseName: row.querySelector("#course-name").value,
        credit: row.querySelector("#credit").value,
        grade: row.querySelector("#grade").value
    }));

    const targetGPA = document.getElementById("target-GPA").value;
    const currentGPA = document.getElementById("current-GPA").innerHTML;

    const data = {
        courses: coursesData,
        targetGPA: targetGPA,
        currentGPA: currentGPA
    };

    localStorage.setItem('gpaData', JSON.stringify(data));
}

// Function to load data from local storage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('gpaData');
    if (!savedData) return;

    const data = JSON.parse(savedData);

    // Load first course
    if (data.courses.length > 0) {
        const firstRow = document.getElementById("input-container");
        firstRow.querySelector("#course-name").value = data.courses[0].courseName || "";
        firstRow.querySelector("#credit").value = data.courses[0].credit || "0";
        firstRow.querySelector("#grade").value = data.courses[0].grade || "";
    }

    // Load additional courses
    const container = document.getElementById("extra-rows-container");
    for (let i = 1; i < data.courses.length; i++) {
        const row = document.createElement("div");
        row.id = "input-container";
        row.innerHTML = `<div id="course-name-column">
            <input type="text" id="course-name" value="${data.courses[i].courseName || ''}" placeholder="Enter course name">
            </div>
            <div id="credit-column">
                <select id="credit">
                    <option value=0 ${data.courses[i].credit === "0" ? "selected" : ""}>Select Credit</option>
                    <option value=12 ${data.courses[i].credit === "12" ? "selected" : ""}>12</option>
                    <option value=24 ${data.courses[i].credit === "24" ? "selected" : ""}>24</option>
                </select>
            </div>
            <div id="grade-column">
                <input type="number" id="grade" value="${data.courses[i].grade || ''}" placeholder="Enter grade">
            </div>`;
        container.appendChild(row);
    }

    // Load target GPA and current GPA
    document.getElementById("target-GPA").value = data.targetGPA || "";
    document.getElementById("current-GPA").innerHTML = data.currentGPA || "";
}

// Add event listener to load data when page loads
document.addEventListener('DOMContentLoaded', loadFromLocalStorage);

// Add event listener when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Get all grade inputs including the first one
    const allGradeInputs = document.querySelectorAll('#grade');
    
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
    });
});

// Add input event listeners to save data as user types
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#wrapper').addEventListener('change', function(e) {
        if (e.target.matches('input') || e.target.matches('select')) {
            saveToLocalStorage();
        }
    });
});

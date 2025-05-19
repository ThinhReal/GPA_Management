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
  const rows = container.querySelectorAll(".input-container");
  
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
    document.querySelector(".input-container"),
    ...document.querySelectorAll("#extra-rows-container .input-container")
  ];
  
  let totalCredits = 0;
  let totalGradePoints = 0;

  rows.forEach((row) => {
    const creditSelect = row.querySelector(".credit");
    const gradeInput = row.querySelector(".grade");

    if (!creditSelect.value || !gradeInput.value) {   // Only calculate if both credit and grade are entered
      
      return;
    }
    if(!creditSelect.value && gradeInput.value) {
      alert("Please select credit for the course with grade");
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


  const GPA = totalGradePoints / totalCredits;
  document.getElementById("current-GPA").innerHTML = GPA.toFixed(2);

  
  // Save after calculating GPA
  saveToLocalStorage();
}

function suggest() {
  calculateTotalGPA();
  const targetGPA = parseFloat(document.getElementById("target-GPA").value);
  
  if (targetGPA < 0 || targetGPA > 4) {
    alert("Please enter a valid target GPA between 0 and 4");
    return;
  }

  const rows = [
    document.querySelector(".input-container"),
    ...document.querySelectorAll("#extra-rows-container .input-container")
  ];

  let totalCredits = 0;
  let totalGradePoints = 0;

  rows.forEach((row) => {
    const creditSelect = row.querySelector(".credit");
    const gradeInput = row.querySelector(".grade");
    
    if (!creditSelect.value) return;

    const creditNumber = parseFloat(creditSelect.value);
    
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

  let totalCreditWithoutGrade = 0;
  rows.forEach((row) => {
    const creditSelect = row.querySelector(".credit");
    const gradeInput = row.querySelector(".grade");
    
    if (creditSelect.value && !gradeInput.value) {
      totalCreditWithoutGrade += parseFloat(creditSelect.value);
    }
  });

  if (totalCreditWithoutGrade === 0) {
    alert("Please add courses and corresponding credits without grades to get suggestions!");
    return;
  }

  const minimumGrade = (targetGPA * (totalCredits + totalCreditWithoutGrade) - totalGradePoints) / totalCreditWithoutGrade;

  alert(`${minimumGrade}`)

/*  let requiredGrade;
  if (minimumGrade > 4) alert("Target GPA is not achievable with current grades!");
  else if (minimumGrade > 3.5 && minimumGrade <= 4) requiredGrade = 80;
  else if (minimumGrade >2 && minimumGrade<=2.5) requiredGrade = 70;
  else if (minimumGrade >1.5 && minimumGrade<=2) requiredGrade = 60;
  else if (minimumGrade >= 1 && minimunGrade<=1.5) requiredGrade = 50;
  else if (minimumGrade < 1) alert("You've already achieved higher than target GPA!");

  rows.forEach((row) => {
    const gradeInput = row.querySelector(".grade");
    const creditSelect = row.querySelector(".credit");
   // Add placeholder and class only if credit is selected and grade is not entered, to show the required grade 
   if(minimumGrade <= 4 && minimumGrade >= 1) {
    if (creditSelect.value && !gradeInput.value) {
      gradeInput.placeholder = `Need at least ${requiredGrade}%`;
      gradeInput.classList.add('grade-placeholder');
    }

}})

  if(minimumGrade <= 4 && minimumGrade >= 1) {
    alert(`To achieve a GPA of ${targetGPA}, you need at least ${requiredGrade}% in remaining courses.`);
    }
    */
  }

function resetAll() {
    const rows = [
        document.querySelector(".input-container"),
        ...document.querySelectorAll("#extra-rows-container .input-container")
    ];
    
    rows.forEach(row => {
        const courseNameInput = row.querySelector(".course-name");
        const creditSelect = row.querySelector(".credit");
        const gradeInput = row.querySelector(".grade");
        
        if (courseNameInput) courseNameInput.value = "";
        if (creditSelect) creditSelect.value = "";
        if (gradeInput) {
            gradeInput.value = "";
            gradeInput.placeholder = "Enter grade";
            gradeInput.classList.remove('grade-placeholder');
        }
    });
    
    const targetGPA = document.getElementById("target-GPA");
    if (targetGPA) {
        targetGPA.value = "";
        targetGPA.placeholder = "Enter target GPA";
    }
    
    const currentGPA = document.getElementById("current-GPA");
    if (currentGPA) currentGPA.innerHTML = "";
    
    const container = document.getElementById("extra-rows-container");
    container.innerHTML = "";

    localStorage.removeItem('gpaData');
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
document.addEventListener('DOMContentLoaded', loadFromLocalStorage);

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
        }
    });
});

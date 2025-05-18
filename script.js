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
}

function removeRow() {
  const container = document.getElementById("extra-rows-container");
  const rows = container.querySelectorAll("#input-container"); //get all rows with id "input-container"
  
  // If there are extra rows, remove the last one
  if (rows && rows.length > 0) {
    const lastRow = rows[rows.length - 1];
    container.removeChild(lastRow);
  } else {
    // If no extra rows exist, show alert
    alert("Cannot remove the first row!");
  }
}

function calculateTotalGPA() {
  // Get all rows including the first one and extra rows
  // Rows is a NodeList, so we can use forEach to iterate over it
  const rows = [ 
    document.getElementById("input-container"),
    ...document.querySelectorAll("#extra-rows-container #input-container") //(...) là spread operator, add all rows with id "input-container" in extra-rows-container
  ];
  
  let totalCredits = 0;
  let totalGradePoints = 0;
  // Process each row
  rows.forEach((row) => {
    const creditSelect = row.querySelector("#credit");
    const gradeInput = row.querySelector("#grade");

    // Skip this row if either credit or grade is not entered
    if (!creditSelect.value || !gradeInput.value) {
      return; // Skip this iteration
    }

    const creditNumber = parseFloat(creditSelect.value);
    const grade = parseFloat(gradeInput.value);

    // Check grade
    if (grade <= 0 || grade > 100) {
      alert("Please enter valid grades between 0 and 100");
      return;
    }

    // Calculate grade points
    let gradePointValue;
    if (grade >= 80) gradePointValue = 4;
    else if (grade >= 70) gradePointValue = 3;
    else if (grade >= 60) gradePointValue = 2; 
    else if (grade >= 50) gradePointValue = 1;
    else gradePointValue = 0;

    // Add to totals
    totalCredits += creditNumber;
    totalGradePoints += creditNumber * gradePointValue;
  });

  // Calculate final GPA
  if (totalCredits === 0) {
    alert("Please enter valid credits");
    return;
  }

  const GPA = totalGradePoints / totalCredits;
  document.getElementById("current-GPA").innerHTML = GPA.toFixed(2);
}

function suggest(){
  //Have Target GPA
  const targetGPA = parseFloat(document.getElementById("target-GPA").value);
  if(targetGPA < 0 || targetGPA > 4){
    alert("Please enter a valid target GPA between 0 and 4");
    return;
  }else{
    const rows = [
      document.getElementById("input-container"),
      ...document.querySelectorAll("#extra-rows-container #input-container")
    ];
    let totalCredits = 0;
    let totalGradePoints = 0;
    // Process each row
    rows.forEach((row)=>{
      const creditSelect = row.querySelector("#credit");
      const gradeInput = row.querySelector("#grade");
    
      const creditNumber = parseFloat(creditSelect.value);
  
  //add to totals, SO WE HAVE CURRENT TOTAL CREDITS
  totalCredits += creditNumber;

    let gradePointValue;
    if (grade >= 80) gradePointValue = 4;
    else if (grade >= 70) gradePointValue = 3;
    else if (grade >= 60) gradePointValue = 2; 
    else if (grade >= 50) gradePointValue = 1;
    else gradePointValue = 0;
  // Calculate the TOTAL CURRENT GRADE POINTS
    totalGradePoints += creditNumber * gradePointValue;
    })

   //Calculate the Total Credit that users don't have grade yet 
    const newRows = [
      document.getElementById("input-container"),
      ...document.querySelectorAll("#extra-rows-container #input-container")
    ];
    let totalCreditWithoutGrade = 0;
    newRows.forEach((newRow) => {
      const newCreditSelect = newRow.querySelector("#credit");
      const newCreditNumber = parseFloat(newCreditSelect.value);

      const newGradeInput = newRow.querySelector("#grade");
      if (!newGradeInput.value) {
        totalCreditWithoutGrade += newCreditNumber;
      }
    })    const minimumGrade = (targetGPA * (totalCredits + totalCreditWithoutGrade) - totalGradePoints) / totalCreditWithoutGrade;

    // Check if minimum grade is achievable
    if (minimumGrade > 100) {
      alert("Target GPA is not achievable with current grades!");
      return;
    }

    if (minimumGrade < 0) {
      alert("You've already achieved higher than target GPA!");
      return;
    }

    // Convert minimum grade to actual grade needed
    let requiredGrade;
    if (minimumGrade >= 4) requiredGrade = 80;
    else if (minimumGrade >= 3) requiredGrade = 70;
    else if (minimumGrade >= 2) requiredGrade = 60;
    else if (minimumGrade >= 1) requiredGrade = 50;
    else requiredGrade = minimumGrade;

    // Display the suggested grade in empty grade inputs
    newRows.forEach((newRow) => {
      const gradeInput = newRow.querySelector("#grade");
      if (!gradeInput.value) {
        gradeInput.placeholder = `Need ${Math.ceil(requiredGrade)}%`;
        gradeInput.classList.add('grade-placeholder');
      }
    });

    // Show a message with the required grade
    alert(`To achieve a GPA of ${targetGPA}, you need at least ${Math.ceil(requiredGrade)}% in remaining courses.`);
  }
}

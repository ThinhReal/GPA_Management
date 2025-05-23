let currentYear = "Year 1";
// Function to add a new row with course numbering
function addRow(year=currentYear) {
    const container = document.getElementById("extra-rows-container");
    const row = document.createElement("div");
    row.setAttribute("data-year", year);
    row.className = "input-container";    
    row.innerHTML = `
            <div class="course-number-column">
                <p></p>
                </div>
            <div class="course-name-column">
                <input type="text" class="course-name" placeholder="Enter course name">
            </div>
            <div class="credit-column">
                <select class="credit">
                    <option value="">Credit</option>
                    <option value=12>12</option>
                    <option value=24>24</option>
                </select>
            </div>
            <div class="grade-column">
                <input type="number" class="grade" placeholder="Enter grade">
            </div>`;
    
    container.appendChild(row);
    // Mỗi lần add row mới, cập nhật lại số thứ tự của các môn học
    const courseNumber = container.children.length;
    const courseNumberColumn = row.querySelector(".course-number-column p");
    courseNumberColumn.textContent = `${courseNumber}`;
    
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
    //Lấy data rồi truy cập function autoSave để lưu data và0 local Storage
    row.querySelector(".course-name").addEventListener("input",autoSaveToLocalStorage);
    row.querySelector(".credit").addEventListener("change", autoSaveToLocalStorage);
    row.querySelector(".grade").addEventListener("input", autoSaveToLocalStorage);    
}

function removeRow() {
  const container = document.getElementById("extra-rows-container");
  const rows = container.getElementsByClassName("input-container");
    if (rows && rows.length > 0) {
    const lastRow = rows[rows.length - 1];
    container.removeChild(lastRow);
  
  } else {
    alert("Cannot remove the first row!");
  }
}
function calculateTotalGPA() {
  const rows = document.querySelectorAll("#extra-rows-container .input-container");

  let totalCredits = 0;
  let totalGradePoints = 0;

  for(const row of rows) {
    const creditSelect = row.querySelector(".credit");
    const gradeInput = row.querySelector(".grade");
    // Stop when Grade is entered but Credit is not
    if(!creditSelect.value && gradeInput.value) {
      alert("Please select credit for the course with grade");
      return;
    }
    if (!creditSelect.value || !gradeInput.value) {   // Only calculate if both credit and grade are entered
      continue;
    }
    
    const creditNumber = parseFloat(creditSelect.value);
    const grade = parseFloat(gradeInput.value);
    // Chuyển điểm phần trăm  thành thang GPA (4.0)
    let gradePointValue;
    if (grade >= 80 && grade <=100) gradePointValue = 4;
      else if (grade >= 70) gradePointValue = 3;
      else if (grade >= 60) gradePointValue = 2;
      else if (grade >= 50) gradePointValue = 1;
      else {alert("Please enter valid grades between 50 and 100 because you have to pass the course (grade >= 50) to get GPA"); return;}
    totalCredits += creditNumber;
    totalGradePoints += creditNumber * gradePointValue;
  };// hết vòng lặp

  //Rồi thực hiện tính GPA hiện tại và gán vào ô GPA
  const GPA = totalGradePoints / totalCredits;
  document.getElementById("current-GPA").innerHTML = GPA.toFixed(2);
  //check the output
    console.log("Total grade points:", totalGradePoints);
    console.log("Total credits:", totalCredits);
    console.log("Calculated GPA:", GPA);
}
function suggest() {
    calculateTotalGPA();
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
    document.querySelector("#large-input-container"),
    ...document.querySelectorAll("#extra-rows-container .input-container")
  ];

  let totalCredits = 0;           // Tổng số tín chỉ của tất cả môn
  let totalGradePoints = 0;       // Tổng điểm đã có (grade × credit)
  let coursesToSuggest = [];      // Danh sách các môn chưa nhập grade

  // Duyệt qua từng dòng
  rows.forEach((row) => {
    const creditSelect = row.querySelector(".credit");
    const gradeInput = row.querySelector(".grade");

    if (!creditSelect.value) return; // nếu chưa chọn tín chỉ, so bỏ qua

    const creditNumber = parseFloat(creditSelect.value);

    if (gradeInput.value) {
      const grade = parseFloat(gradeInput.value);
      let gradePointValue;
      // Chuyển điểm phần trăm  thành thang GPA (4.0)
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
  alert(`With all remaining courses scoring 80% (GPA 4.0) your GPA is ${maxPossibleGPA.toFixed(2)}, your target GPA of ${targetGPA} is not achievable. Please lower your target.`);
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

function autoSaveToLocalStorage(){
    // Save data whenever user creates Row or inputs data
    const allRows = [...document.querySelectorAll("#extra-rows-container .input-container")];
    let rowsData = [];
    
    allRows.forEach(row => {
        const courseName = row.querySelector(".course-name").value;
        const credit = row.querySelector(".credit").value;
        const grade = row.querySelector(".grade").value;
        const courseNumber = row.querySelector(".course-number-column p").textContent;
        
        // Save even empty rows to preserve structure
        rowsData.push({ 
            courseName, 
            credit, 
            grade,
            courseNumber,
            year: currentYear
        });
    });
    
    // Save data for current year
    localStorage.setItem(`courseRows_${currentYear}`, JSON.stringify(rowsData));
    
    // Save current year to restore on page load
    localStorage.setItem('lastActiveYear', currentYear);
}

// Load data for selected year
function loadDataForYear(year) {
    // Save current year's data before switching
    if (currentYear !== year) {
        autoSaveToLocalStorage();
    }

    // Update current year
    currentYear = year;
    
    // Update UI to show active year
    document.querySelectorAll('.extra-year').forEach(btn => {
        if (btn.textContent === year) {
            btn.classList.add('active-year');
        } else {
            btn.classList.remove('active-year');
        }
    });

    const container = document.getElementById("extra-rows-container");
    container.innerHTML = ""; // Clear old data

    // Load saved data for the year
    const savedRows = JSON.parse(localStorage.getItem(`courseRows_${year}`) || "[]");
    
    if (savedRows.length === 0) {
        // If no saved data, add one empty row
        addRow(year);
    } else {
        // Restore saved rows
        savedRows.forEach(data => {
            addRow(year);
            const allRows = document.querySelectorAll("#extra-rows-container .input-container");
            const currentRow = allRows[allRows.length - 1];
            
            currentRow.querySelector(".course-name").value = data.courseName || "";
            currentRow.querySelector(".credit").value = data.credit || "";
            currentRow.querySelector(".grade").value = data.grade || "";
            
            // Update course number if it was saved
            if (data.courseNumber) {
                currentRow.querySelector(".course-number-column p").textContent = data.courseNumber;
            }
        });
    }
}
// Load last active year or default to Year 1 when page loads
window.addEventListener("load", () => {
    loadDataForYear('Year 1');
});
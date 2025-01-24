const names = [
  "Mr Mathenge", "Ms Mhenga", "Ms Mjema", "Ms Mhina", "Ms Omari", "Mr Tawa", 
  "Mr Matembo", "Mr Kondo", "Ms Salha", "Ms Sokoni", "Ms Mshanga", "Mr Bundala", 
  "Mr Max", "Ms Charles", "Mr Asimulike", "Mr Ayubu", "Ms Salim", "Ms Njau", 
  "Ms Gebra", "CSO", "ARO", "AOO"
];

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const fireworksCanvas = document.getElementById('fireworks');
const fireworksCtx = fireworksCanvas.getContext('2d');
const wheelSize = canvas.width / 2;
const colors = ['#FF6A13', '#808080', '#FFFFFF']; // Pantone Orange, Grey, White
let spinning = false;
let fireworks = [];
let usedNames = [];
let report = [];

const drawWheel = () => {
  const numSegments = names.length;
  const angle = Math.PI * 2 / numSegments;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i = 0; i < numSegments; i++) {
    const startAngle = angle * i;
    const endAngle = angle * (i + 1);
    
    ctx.beginPath();
    ctx.moveTo(wheelSize, wheelSize);
    ctx.arc(wheelSize, wheelSize, wheelSize - 5, startAngle, endAngle, false);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    
    ctx.save();
    ctx.translate(wheelSize, wheelSize);
    ctx.rotate(startAngle + angle / 2);
    ctx.fillStyle = "#000";
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(names[i], wheelSize - 10, 20);
    ctx.restore();
  }
};

function createFireworks(x, y) {
  for (let i = 0; i < 100; i++) {
    fireworks.push({
      x: x,
      y: y,
      dx: Math.random() * 10 - 5,
      dy: Math.random() * 10 - 5,
      radius: Math.random() * 2 + 1,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`
    });
  }
}

function updateFireworks() {
  fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
  
  fireworks.forEach((firework, index) => {
    firework.x += firework.dx;
    firework.y += firework.dy;
    firework.radius *= 0.98; // Shrink radius
    fireworksCtx.beginPath();
    fireworksCtx.arc(firework.x, firework.y, firework.radius, 0, Math.PI * 2);
    fireworksCtx.fillStyle = firework.color;
    fireworksCtx.fill();
    
    if (firework.radius < 0.1) {
      fireworks.splice(index, 1);
    }
  });
}

function spinWheel() {
  const userName = document.getElementById('user-name').value;
  if (!userName || usedNames.includes(userName)) {
    alert("Please enter a unique name and try again.");
    return;
  }

  if (spinning) return;
  spinning = true;
  
  document.querySelector("button").disabled = true;
  document.getElementById("spin-result").innerText = "Spinning...";

  const spinDuration = 2000;
  const rotations = 10 + Math.random() * 10;  // Random rotations between 10 and 20
  let startTime = null;
  
  function animateSpin(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsedTime = timestamp - startTime;
    const rotation = (elapsedTime / spinDuration) * (Math.PI * 2 * rotations);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWheel();
    
    ctx.save();
    ctx.translate(wheelSize, wheelSize);
    ctx.rotate(rotation);
    ctx.translate(-wheelSize, -wheelSize);
    ctx.restore();
    
    if (elapsedTime < spinDuration) {
      requestAnimationFrame(animateSpin);
    } else {
      const winnerIndex = Math.floor((rotation / (Math.PI * 2)) * names.length) % names.length;
      const winner = names[winnerIndex];
      
      document.getElementById("spin-result").innerText = `Congratulations, your secreto is: ${winner}`;
      
      createFireworks(wheelSize, wheelSize); // Fireworks explode at the center of the wheel

      // Add result to report
      report.push({ name: userName, winner });
      updateReport();

      // Add the user's name to the used list
      usedNames.push(userName);

      // Remove the winner from the names list
      names.splice(winnerIndex, 1);
      drawWheel();
      
      // Re-enable the button for the next spin
      document.querySelector("button").disabled = false;
      spinning = false;
    }
  }

  requestAnimationFrame(animateSpin);
}

function updateReport() {
  const reportList = document.getElementById('report-list');
  reportList.innerHTML = ''; // Clear existing report
  report.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${entry.name} won: ${entry.winner}`;
    reportList.appendChild(li);
  });
}

function gameLoop() {
  updateFireworks();
  requestAnimationFrame(gameLoop);
}

// Start the fireworks animation loop
gameLoop();

// Initial wheel drawing
drawWheel();

// Enable spin button when a name is entered
const userNameInput = document.getElementById('user-name');
const spinButton = document.getElementById('spin-button');

// Add event listener to enable spin button when a name is entered
userNameInput.addEventListener('input', () => {
  if (userNameInput.value.trim() !== "") {
    spinButton.disabled = false; // Enable button when a name is entered
  } else {
    spinButton.disabled = true; // Keep button disabled if no name is entered
  }
});

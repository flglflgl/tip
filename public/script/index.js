// Custom Cursor
document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.createElement("div");
    cursor.classList.add("cursor");
    document.body.appendChild(cursor);
  
    cursor.style.display = "block";
  
    document.addEventListener("mousemove", (e) => {
      const offsetX = 10;
      const offsetY = 10;
  
      cursor.style.left = `${e.pageX + offsetX}px`;
      cursor.style.top = `${e.pageY + offsetY}px`;
    });
  });
  
  
  // Follow Cursor effect for .top ul li elements
  document.addEventListener("DOMContentLoaded", function () {
    const topMenuItems = document.querySelectorAll(".top > nav > ul > li");
  
    topMenuItems.forEach((item) => {
      item.addEventListener("mousemove", (event) => {
        const { clientX, clientY } = event;
        const rect = item.getBoundingClientRect();
        const offsetX = clientX - (rect.left + rect.width / 2);
        const offsetY = clientY - (rect.top + rect.height / 2);
  
        item.style.transform = `translate(${offsetX * 1.4}px, ${offsetY * 1.4}px)`;
      });
  
      item.addEventListener("mouseleave", () => {
        item.style.transition = "transform 0.4s ease-out";
        item.style.transform = "translate(0, 0)";
      });
    });
  });
  
  
  // Menu Effects
  document.querySelector(".minTopUlbtn")?.addEventListener("click", () => {
    document.querySelector(".minTopUl")?.classList.toggle("show");
  });
  
  document.querySelector(".minTopUlClosingbtn")?.addEventListener("click", () => {
    document.querySelector(".minTopUl")?.classList.remove("show");
  });
  
  document.querySelectorAll(".minTopUl ul li a").forEach((link) =>
    link.addEventListener("click", () => document.querySelector(".minTopUl")?.classList.remove("show"))
  );
  
  
  // Github URL Params from Github Login
  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const githubUser = params.get('github_user');
    const githubURL = params.get('github_url');
  
    const githubbtn = document.getElementById('githubbtn');
    const subbtn = document.getElementById('subbtn');
    const logInput = document.querySelector('.logInput');
    const githubInput = document.getElementById('githubInput');
    const githubURLInput = document.getElementById('githubURLInput');
  
    // Github Login
    if (githubUser && githubURL) {
      githubInput.value = githubUser;
      githubURLInput.value = githubURL;
      githubbtn.innerHTML = 'Logout';
      githubbtn.onclick = () => window.location.href = '/logout';
  
      subbtn.innerHTML = 'Post';
      logInput.innerHTML = `Logged in as <a href="${params.get('github_url')}" target="_blank">${githubUser}</a>`;
    }
  });
  
  
  // GitHub Login Redirect
  document.getElementById('githubbtn').addEventListener('click', function () {
    const clientId = 'Ov23liDjIUQhuJlcCamF'; // Your GitHub Client ID
    const redirectUri = 'http://localhost:3000/github/callback'; // Redirect URL
    const scope = 'read:user user:email';
  
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
  
    window.location.href = githubAuthUrl;
  });
  
  
  // Signing Input
  document.addEventListener("DOMContentLoaded", function () {
    const signingInput = document.querySelector(".signingInput");
    const resetBtn = document.querySelector(".resetbtn");
  
    if (!signingInput || !resetBtn) {
      console.error("Signing input or reset button not found.");
      return;
    }
  
    const ctx = signingInput.getContext("2d");
    signingInput.width = signingInput.clientWidth;
    signingInput.height = signingInput.clientHeight;
  
    let signing = false;
  
    function startSign(x, y) {
      signing = true;
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  
    function sign(e) {
      if (!signing) return;
  
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.strokeStyle = "#777777";
  
      const rect = signingInput.getBoundingClientRect();
      let x, y;
  
      if (e.type.includes("mouse")) {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      } else if (e.type.includes("touch")) {
        e.preventDefault();
        const touch = e.touches[0];
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
      }
  
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  
    function stopSign() {
      signing = false;
    }
  
    // Mouse Events
    signingInput.addEventListener("mousedown", (e) =>
      startSign(e.clientX - signingInput.getBoundingClientRect().left, e.clientY - signingInput.getBoundingClientRect().top)
    );
    signingInput.addEventListener("mouseup", stopSign);
    signingInput.addEventListener("mouseleave", stopSign);
    signingInput.addEventListener("mousemove", sign);
  
    // Touch Events
    signingInput.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      startSign(touch.clientX - signingInput.getBoundingClientRect().left, touch.clientY - signingInput.getBoundingClientRect().top);
    });
  
    signingInput.addEventListener("touchend", stopSign);
    signingInput.addEventListener("touchcancel", stopSign);
    signingInput.addEventListener("touchmove", sign);
  
    // Reset Button
    resetBtn.addEventListener("click", () => {
      ctx.clearRect(0, 0, signingInput.width, signingInput.height);
    });
  });
  
  
  // Form submission
  const form = document.getElementById('tipForm');
  const tipInput = document.getElementById('tip');
  const githubInput = document.getElementById('githubInput');
  const githubURLInput = document.getElementById('githubURLInput');
  const signingInput = document.querySelector('.signingInput');
  const ctx = signingInput.getContext('2d');
  const postGrid = document.querySelector('.postGrid');
  
  
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const tip = tipInput.value.trim();
    const signing = signingInput.toDataURL(); // Convert .signingInput to Base68 to store it in MySQL
  
    if (!tip) {
      alert('Tip is required.');
      return;
    }
  
    const requestBody = { tip, signing };
  
    // Submit input fields if not empty
    if (githubInput?.value.trim()) {
      requestBody.github = githubInput.value.trim();
    }
    if (githubURLInput?.value.trim()) {
      requestBody.githubURL = githubURLInput.value.trim();
    }
  
    try {
      const response = await fetch('/tip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      const result = await response.json();
      console.log('Server response:', result);
  
      if (response.ok) {
        const newTipElement = createTipElement(
          result.tip,
          result.github || '',
          result.githubURL || '',
          result.signing
        );
  
        postGrid.insertBefore(newTipElement, postGrid.firstChild);
  
        // Reset form inputs
        form.reset();
        ctx.clearRect(0, 0, signingInput.width, signingInput.height);
      } else {
        alert(result.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error submitting tip:', error);
      alert('Error occurred while submitting your tip.');
    }
  });
  
  
  // Prepend new .tip element to .postGrid (newest tip first)
  function createTipElement(tip, github, githubURL, signing) {
    console.log(githubURL)
  
    const tipCon = document.createElement('div');
    tipCon.className = 'tipCon';
  
    const tipElement = document.createElement('div');
    tipElement.className = 'tip';
    tipElement.textContent = tip;
  
    const githubElement = document.createElement('div');
    githubElement.className = 'github';
  
    if (github && githubURL) {
      const link = document.createElement('a');
      link.href = githubURL;
      link.textContent = github;
      link.target = '_blank';
      githubElement.appendChild(link);
    } else {
      githubElement.textContent = github;
    }
  
    tipCon.appendChild(tipElement);
    tipCon.appendChild(githubElement);
  
    if (signing) {
      const img = document.createElement('img');
      img.src = signing;
      img.style.position = 'absolute';
      img.style.right = '10px';
      img.style.bottom = '10px';
      img.style.width = '400px';
  
      tipCon.appendChild(img);
    }
  
    return tipCon;
  }
  
  
  // Fetch Tips from MySQL
  document.addEventListener('DOMContentLoaded', fetchTips);
  
  async function fetchTips() {
    try {
      const response = await fetch('/tip');
      const tips = await response.json();
  
      postGrid.innerHTML = ''; // Reset previous content
  
      tips.forEach((tipData) => {
        const newTipElement = createTipElement(
          tipData.tip,
          tipData.github,
          tipData.githubURL,
          tipData.signing
        );
        console.log(tipData.githubURL);
        postGrid.appendChild(newTipElement);
      });
    } catch (error) {
      console.error('Error fetching tips:', error);
    }
  }
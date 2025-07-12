//Fetch location data from API
async function fetchLocation() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return `${data.city}, ${data.country_name}`;
  } catch (error) {
    console.error("Error fetching location:", error);
    return "Unknown location";
  }
}

let posts = JSON.parse(localStorage.getItem("posts")) || [];

// Save new post
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("postForm");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value;
      const content = document.getElementById("content").value;
      const dateTime = new Date().toLocaleString();

      const location = await fetchLocation();

      posts.unshift({ title, content, dateTime, location });
      localStorage.setItem("posts", JSON.stringify(posts));

      alert("Post saved!");
      window.location.href = "posts.html";
    });
  }
  renderPosts();
});

// Render posts
function renderPosts() {
  const postsContainer = document.getElementById("postsContainer");
  if (!postsContainer) return;

  postsContainer.innerHTML = posts
    .map(
      (post, index) => `
            <div class="post">
                <h3 id="title-${index}">${post.title}</h3>
                <small>📅 ${post.dateTime}</small><br>
                <small>📍 ${post.location}</small>
                <p id="content-${index}">${post.content}</p>
                <button id="edit-btn-${index}" onclick="enableEdit(${index})">Edit</button>
                <button onclick="deletePost(${index})">Delete</button>
            </div>
        `
    )
    .join("");
}

// Enable inline editing
function enableEdit(index) {
  const titleElement = document.getElementById(`title-${index}`);
  const contentElement = document.getElementById(`content-${index}`);
  const editButton = document.getElementById(`edit-btn-${index}`);

  if (editButton.textContent === "Edit") {
    titleElement.contentEditable = "true";
    contentElement.contentEditable = "true";
    titleElement.focus();
    editButton.textContent = "Save";
  } else {
    posts[index].title = titleElement.textContent.trim();
    posts[index].content = contentElement.textContent.trim();
    posts[index].dateTime = new Date().toLocaleString(); // update timestamp
    localStorage.setItem("posts", JSON.stringify(posts));
    titleElement.contentEditable = "false";
    contentElement.contentEditable = "false";
    editButton.textContent = "Edit";
    renderPosts(); // re-render to reset buttons
  }
}

// Delete post
function deletePost(index) {
  const confirmDelete = confirm(
    "⚠️ Are you sure you want to delete this post?"
  );
  if (confirmDelete) {
    posts.splice(index, 1);
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
  } else {
    console.log("Post deletion canceled.");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
    const postsList = document.getElementById("posts-list");
    const userName = document.getElementById("user-name");
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id");

    if (!userId) {
        postsList.innerHTML = "<p>ไม่พบโพสต์</p>";
        return;
    }

    try {
        const userResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
        const user = await userResponse.json();
        userName.textContent = user.name;

        const postsResponse = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);
        const posts = await postsResponse.json();

        posts.forEach(post => {
            const postItem = document.createElement("div");
            postItem.classList.add("post-item");
            postItem.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.body}</p>
                <button class="toggle-comments" data-post-id="${post.id}">ดูความคิดเห็น</button>
                <div class="comments-container" id="comments-${post.id}" style="display: none;"></div>
            `;

            postItem.querySelector(".toggle-comments").addEventListener("click", async (event) => {
                const button = event.target;
                const commentsContainer = document.getElementById(`comments-${post.id}`);

                if (commentsContainer.style.display === "none") {
                    try {
                        const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`);
                        const comments = await commentsResponse.json();
                        commentsContainer.innerHTML = comments.map(comment =>
                            `<p><strong>${comment.name}:</strong> ${comment.body}</p>`
                        ).join("");

                        commentsContainer.style.display = "block";
                        button.textContent = "ซ่อนความคิดเห็น";
                    } catch (error) {
                        console.error("Error fetching comments:", error);
                    }
                } else {
                    commentsContainer.style.display = "none";
                    button.textContent = "ดูความคิดเห็น";
                }
            });

            postsList.appendChild(postItem);
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
});

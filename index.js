document.getElementById('fetch-posts').addEventListener('click', fetchPosts);

function showLoading() {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '<p class="loading">Loading...</p>';
}

function showError(message) {
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = `<p class="error">${message}</p>`;
}

function fetchPosts() {
    showLoading();
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(posts => {
            fetch('https://jsonplaceholder.typicode.com/users')
                .then(response => response.json())
                .then(users => {
                    const postsContainer = document.getElementById('posts-container');
                    postsContainer.innerHTML = '';
                    posts.forEach(post => {
                        const user = users.find(user => user.id === post.userId);
                        const postElement = document.createElement('div');
                        postElement.classList.add('post');
                        postElement.innerHTML = `
                            <h2>${post.title}</h2>
                            <p>${post.body}</p>
                            <p><strong>Author:</strong> ${user.name} (${user.email})</p>
                            <button onclick="fetchPostDetails(${post.id}, this)">View Details</button>
                            <div class="post-details" id="post-details-${post.id}"></div>
                        `;
                        postsContainer.appendChild(postElement);
                    });
                })
                .catch(error => showError('Error fetching users.'));
        })
        .catch(error => showError('Error fetching posts.'));
}

function fetchPostDetails(postId, button) {
    const detailsContainer = document.getElementById(`post-details-${postId}`);
    if (detailsContainer.style.display === 'none' || detailsContainer.style.display === '') {
        button.textContent = 'Loading...';
        fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`)
            .then(response => response.json())
            .then(comments => {
                let commentsHtml = '<h3>Comments:</h3>';
                comments.forEach(comment => {
                    commentsHtml += `
                        <div class="comment">
                            <p><strong>${comment.name} (${comment.email})</strong></p>
                            <p>${comment.body}</p>
                        </div>
                    `;
                });
                detailsContainer.innerHTML = commentsHtml;
                detailsContainer.style.display = 'block';
                button.textContent = 'Hide Details';
            })
            .catch(error => showError('Error fetching comments.'));
    } else {
        detailsContainer.style.display = 'none';
        button.textContent = 'View Details';
    }
}

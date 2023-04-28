/* if we wanted to find all users named octocat, we would make a GET request to https://api.github.com/search/users?q=octocat

if we wanted to find all the repositories for a user with GitHub username octocat, 
we would make a GET request to https://api.github.com/users/octocat/repos

The index.html file has a form with a search input. When the form is submitted, 
it should take the value of the input and search GitHub for user matches using the User Search Endpoint.

Using the results of the search, display information about the users to the page. 
(You might include showing their username, avatar and a link to their profile.)

Clicking on one of these users should send a request to the User Repos Endpoint 
and return data about all the repositories for that user.

Using the response from the Users Repos Endpoint, display all the repositories for that user on the page. */

document.addEventListener("DOMContentLoaded", () => {
    const githubForm = document.getElementById("github-form");
    const search = document.getElementById("search");
    const userList = document.getElementById("user-list");
    const reposList = document.getElementById("repos-list");
    
    githubForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const searchValue = search.value;

        fetch(`https://api.github.com/search/users?q=${searchValue}`, {
            headers: {
             "Accept": "application/vnd.github.v3+json"
            }
        })
        .then(response => response.json())
        .then(data => {
            userList.innerText = ""; // clear the search results
            reposList.innerText = "";
            data.items.forEach(user => {
                const li = document.createElement("li");
                const userName = document.createElement("span");
                const userUrl = document.createElement("a");
                const avatar = document.createElement("img");

                userUrl.href = user.html_url;
                userUrl.textContent = user.html_url;
                userName.textContent = user.login;
                avatar.src = user.avatar_url;

                li.append(userName, avatar, userUrl);
                userList.appendChild(li);

                li.addEventListener("click", (e) => {
                    fetch(`https://api.github.com/users/${user.login}/repos`, {
                        headers: {
                            "Accept": "application/vnd.github.v3+json"
                        } 
                    })
                    .then(response => response.json())
                    .then(repos => {
                        userList.innerText = ""; // clear the search results
                        reposList.innerText = "";

                        repos.forEach(repo => {
                            //console.log(repo)
                            const li = document.createElement("li");
                            const a = document.createElement("a");

                            a.href = repo.html_url;
                            a.innerText = repo.name;

                            li.append(a);
                            reposList.appendChild(li);
                        })
                    })
                })
            })
        })
        .catch(error => console.error(error));
    });
});
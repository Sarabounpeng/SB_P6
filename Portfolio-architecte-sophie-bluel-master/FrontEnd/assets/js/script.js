document.addEventListener('DOMContentLoaded', () => {
    const workContainer = document.getElementById('gallery');
    const categoriesContainer = document.getElementById('filter');
    const galerie = document.getElementById('galerie');

    // FETCH DATA FUNCTION
    // getting data reponse and error from API
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    // work API function
    // to show all work at homepage and popup also called delete API to update our work

    async function showWork() {
        const data = await fetchData(`http://localhost:5678/api/works`);

        if (Array.isArray(data)) {
            // Loop through the data and create list items
            workContainer.innerHTML = '';
            galerie.innerHTML = '';
            for (const item of data) {
                let figurePopup = document.createElement('figure');
                let img = document.createElement('img');
                img.src=item.imageUrl;
                figurePopup.appendChild(img);
                let span = document.createElement('span');
                span.classList.add("delete");
                span.id = item.id
                span.addEventListener("click", function(event){
                    deleteWork(event.target.id);
                })
                let i = document.createElement("i");
                i.classList.add("fa-solid");
                i.classList.add("fa-trash-can");
                span.appendChild(i);
                figurePopup.appendChild(span);

                galerie.appendChild(figurePopup);

                const figure = document.createElement('figure');
                figure.classList.add('work-blocks');
                figure.classList.add('all');
                figure.classList.add(`filter_${item.categoryId}`);
                figure.innerHTML =
                    `<img src="${item.imageUrl}" alt="${item.title}">
            <figcaption>${item.title}</figcaption>`
                    ;


                workContainer.appendChild(figure);
               
            }
           
        } else {
            workContainer.textContent = 'Data format is not an array';
        }

    }

    // Category API function
    // to show all category filters

    async function showCategories() {
        const data = await fetchData(`http://localhost:5678/api/categories`);
        if (Array.isArray(data)) {
            for (const item of data) {
                const filter = document.createElement('span');
                filter.classList.add('category-filter');
                filter.dataset.category = `filter_${item.id}`
                filter.innerHTML = `${item.name} `;
                categoriesContainer.appendChild(filter);
                console.log(category);

                filter.addEventListener('click', function (e) {
                    // Select all elements with the class 'category-filter'

                    if (e.target.classList.contains('category-filter')) {
                        var category = e.target.getAttribute('data-category');
                        console.log(category);

                        var workBlock = document.querySelectorAll('.work-blocks');
                        workBlock.forEach((element) => {
                            element.style.display = 'none';
                            if (element.classList.contains(category)) {
                                element.style.display = 'block';
                            }
                        });
                    }

                })

            }
        }
        else {
            categoriesContainer.textContent = 'Data format is not arrey';
        }

    }


    // to show all works using category filters on click ALL (Tous)

    if (workContainer !== null) {
        showWork();
        showCategories();

        document.getElementById('all-category').addEventListener('click', function () {
            var workBlock = document.querySelectorAll('.work-blocks');
            workBlock.forEach(function (element) {
                element.style.display = 'block';
            });
        });

    }

    // delete API
    // suppression des traveaux en click

    async function deleteWork(itemID) {
        try {
            const response = await fetch(`http://localhost:5678/api/works/${itemID}`, {
                method: `DELETE`,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
                }
            });
            if (response.ok) {
                console.log(`Work ${itemID} deleted`);
                showWork();
            }

        }
        catch (error) {
            console.log(error);
        }
    }



    // upload work (des images)

    document.getElementById('uploadForm').addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(this); // Create a FormData object with the form data

        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken') // Include the auth token in the headers
                },
                body: formData // Send the form data
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Work uploaded successfully:', result);
                showWork();
                document.getElementById('uploadwork').classList.add('d-none');
            } else {
                const error = await response.json();
                console.error('Upload failed:', error.message);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    });


    //open & close Models
    const openModelButtons = document.querySelectorAll('.open-model');
    const Models = document.querySelectorAll('.model');
    const CloseModels = document.querySelectorAll('.close-model');

    openModelButtons.forEach(button => {
        button.addEventListener('click', function () {
            Models.forEach(model => {
                model.classList.add('d-none');
            });
            const target = this.getAttribute('data-target');
            
            document.getElementById(target).classList.remove('d-none');

        });
    });

    CloseModels.forEach(button => {
        button.addEventListener('click', function () {
            Models.forEach(model => {
                model.classList.add('d-none');
            });
        });
    });

    // to show image prevu

   
    document.getElementById("image").addEventListener('change', function(event){
        const file = event.target.files[0];
        if(file){
            const reader = new FileReader();
            reader.onload = function(e){
                const imgTag = document.getElementById('image-prev');
                imgTag.src = e.target.result;
                document.getElementById('file-input-design').classList.add('d-none');
            };
            reader.readAsDataURL(file);
        }
    } )


});



// Check if user is already logged in on page load

window.onload = function () {
    const token = localStorage.getItem('authToken');
    if (token) {
        // Assume token is valid and redirect to index.html
        // window.location.href = 'index.html';
        document.getElementById('login').classList.add('d-none');
        document.getElementById('logout').classList.remove('d-none');
        document.getElementById('editWork').classList.remove('d-none');

        document.getElementById('filter').classList.add('d-none');

    }

};

// Logout function
function logout() {
    // Clear the authentication token from localStorage
    localStorage.removeItem('authToken');
    document.getElementById('login').classList.remove('d-none');
    document.getElementById('logout').classList.add('d-none');
    document.getElementById('editWork').classList.add('d-none');
    document.getElementById('filter').classList.remove('d-none');
}

// Attach event listener to the logout button
document.getElementById('logout').addEventListener('click', logout);





// Define the login function
async function login(email, password) {
    const url = 'http://localhost:5678/api/users/login';
    const data = { email, password };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Login successful:', result);
            // Save token to localStorage
            localStorage.setItem('authToken', result.token);
            window.location.href = 'index.html';
        } else {
            console.error('Login failed:', response.statusText);
            document.getElementById("message").innerText = response.statusText;
        }
    } catch (error) {
        console.error('Network error:', error);
        document.getElementById("message").innerText = error;
    }
}

// Attach an event listener to the form
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the values from the form inputs
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Call the login function
    login(email, password);
});

document.addEventListener('DOMContentLoaded', () => {
    const workContainer = document.getElementById('gallery');
    const categoriesContainer = document.getElementById('filter');

// work API start

fetch('http://localhost:5678/api/works')
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    // Check if data is an array

    if (Array.isArray(data)) { 
        // Loop through the data and create list items
        for (const item of data) {
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
})
.catch(error => {
    console.error('Error fetching data:', error);
    workContainer.textContent = 'Error loading data';
});
// work API end

// categories API start
fetch('http://localhost:5678/api/categories') 
.then (response=>{
 if (!response.ok){
     throw new Error ('HTTP error! status: ${response.status}');
 }
 return response.json();
})
.then(data=>{
 if (Array.isArray(data)){
     for (const item of data){
         const filter = document.createElement('span');
         filter.classList.add('category-filter');
         filter.dataset.category= `filter_${item.id}`
         filter.innerHTML=`${item.name} `;
         categoriesContainer.appendChild(filter);

         filter.addEventListener('click', function(e){
            // Select all elements with the class 'category-filter'
        
            if(e.target.classList.contains('category-filter')){
                var category = e.target.getAttribute('data-category');
                console.log(category);
        
                var workBlock = document.querySelectorAll('.work-blocks');
                workBlock.forEach((element) => {
                    element.style.display = 'none';
                    if(element.classList.contains(category)){
                        element.style.display = 'block';
                    }
                });
            }
           
         })

     }
 }
 else {
     categoriesContainer.textContent= 'Data format is not arrey';
 }
})
.catch(error=>{
 console.error('Error fetching data:',error);
 categoriesContainer.textContent = 'Error loading data'
});
// categories API end
});

document.getElementById('all-category').addEventListener('click', function(){
var workBlock= document.querySelectorAll('.work-blocks');
workBlock.forEach(function(element){
    element.style.display='block';
});
});



async function login() {
    let user= document.getElementById("user");
    let password = document.getElementById("password");
    const details = {
        email : user.value,
        password : password.value
    } 
    console.log(details);
    try {
        const response = await fetch("http://localhost:5678/api/users/login",{
         method:"POST",
         headers:{
            "Content-Type":"application/json"

         },
         body: JSON.stringify(details)

        });
        const data = await response.json();
        if (!response.ok){
            document.getElementById("message").innerText=data.message;
        }
        localStorage.setItem('user-access', data.token ||json.stringify(data));
        document.getElementById("message").innerText="user login"
       // onclick="login();"

    } 
    catch(error){
        document.getElementById("message").innerText="wrong password"

    }
}
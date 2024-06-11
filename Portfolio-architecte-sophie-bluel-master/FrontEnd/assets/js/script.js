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
        // Clear the container
        workContainer.textContent = '';

        // Loop through the data and create list items
        for (const item of data) {
            const figure = document.createElement('figure');
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
         filter.innerHTML=
         `<span " ${item.categoryId}"> `;
         categoriesContainer.appendChild(filter);

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

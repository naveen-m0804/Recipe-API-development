document.addEventListener('DOMContentLoaded', function() {
  const applyBtn = document.getElementById('applyFilters');
  const resetBtn = document.getElementById('resetFilters');
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  const currentPageSpan = document.getElementById('currentPage');

  let currentPage = 1;
  let currentData = [];

  applyBtn.addEventListener('click', () => {
    currentPage = 1;
    loadRecipes();
  });

  resetBtn.addEventListener('click', () => {
    currentPage = 1;
    resetFilters();
  });

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      loadRecipes();
    }
  });

  nextBtn.addEventListener('click', () => {
    currentPage++;
    loadRecipes();
  });

  // Drawer close handlers
  document.getElementById('drawerCloseBtn').addEventListener('click', closeDetailDrawer);
  document.getElementById('drawerOverlay').addEventListener('click', closeDetailDrawer);

  // Expand/collapse Total Time details
  document.getElementById('totalTimeHeader').addEventListener('click', () => {
    const content = document.getElementById('expandContent');
    const toggleBtn = document.getElementById('expandToggle');
    const isHidden = content.classList.toggle('hidden');
    toggleBtn.innerHTML = isHidden ? '\u25BC' : '\u25B2'; // Down/up arrow
    toggleBtn.setAttribute('aria-expanded', !isHidden);
  });

  // Initial load
  loadRecipes();

  function resetFilters() {
    document.getElementById('filterTitle').value = '';
    document.getElementById('filterCuisine').value = '';
    document.getElementById('filterRating').value = '';
    document.getElementById('filterTotalTime').value = '';
    document.getElementById('filterServes').value = '';
    document.getElementById('limit').value = 50;
    currentPage = 1;
    loadRecipes();
  }

  function loadRecipes() {
    const title = document.getElementById('filterTitle').value.trim();
    const cuisine = document.getElementById('filterCuisine').value.trim();
    const rating = document.getElementById('filterRating').value.trim();
    const totalTime = document.getElementById('filterTotalTime').value.trim();
    const serves = document.getElementById('filterServes').value.trim();
    let limitInput = document.getElementById('limit').value;
    let limit = parseInt(limitInput, 10);

    // Validate limit input (1 to 50)
    if (isNaN(limit) || limit < 1) {
      limit = 1;
    }

    let url = '/api/recipes/search';
    let params = new URLSearchParams();
    params.append('page', currentPage);
    params.append('limit', limit);

    if (title) params.append('title', title);
    if (cuisine) params.append('cuisine', cuisine);
    if (rating) params.append('rating', rating);
    if (totalTime) params.append('total_time', totalTime);
    if (serves) params.append('serves', serves);

    url = `${url}?${params.toString()}`;
    currentPageSpan.textContent = currentPage;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        currentData = data;
        const recipeList = document.getElementById('recipeList');
        recipeList.innerHTML = '';

        if (data.length === 0) {
          // If no data on next page, revert page increment and show fallback
          if (currentPage > 1) {
            currentPage--;
            currentPageSpan.textContent = currentPage;
          }
          recipeList.innerHTML = `
            <div class="fallback-message">
              <p>No recipes found matching your criteria. Please try different filters.</p>
            </div>
          `;
          return;
        }

        const table = document.createElement('table');
        table.className = 'recipe-table';

        const thead = document.createElement('thead');
        thead.innerHTML = `
          <tr>
            <th>Title</th>
            <th>Cuisine</th>
            <th>Rating</th>
            <th>Total Time</th>
            <th>Serves</th>
          </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        data.forEach(recipe => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td class="truncate">${recipe.title || 'Untitled'}</td>
            <td>${recipe.cuisine || 'N/A'}</td>
            <td>${recipe.rating || 'N/A'}</td>
            <td>${recipe.total_time || 'N/A'}</td>
            <td>${recipe.serves || 'N/A'}</td>
          `;
          tbody.appendChild(row);
        });
        table.appendChild(tbody);
        recipeList.appendChild(table);

        setupRowClickHandlers();
      })
      .catch(error => {
        console.error('Error:', error);
        document.getElementById('recipeList').innerHTML = '<p>Failed to load recipes. Please try again.</p>';
      });
  }

  function setupRowClickHandlers() {
    document.querySelectorAll('tbody tr').forEach((row, index) => {
      row.style.cursor = 'pointer';
      row.onclick = () => openDetailDrawer(currentData[index]);
    });
  }

  function openDetailDrawer(recipe) {
    document.getElementById('drawerTitle').textContent = `${recipe.title} - ${recipe.cuisine}`;
    document.getElementById('drawerDescription').textContent = recipe.description || 'No description available.';
    document.getElementById('drawerTotalTime').textContent = recipe.total_time || 'N/A';
    document.getElementById('drawerCookTime').textContent = recipe.cook_time || 'N/A';
    document.getElementById('drawerPrepTime').textContent = recipe.prep_time || 'N/A';

    const tbody = document.querySelector('#nutritionTable tbody');
    tbody.innerHTML = '';
    const nutrients = recipe.nutrients || {};
    const nutrientKeys = [
      'calories', 'carbohydrateContent', 'cholesterolContent', 'fiberContent',
      'proteinContent', 'saturatedFatContent', 'sodiumContent', 'sugarContent', 'fatContent'
    ];
    nutrientKeys.forEach(key => {
      if (nutrients[key] !== undefined) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${key}</td><td>${nutrients[key]}</td>`;
        tbody.appendChild(tr);
      }
    });

    document.getElementById('detailDrawer').classList.add('visible');
    document.getElementById('detailDrawer').classList.remove('hidden');
    document.getElementById('drawerOverlay').classList.add('visible');
    document.getElementById('drawerOverlay').classList.remove('hidden');
  }

  function closeDetailDrawer() {
    document.getElementById('detailDrawer').classList.remove('visible');
    document.getElementById('detailDrawer').classList.add('hidden');
    document.getElementById('drawerOverlay').classList.remove('visible');
    document.getElementById('drawerOverlay').classList.add('hidden');
  }
});

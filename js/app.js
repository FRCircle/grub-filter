document.addEventListener('DOMContentLoaded', () => {
  const DATA_FILES = ['data/bacolod.yaml', 'data/bago.yaml'];

  // State
  let allLocations = {};
  let currentFile = '';
  let allPlaces = [];
  let activeFilters = {
    cuisine: new Set(),
    type: new Set(),
    ownership: new Set(),
    price: new Set(),
    tags: new Set()
  };

  // DOM Elements
  const els = {
    locationSelect: document.getElementById('locationSelect'),
    grid: document.getElementById('resultsGrid'),
    count: document.getElementById('resultsCount'),
    clearBtn: document.getElementById('clearFilters'),
    filters: {
      cuisine: document.getElementById('filterCuisine'),
      type: document.getElementById('filterType'),
      ownership: document.getElementById('filterOwnership'),
      price: document.getElementById('filterPrice'),
      tags: document.getElementById('filterTags')
    }
  };

  // Initialize
  async function init() {
    try {
      const fetches = DATA_FILES.map(url => 
        fetch(url).then(res => res.ok ? res.text() : null).then(text => {
          if (!text) return null;
          return { url, data: jsyaml.load(text) };
        })
      );
      
      const results = await Promise.all(fetches);
      
      els.locationSelect.innerHTML = ''; // clear loading

      results.forEach(res => {
        if (res && res.data) {
          allLocations[res.url] = res.data;
          const option = document.createElement('option');
          option.value = res.url;
          option.textContent = res.data.title || res.url;
          els.locationSelect.appendChild(option);
        }
      });

      if (Object.keys(allLocations).length === 0) {
        throw new Error("No data loaded");
      }

      // Set initial
      currentFile = els.locationSelect.value;
      loadLocation(currentFile);

      // Listen for changes
      els.locationSelect.addEventListener('change', (e) => {
        loadLocation(e.target.value);
      });
      
    } catch (e) {
      console.error('Error loading data:', e);
      els.grid.innerHTML = `
        <div class="empty-state">
          <span class="empty-state__icon">⚠️</span>
          <h3 class="empty-state__title">Failed to load data</h3>
          <p class="empty-state__text">Could not load the places database. Please try again later.</p>
        </div>
      `;
    }
  }

  function loadLocation(fileUrl) {
    currentFile = fileUrl;
    allPlaces = allLocations[fileUrl].places || [];
    
    // Clear active filters
    Object.keys(activeFilters).forEach(key => activeFilters[key].clear());
    
    buildFilters();
    applyFilters();
  }


  // Build filter UI dynamically based on data
  function buildFilters() {
    const filterData = {
      cuisine: new Map(),
      type: new Map(),
      ownership: new Map(),
      price: new Map(),
      tags: new Map()
    };

    // Extract and count values
    allPlaces.forEach(place => {
      ['cuisine', 'type', 'ownership', 'price'].forEach(key => {
        if (place[key]) {
          const val = place[key].toLowerCase();
          filterData[key].set(val, (filterData[key].get(val) || 0) + 1);
        }
      });
      if (place.tags && Array.isArray(place.tags)) {
        place.tags.forEach(tag => {
          const val = tag.toLowerCase();
          filterData.tags.set(val, (filterData.tags.get(val) || 0) + 1);
        });
      }
    });

    // Render chips
    Object.keys(filterData).forEach(key => {
      const container = els.filters[key];
      if (!container) return;

      container.innerHTML = '';
      
      // Sort alphabetically, or for price sort by length ($, $$, $$$)
      let sortedKeys = Array.from(filterData[key].keys());
      if (key === 'price') {
        sortedKeys.sort((a, b) => a.length - b.length);
      } else {
        sortedKeys.sort();
      }

      sortedKeys.forEach(val => {
        const btn = document.createElement('button');
        btn.className = 'chip';
        btn.innerHTML = `${val}`;
        
        btn.addEventListener('click', () => toggleFilter(key, val, btn));
        container.appendChild(btn);
      });
    });

    els.clearBtn.addEventListener('click', clearAllFilters);
  }

  // Toggle a specific filter value
  function toggleFilter(category, value, btnEl) {
    if (activeFilters[category].has(value)) {
      activeFilters[category].delete(value);
      btnEl.classList.remove('chip--active');
    } else {
      activeFilters[category].add(value);
      btnEl.classList.add('chip--active');
    }
    applyFilters();
  }

  // Clear all filters
  function clearAllFilters() {
    Object.keys(activeFilters).forEach(key => activeFilters[key].clear());
    document.querySelectorAll('.chip--active').forEach(el => el.classList.remove('chip--active'));
    applyFilters();
  }

  // Apply active filters to data
  function applyFilters() {
    const filtered = allPlaces.filter(place => {
      // For each category, if it has active filters, the place must match AT LEAST ONE (OR within category)
      // All categories must pass (AND between categories)
      
      return Object.keys(activeFilters).every(category => {
        const activeSet = activeFilters[category];
        if (activeSet.size === 0) return true; // No filter selected for this category = pass

        if (category === 'tags') {
          // If filtering by tags, the place must have AT LEAST ONE of the active tags
          if (!place.tags || !Array.isArray(place.tags)) return false;
          return place.tags.some(tag => activeSet.has(tag.toLowerCase()));
        } else {
          if (!place[category]) return false;
          return activeSet.has(place[category].toLowerCase());
        }
      });
    });

    renderPlaces(filtered);
  }

  // Render places to DOM
  function renderPlaces(places) {
    els.count.innerHTML = `Showing <strong>${places.length}</strong> places`;
    els.grid.innerHTML = '';

    if (places.length === 0) {
      els.grid.innerHTML = `
        <div class="empty-state">
          <span class="empty-state__icon">🍽️</span>
          <h3 class="empty-state__title">No places found</h3>
          <p class="empty-state__text">Try adjusting your filters to see more results.</p>
        </div>
      `;
      return;
    }

    places.forEach((place, index) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.style.animationDelay = `${index * 50}ms`;
      
      let addressHtml = '';
      if (place.address && Array.isArray(place.address)) {
        addressHtml = `
          <div class="card__locations">
            ${place.address.map((addr) => `
              <a href="${addr.gmap}" target="_blank" rel="noopener noreferrer" class="card__location-link">
                📍 ${addr.loc}
              </a>
            `).join('')}
          </div>
        `;
      } else if (typeof place.address === 'string') {
        addressHtml = `<p class="card__address">${place.address}</p>`;
      }

      card.innerHTML = `
        <div class="card__header">
          <h2 class="card__name">${place.name}</h2>
        </div>
        
        ${place.description ? `<p class="card__description">${place.description}</p>` : ''}
        
        ${addressHtml}
      `;

      els.grid.appendChild(card);
    });
  }

  // Run
  init();
});

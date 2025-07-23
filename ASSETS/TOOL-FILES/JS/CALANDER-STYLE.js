// Enhanced Calendar Data
const months = ["January", "February", "March", "April", "May", "June", 
               "July", "August", "September", "October", "November", "December"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Current Date
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Event Storage
function getEvents() {
    const events = localStorage.getItem('calendarEvents');
    return events ? JSON.parse(events) : {};
}

function saveEvents(events) {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
}

// Calendar Rendering
function renderCalendar() {
    const calendarEl = document.getElementById('calendar');
    calendarEl.innerHTML = '';

    // Update month/year header
    document.getElementById('current-month').textContent = `${months[currentMonth]} ${currentYear}`;

    // Days of week header
    const daysHeader = document.createElement('div');
    daysHeader.className = 'calendar-header';
    days.forEach(day => {
        const dayEl = document.createElement('div');
        dayEl.textContent = day.substring(0, 3);
        daysHeader.appendChild(dayEl);
    });
    calendarEl.appendChild(daysHeader);

    // Get first day and days in month
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Create calendar grid
    const grid = document.createElement('div');
    grid.className = 'calendar-grid';

    // Empty cells for days before first day
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day empty';
        grid.appendChild(emptyCell);
    }

    // Days of month
    for (let i = 1; i <= daysInMonth; i++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        
        // Highlight current day
        if (i === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear()) {
            dayCell.classList.add('current-day');
        }

        // Day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = i;
        dayCell.appendChild(dayNumber);

        // Check for events
        const dateKey = `${currentYear}-${currentMonth}-${i}`;
        const events = getEvents();
        
        if (events[dateKey]) {
            const eventIndicator = document.createElement('div');
            eventIndicator.className = 'event-indicator';
            
            // Add category color
            const categorySpan = document.createElement('span');
            categorySpan.className = `event-category category-${events[dateKey].category || 'general'}`;
            categorySpan.textContent = events[dateKey].category || 'General';
            eventIndicator.appendChild(categorySpan);
            
            // Add event title
            const titleSpan = document.createElement('span');
            titleSpan.textContent = events[dateKey].title;
            eventIndicator.appendChild(titleSpan);
            
            dayCell.appendChild(eventIndicator);
            dayCell.classList.add('has-event');
        }

        // Click event
        dayCell.addEventListener('click', () => openEventModal(dateKey));
        grid.appendChild(dayCell);
    }

    calendarEl.appendChild(grid);
}

// Navigation controls
document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

document.getElementById('today-btn').addEventListener('click', () => {
    currentDate = new Date();
    currentMonth = currentDate.getMonth();
    currentYear = currentDate.getFullYear();
    renderCalendar();
});

// Event Modal
function openEventModal(dateKey) {
    const modal = document.getElementById('event-modal');
    const events = getEvents();
    const event = events[dateKey] || {};
    
    // Parse date from dateKey (format: YYYY-M-D)
    const [year, month, day] = dateKey.split('-');
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Set default time to current time + 1 hour
    const now = new Date();
    const startTime = new Date(now.getTime() + 60 * 60 * 1000);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
    
    // Format for datetime-local input
    const formatForInput = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    };
    
    document.getElementById('event-start').value = event.start || formatForInput(startTime);
    document.getElementById('event-end').value = event.end || formatForInput(endTime);
    document.getElementById('event-title').value = event.title || '';
    document.getElementById('event-note').value = event.note || '';
    document.getElementById('event-category').value = event.category || 'general';
    
    // Set recurrence fields if they exist
    if (event.recurrence) {
        document.getElementById('recurring-event').checked = true;
        document.getElementById('recurrence-settings').classList.remove('hidden');
        document.getElementById('recurrence-type').value = event.recurrence.type || 'daily';
        document.getElementById('recurrence-interval').value = event.recurrence.interval || 1;
        document.getElementById('recurrence-end-date').value = event.recurrence.endDate || '';
    } else {
        document.getElementById('recurring-event').checked = false;
        document.getElementById('recurrence-settings').classList.add('hidden');
    }
    
    const deleteBtn = document.getElementById('delete-event');
    if (event.title) {
        document.getElementById('modal-title').textContent = 'Edit Event';
        deleteBtn.classList.remove('hidden');
        deleteBtn.setAttribute('data-date', dateKey);
    } else {
        document.getElementById('modal-title').textContent = 'Add Event';
        deleteBtn.classList.add('hidden');
    }
    
    modal.classList.remove('hidden');
}

// Save Event
document.getElementById('save-event').addEventListener('click', () => {
    const title = document.getElementById('event-title').value.trim();
    const category = document.getElementById('event-category').value;
    const start = document.getElementById('event-start').value;
    const end = document.getElementById('event-end').value;
    const note = document.getElementById('event-note').value.trim();
    const isRecurring = document.getElementById('recurring-event').checked;
    
    if (!title) {
        alert('Please enter an event title');
        return;
    }
    
    // Get date from start time
    const dateObj = new Date(start);
    const dateKey = `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()}`;
    
    const events = getEvents();
    events[dateKey] = { 
        title, 
        category,
        start,
        end,
        note,
        isRecurring
    };
    
    if (isRecurring) {
        const recurrenceType = document.getElementById('recurrence-type').value;
        const interval = parseInt(document.getElementById('recurrence-interval').value) || 1;
        const endDate = document.getElementById('recurrence-end-date').value;
        
        events[dateKey].recurrence = {
            type: recurrenceType,
            interval,
            endDate
        };
    }
    
    saveEvents(events);
    document.getElementById('event-modal').classList.add('hidden');
    renderCalendar();
});

// Delete Event
document.getElementById('delete-event').addEventListener('click', function() {
    const dateKey = this.getAttribute('data-date');
    const events = getEvents();
    
    if (events[dateKey]) {
        if (confirm('Are you sure you want to delete this event?')) {
            delete events[dateKey];
            saveEvents(events);
            document.getElementById('event-modal').classList.add('hidden');
            renderCalendar();
        }
    }
});

// Events List with Filtering
document.getElementById('view-events').addEventListener('click', () => {
    const modal = document.getElementById('events-list-modal');
    renderEventsList();
    modal.classList.remove('hidden');
});

function renderEventsList() {
    const eventsList = document.getElementById('events-list');
    const events = getEvents();
    const categoryFilter = document.getElementById('event-filter-category').value;
    const dateFilter = document.getElementById('event-filter-date').value;
    
    eventsList.innerHTML = '';
    
    // Sort events by date
    const sortedEvents = Object.entries(events).sort((a, b) => {
        return new Date(a[1].start) - new Date(b[1].start);
    });
    
    if (sortedEvents.length === 0) {
        eventsList.innerHTML = '<p>No events found</p>';
    } else {
        sortedEvents.forEach(([dateKey, event]) => {
            // Apply filters
            if (categoryFilter !== 'all' && event.category !== categoryFilter) return;
            
            if (dateFilter) {
                const eventDate = new Date(event.start).toISOString().split('T')[0];
                if (eventDate !== dateFilter) return;
            }
            
            const eventEl = document.createElement('div');
            eventEl.className = 'event-item';
            
            const eventDate = new Date(event.start);
            const endDate = event.end ? new Date(event.end) : null;
            
            let dateTimeStr = `${months[eventDate.getMonth()]} ${eventDate.getDate()}, ${eventDate.getFullYear()}`;
            
            if (eventDate.getHours() || eventDate.getMinutes()) {
                dateTimeStr += ` at ${eventDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                
                if (endDate) {
                    dateTimeStr += ` - ${endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
                }
            }
            
            eventEl.innerHTML = `
                <div class="event-date">${dateTimeStr}</div>
                <div class="event-category category-${event.category || 'general'}">${event.category || 'General'}</div>
                <div class="event-title">${event.title}</div>
                ${event.note ? `<div class="event-note">${event.note}</div>` : ''}
                <button class="delete-event-btn" data-date="${dateKey}">
                    <span class="material-icons">delete</span>
                </button>
            `;
            
            // Add delete event handler
            eventEl.querySelector('.delete-event-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this event?')) {
                    const events = getEvents();
                    delete events[dateKey];
                    saveEvents(events);
                    renderEventsList();
                    renderCalendar();
                }
            });
            
            eventsList.appendChild(eventEl);
        });
    }
}

// Filter events when filter values change
document.getElementById('event-filter-category').addEventListener('change', renderEventsList);
document.getElementById('event-filter-date').addEventListener('change', renderEventsList);

// Close modals
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.add('hidden');
    }
});

// Toggle recurrence settings
document.getElementById('recurring-event').addEventListener('change', (e) => {
    document.getElementById('recurrence-settings').classList.toggle('hidden', !e.target.checked);
});

// Initialize calendar
document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
    
    // Set default filter date to today
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    document.getElementById('event-filter-date').value = todayStr;
});
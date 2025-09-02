// List View JavaScript Functions

// Toggle group collapse/expand
function toggleGroup(groupId) {
    const group = document.querySelector(`[data-status="${groupId}"]`);
    const content = document.getElementById(`${groupId}-content`);
    const arrow = group.querySelector('.collapse-arrow');
    
    if (group.classList.contains('collapsed')) {
        group.classList.remove('collapsed');
        content.style.display = 'block';
        arrow.textContent = '▼';
    } else {
        group.classList.add('collapsed');
        content.style.display = 'none';
        arrow.textContent = '▶';
    }
}

// Add new proposal
function addProposal(status) {
    const proposalName = prompt('Enter proposal name:');
    if (proposalName) {
        showToast(`New proposal "${proposalName}" added to ${status.toUpperCase()}`, 'success');
        // In real app, this would add to database and refresh the list
        location.reload();
    }
}

// Open proposal menu
function openProposalMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('proposalMenu');
    const button = event.target;
    const rect = button.getBoundingClientRect();
    
    // Position menu near the button
    menu.style.left = rect.left - 150 + 'px';
    menu.style.top = rect.bottom + 5 + 'px';
    menu.style.display = 'block';
    
    // Store reference to the current proposal row
    menu.dataset.currentRow = button.closest('tr').querySelector('.proposal-name').textContent.trim();
    
    // Close menu when clicking outside
    document.addEventListener('click', closeProposalMenu);
}

// Close proposal menu
function closeProposalMenu() {
    const menu = document.getElementById('proposalMenu');
    menu.style.display = 'none';
    document.removeEventListener('click', closeProposalMenu);
}

// Menu actions
function viewDetails() {
    const proposalName = document.getElementById('proposalMenu').dataset.currentRow;
    showToast(`Opening details for: ${proposalName}`, 'info');
    closeProposalMenu();
    window.location.href = 'proposal-detail.html';
}

function editProposal() {
    const proposalName = document.getElementById('proposalMenu').dataset.currentRow;
    showToast(`Editing: ${proposalName}`, 'info');
    closeProposalMenu();
    window.location.href = 'proposal-detail.html';
}

function changeStatus() {
    closeProposalMenu();
    const newStatus = prompt('Select new status:\n1. Pending\n2. Triage\n3. Drafting\n4. Review\n5. Sent\n6. Negotiation\n7. Won\n8. Lost');
    if (newStatus) {
        showToast('Status updated successfully', 'success');
    }
}

function assignTo() {
    closeProposalMenu();
    const assignee = prompt('Assign to:\n1. Hamza\n2. Abdul\n3. Unassigned');
    if (assignee) {
        showToast('Proposal reassigned successfully', 'success');
    }
}

function duplicateProposal() {
    const proposalName = document.getElementById('proposalMenu').dataset.currentRow;
    showToast(`Duplicated: ${proposalName}`, 'success');
    closeProposalMenu();
}

function deleteProposal() {
    const proposalName = document.getElementById('proposalMenu').dataset.currentRow;
    if (confirm(`Are you sure you want to delete "${proposalName}"?`)) {
        showToast('Proposal deleted', 'error');
        closeProposalMenu();
        // In real app, this would delete from database and refresh
        location.reload();
    }
}

// Toggle subtasks
function toggleSubtasks() {
    showToast('Subtasks view toggled', 'info');
}

// Toggle columns
function toggleColumns() {
    const columnsModal = `
        <div class="modal" style="display: block;">
            <div class="modal-content" style="max-width: 400px;">
                <h3>Show/Hide Columns</h3>
                <div style="margin: 1rem 0;">
                    <label style="display: block; margin: 0.5rem 0;">
                        <input type="checkbox" checked> Status
                    </label>
                    <label style="display: block; margin: 0.5rem 0;">
                        <input type="checkbox" checked> Name
                    </label>
                    <label style="display: block; margin: 0.5rem 0;">
                        <input type="checkbox" checked> DFY Partner
                    </label>
                    <label style="display: block; margin: 0.5rem 0;">
                        <input type="checkbox" checked> Value
                    </label>
                    <label style="display: block; margin: 0.5rem 0;">
                        <input type="checkbox" checked> Assignee
                    </label>
                    <label style="display: block; margin: 0.5rem 0;">
                        <input type="checkbox"> Created Date
                    </label>
                    <label style="display: block; margin: 0.5rem 0;">
                        <input type="checkbox"> Last Updated
                    </label>
                    <label style="display: block; margin: 0.5rem 0;">
                        <input type="checkbox"> Priority
                    </label>
                </div>
                <button class="btn btn-primary" onclick="this.closest('.modal').remove()">Apply</button>
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', columnsModal);
}

// Group proposals by different criteria
function groupProposals(groupBy) {
    showToast(`Regrouping by ${groupBy}`, 'info');
    // In real app, this would reorganize the data
    setTimeout(() => {
        location.reload();
    }, 1000);
}

// Initialize list view
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard shortcuts for list view
    document.addEventListener('keydown', function(e) {
        // Cmd/Ctrl + K for quick search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchModal = `
                <div class="modal" style="display: block;">
                    <div class="modal-content" style="max-width: 600px;">
                        <h3>Quick Search</h3>
                        <input type="text" class="search-input" style="width: 100%; margin: 1rem 0;" 
                               placeholder="Search proposals..." autofocus>
                        <div class="search-results" style="max-height: 300px; overflow-y: auto;">
                            <!-- Results would appear here -->
                        </div>
                        <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', searchModal);
            document.querySelector('.modal input').focus();
        }
        
        // Arrow keys to navigate between groups
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            const groups = document.querySelectorAll('.status-group');
            let currentIndex = -1;
            groups.forEach((group, index) => {
                if (group.querySelector('.group-header:hover')) {
                    currentIndex = index;
                }
            });
            
            if (e.key === 'ArrowUp' && currentIndex > 0) {
                groups[currentIndex - 1].querySelector('.group-header').focus();
            } else if (e.key === 'ArrowDown' && currentIndex < groups.length - 1) {
                groups[currentIndex + 1].querySelector('.group-header').focus();
            }
        }
    });
    
    // Auto-refresh data every 30 seconds
    setInterval(() => {
        // In real app, this would fetch new data
        console.log('Refreshing data...');
    }, 30000);
    
    // Add row selection functionality
    const rows = document.querySelectorAll('.proposal-row');
    rows.forEach(row => {
        row.addEventListener('click', function(e) {
            if (!e.target.classList.contains('action-btn')) {
                // Remove previous selection
                document.querySelectorAll('.proposal-row.selected').forEach(r => {
                    r.classList.remove('selected');
                });
                // Add selection to current row
                this.classList.add('selected');
                this.style.background = '#f0f9ff';
            }
        });
    });
    
    // Bulk actions with shift+click
    let lastSelectedRow = null;
    rows.forEach((row, index) => {
        row.addEventListener('click', function(e) {
            if (e.shiftKey && lastSelectedRow !== null) {
                const start = Math.min(lastSelectedRow, index);
                const end = Math.max(lastSelectedRow, index);
                for (let i = start; i <= end; i++) {
                    rows[i].classList.add('selected');
                    rows[i].style.background = '#f0f9ff';
                }
            } else if (!e.target.classList.contains('action-btn')) {
                lastSelectedRow = index;
            }
        });
    });
    
    // Add inline editing capability
    document.querySelectorAll('.value-cell').forEach(cell => {
        cell.addEventListener('dblclick', function() {
            const currentValue = this.textContent;
            this.innerHTML = `<input type="text" value="${currentValue}" style="width: 100%; padding: 0.25rem;">`;
            const input = this.querySelector('input');
            input.focus();
            input.select();
            
            input.addEventListener('blur', function() {
                const newValue = this.value;
                cell.textContent = newValue;
                showToast('Value updated', 'success');
            });
            
            input.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    this.blur();
                }
            });
        });
    });
    
    // Calculate and update totals
    function updateTotals() {
        document.querySelectorAll('.status-group').forEach(group => {
            const values = group.querySelectorAll('.value-cell');
            let total = 0;
            values.forEach(cell => {
                const value = cell.textContent.replace('$', '').replace(',', '').replace('—', '0');
                total += parseFloat(value) || 0;
            });
            const totalElement = group.querySelector('.group-total');
            if (totalElement) {
                totalElement.textContent = '$' + total.toLocaleString();
            }
        });
    }
    
    // Update totals on load
    updateTotals();
});
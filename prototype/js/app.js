// Hexona OS - Main Application JavaScript

// Partner Dropdown functionality
function togglePartnerDropdown(event, proposalId) {
    event.stopPropagation();
    const dropdownMenu = document.getElementById(`partner-menu-${proposalId}`);
    const selectedDiv = event.currentTarget;
    
    // Close all other dropdowns
    document.querySelectorAll('.partner-dropdown-menu').forEach(menu => {
        if (menu !== dropdownMenu) {
            menu.classList.remove('show');
        }
    });
    document.querySelectorAll('.partner-selected').forEach(selected => {
        if (selected !== selectedDiv) {
            selected.classList.remove('active');
        }
    });
    
    // Toggle current dropdown
    dropdownMenu.classList.toggle('show');
    selectedDiv.classList.toggle('active');
}

function selectPartner(event, proposalId, partnerName) {
    event.stopPropagation();
    
    // Update the selected partner display
    const selectedDiv = document.querySelector(`#partner-menu-${proposalId}`).previousElementSibling;
    selectedDiv.querySelector('span:first-child').textContent = partnerName;
    selectedDiv.setAttribute('data-partner', partnerName);
    
    // Update selected state in menu
    const menu = document.getElementById(`partner-menu-${proposalId}`);
    menu.querySelectorAll('.partner-option').forEach(option => {
        option.classList.remove('selected');
        if (option.textContent === partnerName) {
            option.classList.add('selected');
        }
    });
    
    // Close dropdown
    menu.classList.remove('show');
    selectedDiv.classList.remove('active');
    
    // Show notification
    showToast(`Partner updated to ${partnerName}`, 'success');
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.partner-dropdown')) {
        document.querySelectorAll('.partner-dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
        document.querySelectorAll('.partner-selected').forEach(selected => {
            selected.classList.remove('active');
        });
    }
});

// Drag and Drop functionality for pipeline cards
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    ev.target.classList.add('dragging');
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    
    // Find the column body
    let target = ev.target;
    while (target && !target.classList.contains('column-body')) {
        target = target.parentElement;
    }
    
    if (target) {
        target.appendChild(draggedElement);
        draggedElement.classList.remove('dragging');
        
        // Update column counts
        updateColumnCounts();
        
        // Show notification
        const newStatus = target.parentElement.getAttribute('data-status');
        showToast(`Proposal moved to ${newStatus.toUpperCase()}`, 'success');
    }
}

// Update column counts after drag and drop
function updateColumnCounts() {
    const columns = document.querySelectorAll('.pipeline-column');
    columns.forEach(column => {
        const cards = column.querySelectorAll('.proposal-card').length;
        const countElement = column.querySelector('.column-count');
        if (countElement) {
            countElement.textContent = cards;
        }
    });
}

// Open proposal detail modal
function openProposalDetail(proposalId) {
    const modal = document.getElementById('proposalModal');
    const modalBody = document.getElementById('modalBody');
    
    // Simulate loading proposal details
    modalBody.innerHTML = `
        <h2>Proposal Details</h2>
        <p>Loading details for ${proposalId}...</p>
        <div style="margin-top: 20px;">
            <h3>Quick Actions</h3>
            <button class="btn btn-primary" onclick="window.location.href='proposal-detail.html'">View Full Details</button>
            <button class="btn btn-secondary" onclick="closeModal()">Close</button>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('proposalModal');
    modal.style.display = 'none';
}

// Open new proposal form
function openNewProposal() {
    showToast('Redirecting to Tally form...', 'info');
    setTimeout(() => {
        window.open('https://tally.so/hexona-proposal', '_blank');
    }, 1000);
}

// Show toast notification
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 3000);
}

// Partner Portal Functions
function filterProposals(status) {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.partner-proposal-card');
    
    // Update active button
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.onclick.toString().includes(status)) {
            btn.classList.add('active');
        }
    });
    
    // Filter cards
    cards.forEach(card => {
        if (status === 'all') {
            card.style.display = 'block';
        } else {
            const cardStatus = card.getAttribute('data-status');
            card.style.display = cardStatus === status ? 'block' : 'none';
        }
    });
}

function updateProposalStatus(selectElement, proposalId) {
    const newStatus = selectElement.value;
    showToast(`Status updated to: ${newStatus.replace('_', ' ').toUpperCase()}`, 'success');
    
    // Update the status bar color based on new status
    const card = selectElement.closest('.partner-proposal-card');
    const statusBar = card.querySelector('.proposal-status-bar');
    
    // Remove all status classes
    statusBar.classList.remove('sent', 'negotiation', 'won', 'lost');
    
    // Add appropriate class based on status
    if (newStatus === 'won') {
        statusBar.classList.add('won');
        statusBar.querySelector('.status-label').textContent = 'WON';
    } else if (newStatus === 'lost') {
        statusBar.classList.add('lost');
        statusBar.querySelector('.status-label').textContent = 'LOST';
    } else if (['negotiating', 'verbal'].includes(newStatus)) {
        statusBar.classList.add('negotiation');
        statusBar.querySelector('.status-label').textContent = 'NEGOTIATION';
    } else {
        statusBar.classList.add('sent');
        statusBar.querySelector('.status-label').textContent = 'SENT';
    }
}

function viewProposal(proposalId) {
    window.location.href = 'proposal-detail.html';
}

function downloadProposal(proposalId) {
    showToast('Generating PDF...', 'info');
    setTimeout(() => {
        showToast('PDF downloaded successfully!', 'success');
    }, 1500);
}

function addComment(proposalId) {
    const input = event.target.previousElementSibling;
    const comment = input.value.trim();
    
    if (comment) {
        showToast('Comment added successfully!', 'success');
        input.value = '';
        
        // Add comment to the UI
        const commentsSection = input.closest('.comments-section');
        const newComment = document.createElement('div');
        newComment.className = 'comment';
        newComment.innerHTML = `
            <span class="comment-author">You:</span>
            <span class="comment-text">${comment}</span>
        `;
        commentsSection.insertBefore(newComment, input);
    }
}

function viewContract(proposalId) {
    showToast('Loading contract details...', 'info');
}

// Proposal Detail Page Functions
function switchTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-panel');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Mark button as active
    event.target.classList.add('active');
}

function saveProposal() {
    showToast('Proposal saved successfully!', 'success');
    
    // Update status indicator
    const statusIndicator = document.querySelector('.status-indicator');
    if (statusIndicator) {
        statusIndicator.textContent = 'Saved';
        setTimeout(() => {
            statusIndicator.textContent = 'Auto-saving...';
        }, 2000);
    }
}

function approveProposal() {
    if (confirm('Are you sure you want to approve and send this proposal?')) {
        showToast('Proposal approved and sent to partner!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

function requestRevision() {
    const reason = prompt('Please provide revision feedback:');
    if (reason) {
        showToast('Revision request sent to Abdul', 'info');
    }
}

function previewProposal() {
    window.open('proposal-detail.html#preview', '_blank');
}

function moveToNextStage() {
    showToast('Proposal moved to next stage', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function postComment() {
    const textarea = document.querySelector('.comment-textarea');
    const comment = textarea.value.trim();
    
    if (comment) {
        const thread = document.querySelector('.comment-thread');
        const newComment = document.createElement('div');
        newComment.className = 'comment-item';
        newComment.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">You</span>
                <span class="comment-time">Just now</span>
            </div>
            <div class="comment-body">
                <p>${comment}</p>
            </div>
        `;
        thread.appendChild(newComment);
        
        textarea.value = '';
        showToast('Comment posted successfully!', 'success');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add animation to metrics on load
    const metrics = document.querySelectorAll('.metric-value');
    metrics.forEach((metric, index) => {
        setTimeout(() => {
            metric.style.animation = 'fadeInUp 0.5s ease';
        }, index * 100);
    });
    
    // Simulate real-time updates
    setInterval(() => {
        const notifications = document.querySelector('.notification-badge');
        if (notifications && Math.random() > 0.8) {
            const currentCount = parseInt(notifications.textContent);
            notifications.textContent = currentCount + 1;
            showToast('New proposal received!', 'info');
        }
    }, 30000); // Check every 30 seconds
    
    // Auto-save for editable content
    const editableElements = document.querySelectorAll('[contenteditable="true"]');
    editableElements.forEach(element => {
        element.addEventListener('input', () => {
            const statusIndicator = document.querySelector('.status-indicator');
            if (statusIndicator) {
                statusIndicator.textContent = 'Saving...';
                setTimeout(() => {
                    statusIndicator.textContent = 'Auto-saved';
                }, 1000);
            }
        });
    });
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        const modal = document.getElementById('proposalModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + N for new proposal
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            openNewProposal();
        }
        
        // Escape to close modal
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Simulate live SLA updates
    setInterval(() => {
        const slaElements = document.querySelectorAll('.card-sla');
        slaElements.forEach(sla => {
            const text = sla.textContent;
            const match = text.match(/(\d+)([hm])/);
            if (match) {
                let value = parseInt(match[1]);
                const unit = match[2];
                
                if (unit === 'm' && value > 0) {
                    value -= 1;
                    sla.textContent = `${value}m left`;
                    
                    // Update color based on time remaining
                    sla.classList.remove('green', 'yellow', 'red');
                    if (value > 30) {
                        sla.classList.add('green');
                    } else if (value > 15) {
                        sla.classList.add('yellow');
                    } else {
                        sla.classList.add('red');
                    }
                }
            }
        });
    }, 60000); // Update every minute
});

// Animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
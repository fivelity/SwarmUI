
/**
 * Keyboard shortcuts and UX improvements for SwarmUI
 * Provides: Enter to generate, Esc to close modals, arrow keys for batch navigation,
 * auto-expanding textareas, keyboard shortcuts help, prompt history, empty states, and expandable status bar
 */

class KeyboardShortcuts {
    constructor() {
        this.promptHistory = this.loadPromptHistory();
        this.currentBatchIndex = -1;
        this.batchImages = [];
        this.statusBarExpanded = false;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.setupEnterToGenerate();
        this.setupEscToClose();
        this.setupArrowKeysForBatch();
        this.setupAutoExpandingTextarea();
        this.setupKeyboardShortcutsHelp();
        this.setupPromptHistory();
        this.setupEmptyStates();
        this.setupExpandableStatusBar();
    }

    // ========================================
    // 1. Enter key to generate in prompt field
    // ========================================
    setupEnterToGenerate() {
        const promptTextarea = document.getElementById('alt_prompt_textbox');
        const negativePromptTextarea = document.getElementById('alt_negativeprompt_textbox');

        const handleEnter = (e) => {
            // Allow Shift+Enter for new lines, Ctrl+Enter is already handled elsewhere
            if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                // Check if Enter-to-generate is enabled (respect user setting if it exists)
                let enterKeyGenerates = true;
                if (typeof internalSiteJsGetUserSetting === 'function') {
                    enterKeyGenerates = internalSiteJsGetUserSetting('enterkeygenerates', 'true') === 'true';
                } else if (typeof getUserSetting === 'function') {
                    enterKeyGenerates = getUserSetting('enterkeygenerates') !== false;
                }
                
                if (enterKeyGenerates) {
                    // Only trigger if we're in the prompt field (not negative prompt, unless it's focused)
                    const isNegativePrompt = e.target.id === 'alt_negativeprompt_textbox';
                    if (!isNegativePrompt || (isNegativePrompt && !promptTextarea.value.trim())) {
                        e.preventDefault();
                        e.stopPropagation();
                        const generateButton = document.getElementById('alt_generate_button');
                        if (generateButton && typeof mainGenHandler !== 'undefined' && mainGenHandler) {
                            generateButton.click();
                        }
                    }
                }
            }
        };

        if (promptTextarea) {
            // Use bubble phase so existing handlers can work first
            promptTextarea.addEventListener('keydown', handleEnter, false);
            // Add hint in placeholder (only if not already there)
            if (promptTextarea.placeholder && !promptTextarea.placeholder.includes('Enter')) {
                const placeholder = promptTextarea.placeholder;
                promptTextarea.placeholder = placeholder.replace('...', '... (Press Enter to generate)');
            }
        }

        if (negativePromptTextarea) {
            negativePromptTextarea.addEventListener('keydown', handleEnter, false);
        }
    }

    // ========================================
    // 2. Esc key to close modals and popovers
    // ========================================
    setupEscToClose() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                // Close visible popovers first
                const visiblePopovers = document.querySelectorAll('.sui-popover-visible');
                if (visiblePopovers.length > 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    visiblePopovers.forEach(popover => {
                        const id = popover.id.replace('popover_', '');
                        if (typeof hidePopover === 'function') {
                            hidePopover(id);
                        } else {
                            popover.classList.remove('sui-popover-visible');
                            popover.dataset.visible = 'false';
                        }
                    });
                    return;
                }

                // Close Bootstrap modals
                const openModals = document.querySelectorAll('.modal.show, .modal[style*="display: block"]');
                if (openModals.length > 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    openModals.forEach(modal => {
                        if (typeof hideModalById === 'function' && modal.id) {
                            hideModalById(modal.id);
                        } else if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                            const instance = bootstrap.Modal.getInstance(modal);
                            if (instance) {
                                instance.hide();
                            }
                        } else {
                            modal.style.display = 'none';
                            modal.classList.remove('show');
                        }
                    });
                    return;
                }

                // Close image full view modal if open
                const imageFullViewModal = document.getElementById('image_fullview_modal');
                if (imageFullViewModal && (imageFullViewModal.style.display === 'block' || imageFullViewModal.classList.contains('show'))) {
                    e.preventDefault();
                    if (typeof imageFullView !== 'undefined' && imageFullView && typeof imageFullView.close === 'function') {
                        imageFullView.close();
                    } else if (typeof hideModalById === 'function') {
                        hideModalById('image_fullview_modal');
                    }
                }
            }
        });
    }

    // ========================================
    // 3. Arrow keys for batch gallery navigation
    // ========================================
    setupArrowKeysForBatch() {
        const updateBatchImages = () => {
            const batchContainer = document.getElementById('current_image_batch');
            if (!batchContainer) return;
            this.batchImages = Array.from(batchContainer.querySelectorAll('.image-block'));
            this.currentBatchIndex = this.batchImages.findIndex(img => 
                img.dataset.src === (typeof currentImgSrc !== 'undefined' ? currentImgSrc : null)
            );
        };

        // Update batch images when they change
        const batchObserver = new MutationObserver(() => {
            updateBatchImages();
        });

        const batchContainer = document.getElementById('current_image_batch');
        if (batchContainer) {
            batchObserver.observe(batchContainer, { childList: true, subtree: true });
            updateBatchImages();
        }

        // Handle arrow key navigation
        document.addEventListener('keydown', (e) => {
            // Only handle if not typing in an input/textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                return;
            }

            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                updateBatchImages();
                if (this.batchImages.length === 0) return;

                if (e.key === 'ArrowLeft') {
                    this.currentBatchIndex = Math.max(0, this.currentBatchIndex - 1);
                } else {
                    this.currentBatchIndex = Math.min(this.batchImages.length - 1, this.currentBatchIndex + 1);
                }

                const targetImage = this.batchImages[this.currentBatchIndex];
                if (targetImage && typeof clickImageInBatch === 'function') {
                    e.preventDefault();
                    clickImageInBatch(targetImage);
                    // Scroll into view
                    targetImage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }
        });
    }

    // ========================================
    // 4. Make prompt textarea auto-expanding
    // ========================================
    setupAutoExpandingTextarea() {
        const autoExpand = (textarea) => {
            textarea.style.height = 'auto';
            const newHeight = Math.min(textarea.scrollHeight, 300); // Max 300px
            textarea.style.height = newHeight + 'px';
            textarea.style.overflowY = newHeight >= 300 ? 'auto' : 'hidden';
        };

        const promptTextarea = document.getElementById('alt_prompt_textbox');
        const negativePromptTextarea = document.getElementById('alt_negativeprompt_textbox');

        if (promptTextarea) {
            promptTextarea.addEventListener('input', () => autoExpand(promptTextarea));
            promptTextarea.style.resize = 'none';
            promptTextarea.style.overflowY = 'hidden';
            autoExpand(promptTextarea); // Initial sizing
        }

        if (negativePromptTextarea) {
            negativePromptTextarea.addEventListener('input', () => autoExpand(negativePromptTextarea));
            negativePromptTextarea.style.resize = 'none';
            negativePromptTextarea.style.overflowY = 'hidden';
            autoExpand(negativePromptTextarea); // Initial sizing
        }
    }

    // ========================================
    // 5. Keyboard shortcuts help modal
    // ========================================
    setupKeyboardShortcutsHelp() {
        // Create modal HTML
        const modalHtml = `
            <div class="modal fade" id="keyboard_shortcuts_modal" tabindex="-1" aria-labelledby="keyboard_shortcuts_modal_label" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title translate" id="keyboard_shortcuts_modal_label">Keyboard Shortcuts</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="keyboard-shortcuts-list">
                                <div class="shortcut-item">
                                    <kbd>Enter</kbd>
                                    <span class="translate">Generate image (in prompt field)</span>
                                </div>
                                <div class="shortcut-item">
                                    <kbd>Shift</kbd> + <kbd>Enter</kbd>
                                    <span class="translate">New line in prompt field</span>
                                </div>
                                <div class="shortcut-item">
                                    <kbd>Esc</kbd>
                                    <span class="translate">Close modals and popovers</span>
                                </div>
                                <div class="shortcut-item">
                                    <kbd>←</kbd> / <kbd>→</kbd>
                                    <span class="translate">Navigate batch gallery (when not typing)</span>
                                </div>
                                <div class="shortcut-item">
                                    <kbd>?</kbd>
                                    <span class="translate">Show this help dialog</span>
                                </div>
                                <div class="shortcut-item">
                                    <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
                                    <span class="translate">Generate (Simple tab)</span>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body if it doesn't exist
        if (!document.getElementById('keyboard_shortcuts_modal')) {
            document.body.insertAdjacentHTML('beforeend', modalHtml);
        }

        // Add CSS for shortcuts display
        if (!document.getElementById('keyboard-shortcuts-styles')) {
            const style = document.createElement('style');
            style.id = 'keyboard-shortcuts-styles';
            style.textContent = `
                .keyboard-shortcuts-list {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .shortcut-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 0.5rem;
                    border-bottom: 1px solid var(--bs-border-color);
                }
                .shortcut-item:last-child {
                    border-bottom: none;
                }
                .shortcut-item kbd {
                    background-color: var(--bs-secondary-bg);
                    border: 1px solid var(--bs-border-color);
                    border-radius: 0.25rem;
                    padding: 0.25rem 0.5rem;
                    font-family: monospace;
                    font-size: 0.875rem;
                    font-weight: 600;
                    min-width: 2rem;
                    text-align: center;
                    display: inline-block;
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                }
                .shortcut-item span {
                    flex: 1;
                }
            `;
            document.head.appendChild(style);
        }

        // Show modal on ? key press
        document.addEventListener('keydown', (e) => {
            if (e.key === '?' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                // Don't trigger if typing in an input
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                    return;
                }
                e.preventDefault();
                if (typeof showModalById === 'function') {
                    showModalById('keyboard_shortcuts_modal');
                } else if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                    const modal = document.getElementById('keyboard_shortcuts_modal');
                    if (modal) {
                        const instance = bootstrap.Modal.getOrCreateInstance(modal);
                        instance.show();
                    }
                }
            }
        });
    }

    // ========================================
    // 6. Prompt history dropdown
    // ========================================
    loadPromptHistory() {
        try {
            const stored = localStorage.getItem('swarmui_prompt_history');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.warn('Failed to load prompt history:', e);
            return [];
        }
    }

    savePromptHistory() {
        try {
            localStorage.setItem('swarmui_prompt_history', JSON.stringify(this.promptHistory));
        } catch (e) {
            console.warn('Failed to save prompt history:', e);
        }
    }

    addToPromptHistory(prompt, negativePrompt = '') {
        // Remove duplicates
        this.promptHistory = this.promptHistory.filter(item => 
            item.prompt !== prompt || item.negativePrompt !== negativePrompt
        );
        // Add to beginning
        this.promptHistory.unshift({ prompt, negativePrompt, timestamp: Date.now() });
        // Keep only last 50
        this.promptHistory = this.promptHistory.slice(0, 50);
        this.savePromptHistory();
    }

    setupPromptHistory() {
        const promptTextarea = document.getElementById('alt_prompt_textbox');
        const negativePromptTextarea = document.getElementById('alt_negativeprompt_textbox');
        if (!promptTextarea) return;

        // Create history dropdown button
        const historyButton = document.createElement('button');
        historyButton.type = 'button';
        historyButton.className = 'btn btn-sm btn-outline-secondary prompt-history-button';
        historyButton.innerHTML = '<i class="bi bi-clock-history"></i>';
        historyButton.title = 'Prompt History';
        historyButton.style.marginLeft = '0.5rem';
        historyButton.style.marginTop = '0.25rem';

        // Create dropdown menu
        const dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'dropdown-menu prompt-history-dropdown';
        dropdownMenu.style.display = 'none';
        dropdownMenu.style.maxHeight = '300px';
        dropdownMenu.style.overflowY = 'auto';
        dropdownMenu.style.position = 'absolute';
        dropdownMenu.style.zIndex = '1000';
        dropdownMenu.style.minWidth = '400px';

        const updateDropdown = () => {
            if (this.promptHistory.length === 0) {
                dropdownMenu.innerHTML = '<div class="dropdown-item-text text-muted">No prompt history</div>';
                return;
            }
            dropdownMenu.innerHTML = this.promptHistory.slice(0, 20).map((item, index) => {
                const date = new Date(item.timestamp);
                const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return `
                    <a href="#" class="dropdown-item prompt-history-item" data-index="${index}">
                        <div style="font-weight: 500; margin-bottom: 0.25rem;">${this.escapeHtml(item.prompt.substring(0, 60))}${item.prompt.length > 60 ? '...' : ''}</div>
                        ${item.negativePrompt ? `<div style="font-size: 0.875rem; color: var(--bs-secondary-color);">Neg: ${this.escapeHtml(item.negativePrompt.substring(0, 40))}${item.negativePrompt.length > 40 ? '...' : ''}</div>` : ''}
                        <div style="font-size: 0.75rem; color: var(--bs-secondary-color);">${timeStr}</div>
                    </a>
                `;
            }).join('');
        };

        historyButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            updateDropdown();
            const rect = historyButton.getBoundingClientRect();
            dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none';
            dropdownMenu.style.top = (rect.bottom + 5) + 'px';
            dropdownMenu.style.left = rect.left + 'px';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!historyButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.style.display = 'none';
            }
        });

        // Handle history item selection
        dropdownMenu.addEventListener('click', (e) => {
            const item = e.target.closest('.prompt-history-item');
            if (item) {
                e.preventDefault();
                const index = parseInt(item.dataset.index);
                const historyItem = this.promptHistory[index];
                if (historyItem) {
                    promptTextarea.value = historyItem.prompt;
                    if (negativePromptTextarea) {
                        negativePromptTextarea.value = historyItem.negativePrompt || '';
                    }
                    // Trigger change events
                    if (typeof triggerChangeFor === 'function') {
                        triggerChangeFor(promptTextarea);
                        if (negativePromptTextarea) triggerChangeFor(negativePromptTextarea);
                    } else {
                        promptTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                        if (negativePromptTextarea) negativePromptTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    dropdownMenu.style.display = 'none';
                }
            }
        });

        // Insert button next to prompt textboxes container
        const promptContainer = promptTextarea.closest('.alt_prompt_textboxes');
        const promptMainLine = promptTextarea.closest('.alt_prompt_main_line');
        if (promptContainer && promptMainLine) {
            // Add button to the main line, after textboxes
            promptMainLine.appendChild(historyButton);
            // Add dropdown menu to the prompt region
            const promptRegion = promptTextarea.closest('#alt_prompt_region');
            if (promptRegion) {
                promptRegion.appendChild(dropdownMenu);
            } else {
                promptContainer.appendChild(dropdownMenu);
            }
        }

        // Save to history when generating - hook into the generate handler
        const generateButton = document.getElementById('alt_generate_button');
        if (generateButton) {
            // Use a MutationObserver or event delegation to catch generation
            // Since we can't easily hook into mainGenHandler, we'll save on button click
            generateButton.addEventListener('click', (e) => {
                // Small delay to ensure values are captured
                setTimeout(() => {
                    const prompt = promptTextarea.value.trim();
                    const negativePrompt = negativePromptTextarea ? negativePromptTextarea.value.trim() : '';
                    if (prompt) {
                        this.addToPromptHistory(prompt, negativePrompt);
                    }
                }, 100);
            });
        }
        
        // Also save when Enter is pressed (via our Enter handler)
        if (promptTextarea) {
            const originalEnterHandler = promptTextarea.onkeydown;
            promptTextarea.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                    setTimeout(() => {
                        const prompt = promptTextarea.value.trim();
                        const negativePrompt = negativePromptTextarea ? negativePromptTextarea.value.trim() : '';
                        if (prompt) {
                            this.addToPromptHistory(prompt, negativePrompt);
                        }
                    }, 100);
                }
            });
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ========================================
    // 7. Improve empty states with better messages
    // ========================================
    setupEmptyStates() {
        const updateEmptyStates = () => {
            // Batch gallery empty state
            const batchContainer = document.getElementById('current_image_batch');
            if (batchContainer) {
                const existingEmptyState = batchContainer.querySelector('.empty-state-message');
                const hasImages = batchContainer.querySelectorAll('.image-block').length > 0;
                
                if (!hasImages && !existingEmptyState) {
                    const emptyState = document.createElement('div');
                    emptyState.className = 'empty-state-message';
                    emptyState.innerHTML = `
                        <div style="text-align: center; padding: 2rem; color: var(--bs-secondary-color);">
                            <i class="bi bi-images" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem; display: block;"></i>
                            <div style="font-weight: 500; margin-bottom: 0.5rem;">No images yet</div>
                            <div style="font-size: 0.875rem;">Generated images will appear here</div>
                        </div>
                    `;
                    batchContainer.appendChild(emptyState);
                } else if (hasImages && existingEmptyState) {
                    existingEmptyState.remove();
                }
            }

            // Image preview empty state - only add if welcome message doesn't exist
            const currentImage = document.getElementById('current_image');
            if (currentImage) {
                const welcomeMessage = document.getElementById('welcome_message');
                const existingEmptyState = currentImage.querySelector('.empty-state-message');
                const hasImage = currentImage.querySelector('img, video');
                
                if (!hasImage && !welcomeMessage && !existingEmptyState) {
                    const emptyState = document.createElement('div');
                    emptyState.className = 'empty-state-message';
                    emptyState.innerHTML = `
                        <div style="text-align: center; padding: 2rem; color: var(--bs-secondary-color);">
                            <i class="bi bi-image" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem; display: block;"></i>
                            <div style="font-weight: 500; margin-bottom: 0.5rem;">Ready to generate</div>
                            <div style="font-size: 0.875rem;">Enter a prompt and press Enter or click Generate</div>
                        </div>
                    `;
                    currentImage.appendChild(emptyState);
                } else if (hasImage && existingEmptyState) {
                    existingEmptyState.remove();
                }
            }
        };

        // Initial check
        setTimeout(updateEmptyStates, 500);

        // Watch for changes in batch container
        const batchContainer = document.getElementById('current_image_batch');
        if (batchContainer) {
            const batchObserver = new MutationObserver(updateEmptyStates);
            batchObserver.observe(batchContainer, { childList: true, subtree: true });
        }

        // Watch for changes in current image
        const currentImage = document.getElementById('current_image');
        if (currentImage) {
            const imageObserver = new MutationObserver(updateEmptyStates);
            imageObserver.observe(currentImage, { childList: true, subtree: true });
        }
    }

    // ========================================
    // 8. Click-to-expand status bar functionality
    // ========================================
    setupExpandableStatusBar() {
        const statusBar = document.getElementById('top_status_bar');
        const statusBarWrapper = document.querySelector('.top-status-bar-wrapper');
        if (!statusBar || !statusBarWrapper) return;

        // Add click handler (but preserve hover behavior)
        statusBarWrapper.style.cursor = 'pointer';
        statusBarWrapper.title = 'Click to expand status information';

        statusBarWrapper.addEventListener('click', (e) => {
            // Don't prevent default on status bar itself to allow text selection
            if (e.target === statusBar || statusBar.contains(e.target)) {
                e.stopPropagation();
                this.toggleStatusBar();
            }
        });

        // Create expanded view
        const expandedView = document.createElement('div');
        expandedView.id = 'status_bar_expanded';
        expandedView.className = 'status-bar-expanded';
        expandedView.style.display = 'none';
        expandedView.style.position = 'fixed';
        expandedView.style.top = '0';
        expandedView.style.left = '0';
        expandedView.style.right = '0';
        expandedView.style.backgroundColor = 'var(--bs-body-bg)';
        expandedView.style.borderBottom = '2px solid var(--bs-border-color)';
        expandedView.style.padding = '1rem';
        expandedView.style.zIndex = '10000';
        expandedView.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        expandedView.style.maxHeight = '50vh';
        expandedView.style.overflowY = 'auto';

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.className = 'btn btn-sm btn-outline-secondary';
        closeButton.innerHTML = '<i class="bi bi-x"></i>';
        closeButton.style.float = 'right';
        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleStatusBar();
        });

        const content = document.createElement('div');
        content.id = 'status_bar_expanded_content';
        expandedView.appendChild(closeButton);
        expandedView.appendChild(content);
        document.body.appendChild(expandedView);

        // Update expanded content periodically
        setInterval(() => {
            if (this.statusBarExpanded) {
                this.updateExpandedStatusBar();
            }
        }, 1000);
    }

    toggleStatusBar() {
        this.statusBarExpanded = !this.statusBarExpanded;
        const expandedView = document.getElementById('status_bar_expanded');
        if (expandedView) {
            expandedView.style.display = this.statusBarExpanded ? 'block' : 'none';
            if (this.statusBarExpanded) {
                this.updateExpandedStatusBar();
            }
        }
    }

    updateExpandedStatusBar() {
        const content = document.getElementById('status_bar_expanded_content');
        if (!content) return;

        const statusBar = document.getElementById('top_status_bar');
        const numJobsSpan = document.getElementById('num_jobs_span');
        const otherInfoSpan = document.getElementById('other_info_span');

        let html = '<div style="margin-bottom: 1rem;"><strong>Status Information</strong></div>';
        
        if (statusBar) {
            html += `<div style="margin-bottom: 0.5rem;"><strong>Status:</strong> ${this.escapeHtml(statusBar.textContent || 'Unknown')}</div>`;
        }
        
        if (numJobsSpan) {
            html += `<div style="margin-bottom: 0.5rem;"><strong>Jobs:</strong> ${this.escapeHtml(numJobsSpan.innerHTML || 'None')}</div>`;
        }
        
        if (otherInfoSpan) {
            html += `<div style="margin-bottom: 0.5rem;"><strong>Info:</strong> ${this.escapeHtml(otherInfoSpan.innerHTML || 'None')}</div>`;
        }

        // Add model info if available
        const currentModel = document.getElementById('current_model');
        if (currentModel && currentModel.value) {
            html += `<div style="margin-bottom: 0.5rem;"><strong>Model:</strong> ${this.escapeHtml(currentModel.options[currentModel.selectedIndex]?.text || currentModel.value)}</div>`;
        }

        content.innerHTML = html;
    }
}

// Initialize when script loads
let keyboardShortcuts;
if (typeof window !== 'undefined') {
    keyboardShortcuts = new KeyboardShortcuts();
}


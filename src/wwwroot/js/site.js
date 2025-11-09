let session_id = getCookie('session_id') || null;
let user_id = null;
let outputAppendUser = null;

function getImageOutPrefix() {
    return outputAppendUser ? `View/${user_id}` : 'Output';
}

function enableSlidersIn(elem) {
    for (let div of elem.getElementsByClassName('auto-slider-box')) {
        enableSliderForBox(div);
    }
}

function enableSliderAbove(div) {
    enableSliderForBox(findParentOfClass(div, 'auto-slider-box'));
}

function enableSliderForBox(div) {
    let range = div.querySelector('input[type="range"]');
    let number = div.querySelector('input[type="number"]');
    number.addEventListener('input', (event) => {
        let newVal = number.value;
        if (!event.shiftKey) {
            number.dataset.old_value = newVal;
            return;
        }
        let oldVal = parseInt(number.dataset.old_value || number.getAttribute('value'));
        if (newVal > oldVal) {
            number.value = Math.min(parseInt(number.getAttribute('max')), oldVal + 1);
        }
        else if (newVal < oldVal) {
            number.value = Math.max(parseInt(number.getAttribute('min')), oldVal - 1);
        }
        number.dataset.old_value = number.value;
    });
    if (range.dataset.ispot == "true") {
        let max = parseInt(range.getAttribute('max')), min = parseInt(range.getAttribute('min')), step = parseInt(range.getAttribute('step'));
        range.addEventListener('input', (e) => {
            number.value = linearToPot(range.value, max, min, step);
            range.value = potToLinear(number.value, max, min, step);
            number.dispatchEvent(new Event('change'));
            if (number.onchange) {
                number.onchange(e);
            }
        });
        number.addEventListener('input', (e) => {
            range.value = potToLinear(number.value, max, min, step);
            range.dispatchEvent(new Event('change'));
            if (range.onchange) {
                range.onchange(e);
            }
        });
        range.step = 1;
    }
    else {
        range.addEventListener('input', () => {
            number.value = range.value;
            number.dispatchEvent(new Event('change'));
        });
        number.addEventListener('input', () => {
            range.value = number.value;
            range.dispatchEvent(new Event('change'));
        });
    }
    number.dispatchEvent(new Event('input'));
    autoNumberWidth(number);
}

function showError(message, time = 5000) {
    let container = getRequiredElementById('error_toast_box');
    getRequiredElementById('error_toast_content').innerText = message;
    let toast = new bootstrap.Toast(container, { delay: time });
    toast.show();
}

function showSuccess(message, time = 3000) {
    let container = document.getElementById('success_toast_box');
    if (!container) { console.warn('Missing success toast container'); return; }
    let body = getRequiredElementById('success_toast_content');
    body.innerText = message;
    let toast = new bootstrap.Toast(container, { delay: time });
    toast.show();
}

let genericServerErrorMsg = translatable(`Failed to send request to server. Did the server crash?`);
function genericServerError() {
    showError(genericServerErrorMsg.get());
}

let failedWSAddr = translatable(`Failed to get WebSocket address. You may be connecting to the server in an unexpected way. Please use "http" or "https" URLs.`);
let failedDepth = translatable(`Failed to get session ID after 3 tries. Your account may have been invalidated. Try refreshing the page, or contact the site owner.`);

function makeWSRequest(url, in_data, callback, depth = 0, errorHandle = null, onOpenHandle = null) {
    function fail(e) {
        if (errorHandle) {
            errorHandle(e);
            return;
        }
        console.log(e);
        showError(e);
    }
    let ws_address = getWSAddress();
    if (ws_address == null) {
        console.log(`Tried making WS request ${url} but failed.`);
        fail(failedWSAddr);
        return;
    }
    let socket = new WebSocket(`${ws_address}/API/${url}`);
    socket.onopen = () => {
        in_data['session_id'] = session_id;
        socket.send(JSON.stringify(in_data));
        if (onOpenHandle) {
            onOpenHandle(socket);
        }
    };
    socket.onmessage = (event) => {
        let data = JSON.parse(event.data);
        if (data.error_id && data.error_id == 'invalid_session_id') {
            if (depth > 3) {
                fail(failedDepth.get());
                return;
            }
            console.log('Session refused, will get new one and try again.');
            getSession(() => {
                makeWSRequest(url, in_data, callback, depth + 1);
            });
            return;
        }
        if (data.error) {
            let error = typeof data.error == 'string' ? data.error : JSON.stringify(data.error);
            console.log(`Tried making WS request ${url} but failed with error: ${error}`);
            fail(error);
            return;
        }
        callback(data);
    }
    socket.onerror = errorHandle ? () => errorHandle(genericServerErrorMsg.get()) : genericServerError;
    return socket;
}

let genericAjaxError = translatable(`Failed to send request to server (generic ProgressEvent). Did the server crash?`);

function genericRequest(url, in_data, callback, depth = 0, errorHandle = null) {
    in_data['session_id'] = session_id;
    function fail(e) {
        if (e instanceof ProgressEvent) {
            e = genericAjaxError.get();
        }
        if (errorHandle) {
            errorHandle(e);
            return;
        }
        console.error(e);
        showError(e);
    }
    sendJsonToServer(`API/${url}`, in_data, (status, data) => {
        if (!data) {
            console.log(`Tried making generic request ${url} but failed.`);
            fail(genericServerErrorMsg.get());
            return;
        }
        if (data.error_id && data.error_id == 'invalid_session_id') {
            if (depth > 3) {
                fail(failedDepth.get());
                return;
            }
            console.log('Session refused, will get new one and try again.');
            getSession(() => {
                genericRequest(url, in_data, callback, depth + 1);
            });
            return;
        }
        if (data.error) {
            console.log(`Tried making generic request ${url} but failed with error: ${data.error}`);
            console.log(`Input was ${JSON.stringify(in_data)}`);
            fail(data.error);
            return;
        }
        callback(data);
    }, errorHandle || genericServerError);
}

let lastServerVersion = null;
let versionIsWrong = false;
let lastSessionCheck = 0;
let haveBadSession = false;

let serverHasUpdated = translatable(`The server has updated since you opened the page, please refresh.`);

function getSession(callback) {
    if (lastSessionCheck + 1000 > Date.now()) {
        setTimeout(() => {
            if (haveBadSession) {
                getSession(callback);
            }
            else {
                if (callback) {
                    callback();
                }
            }
        }, 1000);
        return;
    }
    lastSessionCheck = Date.now();
    haveBadSession = true;
    genericRequest('GetNewSession', {}, data => {
        haveBadSession = false;
        console.log("Session started.");
        session_id = data.session_id;
        setCookie('session_id', session_id, 31);
        user_id = data.user_id;
        outputAppendUser = data.output_append_user;
        permissions.updateFrom(data.permissions);
        if (lastServerVersion == null) {
            lastServerVersion = data.version;
        }
        else if (lastServerVersion != data.version) {
            if (!versionIsWrong) {
                versionIsWrong = true;
                showError(serverHasUpdated.get());
            }
            if (typeof reviseStatusBar != 'undefined') {
                reviseStatusBar();
            }
        }
        if (callback) {
            callback();
        }
    });
}

function sendServerDebugMessage(message) {
    genericRequest('ServerDebugMessage', { message: message }, data => { });
}

function doGlobalErrorDebug() {
    window.onerror = (msg, url, line, col, error) => {
        var extra = !col ? '' : '\ncolumn: ' + col;
        extra += !error ? '' : '\nerror: ' + error;
        sendServerDebugMessage("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);
     };
}

/***** Header/workspace/subnav helpers *****/
function setActiveMainNavByHash(hash) {
    // Extract the base hash without sub-routes
    const baseHash = hash.split('/')[0];
    
    const map = {
        '#Generate': 'main_nav_generate',
        '#Text2Image': 'main_nav_generate', 
        '#Simple': 'main_nav_simple',
        '#Comfy': 'main_nav_comfy',
        '#comfyworkflow': 'main_nav_comfy',
        '#Utilities': 'main_nav_utilities',
        '#utilities_tab': 'main_nav_utilities',
        '#Settings': 'main_nav_settings',
        '#user_tab': 'main_nav_settings',
        '#Server': 'main_nav_server',
        '#server_tab': 'main_nav_server'
    };
    
    // Remove active from all main nav links
    const mainNavLinks = document.querySelectorAll('#navbarNav .nav-link');
    mainNavLinks.forEach(link => link.classList.remove('active'));
    
    // Set active based on current hash
    let targetId = map[baseHash];
    
    // If not in map, check if it's a comfy-related hash
    if (!targetId && baseHash.toLowerCase().includes('comfy')) {
        targetId = 'main_nav_comfy';
    }
    
    // Default to generate if still not found
    targetId = targetId || 'main_nav_generate';
    
    let target = document.getElementById(targetId);
    if (target) {
        target.classList.add('active');
    }
    
    // ComfyUI nav item is always visible - removed conditional hiding
}

// Activate tab from hash - integrates with genpage routing system
function activateTabFromHash(hash) {
    // If applyWorkspaceRoute exists (on Text2Image page), use it
    if (typeof applyWorkspaceRoute !== 'undefined') {
        applyWorkspaceRoute(hash);
    }
}


// Update the sub-navigation bar based on active tab
function updateSubNavBar() {
    // Sub-navigation is now handled inline within each tab (horizontal layout)
    // Disable the header subnav_bar to prevent duplication
    const bar = document.getElementById('subnav_bar');
    if (bar) {
        bar.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Add click handlers to main navigation with proper history management
        const mainNavLinks = document.querySelectorAll('#navbarNav .nav-link');
        mainNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href') || '';
                // Only handle in-app hash routes here
                if (!href.startsWith('#')) return;

                e.preventDefault();
                e.stopPropagation();

                // Update active state
                mainNavLinks.forEach(navLink => navLink.classList.remove('active'));
                link.classList.add('active');

                // Use pushState for proper browser history management
                const newUrl = `${window.location.pathname}${window.location.search}${href}`;
                if (window.location.hash !== href) {
                    // Add to browser history
                    history.pushState({ tab: href }, '', newUrl);
                    window.location.hash = href; // Also update hash for compatibility
                }

                // Activate the tab
                if (typeof activateTabFromHash === 'function') {
                    activateTabFromHash(href);
                }
            });
        });
        
        // Initialize active nav state on page load
        const currentHash = window.location.hash || '#Generate';
        setActiveMainNavByHash(currentHash);
        
        // Initialize tab system visibility
        const initializeTabSystem = () => {
            // Tab navigation is now handled by main header navigation
            // Ensure proper initial state for all tab panes
            const tabPanes = document.querySelectorAll('.tab-pane');
            tabPanes.forEach(pane => {
                // Remove any inline display styles
                pane.style.removeProperty('display');
                
                // Ensure Bootstrap's show/active classes are properly managed
                if (!pane.classList.contains('show') && !pane.classList.contains('active')) {
                    // Tab panes that aren't active should not have display:none inline
                    // Bootstrap handles visibility via classes
                }
            });
            
            // Set initial active state
            const currentHash = window.location.hash || '#Generate';
            setActiveMainNavByHash(currentHash);
        };
        
        // Initialize the tab system
        initializeTabSystem();
        
        // Add diagnostic function for checking page state
        window.checkPageState = () => {
            console.log('=== Page State Check ===');
            console.log('Current hash:', window.location.hash);
            
            // Check main navigation
            const mainNav = document.getElementById('navbarNav');
            console.log('Main nav exists:', !!mainNav);
            
            // Check tab system
            const topTabList = document.getElementById('toptablist');
            console.log('Top tab list exists:', !!topTabList);
            if (topTabList) {
                console.log('Top tab list display style:', topTabList.style.display);
                const activeTab = topTabList.querySelector('.nav-link.active');
                console.log('Active tab:', activeTab ? activeTab.textContent : 'none');
            }
            
            // Check visible content
            const activePane = document.querySelector('.tab-pane.show.active');
            console.log('Active pane:', activePane ? activePane.id : 'none');
            
            // Check sidebars
            const inputSidebar = document.getElementById('input_sidebar');
            console.log('Input sidebar:', inputSidebar ? `visible: ${inputSidebar.style.display !== 'none'}` : 'not found');
            
            const bottomBar = document.getElementById('t2i_bottom_bar');
            console.log('Bottom bar:', bottomBar ? `visible: ${bottomBar.style.display !== 'none'}` : 'not found');
            
            // Check sub-navigation
            const subnavBar = document.getElementById('subnav_bar');
            console.log('Sub-nav bar:', subnavBar ? `visible: ${subnavBar.style.display !== 'none'}` : 'not found');
            
            console.log('=== End Check ===');
        };
        
        // Handle browser back/forward navigation with popstate
        window.addEventListener('popstate', (event) => {
            const hash = window.location.hash || '#Generate';
            setActiveMainNavByHash(hash);
            activateTabFromHash(hash);
        });

        // Handle hash changes from other sources (like direct URL changes)
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash || '#Generate';
            setActiveMainNavByHash(hash);
            // Guard: ensure only one pane remains active
            const panes = document.querySelectorAll('.tab-content.tab-hundred > .tab-pane');
            panes.forEach(p => {
                p.style.removeProperty('display');
                if (!p.id || !hash.toLowerCase().includes(p.id.toLowerCase())) {
                    p.classList.remove('show', 'active');
                }
            });
            activateTabFromHash(hash);
        });
        
        // Handle initial page load with hash
        window.addEventListener('load', () => {
            // Allow a small delay for the page to fully initialize
            setTimeout(() => {
                const hash = window.location.hash || '#Generate';
                setActiveMainNavByHash(hash);
                // Clear any stray actives, then apply
                document.querySelectorAll('.tab-content.tab-hundred > .tab-pane').forEach(p => p.classList.remove('show', 'active'));
                activateTabFromHash(hash);
            }, 100);
        });

// On tab change, just toggle Comfy-only visibility (no header subnav)
        document.body.addEventListener('shown.bs.tab', (e) => {
            const href = e.target?.getAttribute?.('href');
            const comfyVisible = href === '#Comfy';
            for (const node of document.querySelectorAll('.comfy-only')) {
                node.style.display = comfyVisible ? '' : 'none';
            }
        });
// Initial setup: toggle Comfy-only visibility based on initial tab
        setTimeout(() => {
            const comfyVisible = (document.querySelector('a.nav-link.active')?.getAttribute('href') === '#Comfy') || (window.location.hash === '#Comfy');
            for (const node of document.querySelectorAll('.comfy-only')) {
                node.style.display = comfyVisible ? '' : 'none';
            }
        }, 250);

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Alt+I: Interrupt current generation
            if (e.altKey && (e.key === 'i' || e.key === 'I')) {
                const btn = document.getElementById('alt_interrupt_button') || document.getElementById('interrupt_button');
                if (btn && !btn.classList.contains('interrupt-button-none')) {
                    btn.click();
                    e.preventDefault();
                }
            }

            // Enter: Generate (when focused on prompt textbox)
            if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
                const target = e.target;
                const promptTextbox = document.getElementById('alt_prompt_textbox');
                const negativePromptTextbox = document.getElementById('alt_negativeprompt_textbox');

                if (target === promptTextbox || target === negativePromptTextbox) {
                    const generateBtn = document.getElementById('alt_generate_button');
                    if (generateBtn) {
                        generateBtn.click();
                        e.preventDefault();
                    }
                }
            }

            // Ctrl/Cmd+Enter: Toggle Generate Forever (when focused on prompt textbox)
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                const target = e.target;
                const promptTextbox = document.getElementById('alt_prompt_textbox');
                const negativePromptTextbox = document.getElementById('alt_negativeprompt_textbox');

                if (target === promptTextbox || target === negativePromptTextbox) {
                    const genForeverBtn = document.getElementById('generate_forever_checkbox');
                    if (genForeverBtn) {
                        genForeverBtn.checked = !genForeverBtn.checked;
                        // Trigger change event
                        genForeverBtn.dispatchEvent(new Event('change'));
                        e.preventDefault();
                    }
                }
            }

            // Esc: Close modals and popovers
            if (e.key === 'Escape') {
                // Close any open popovers
                const openPopovers = document.querySelectorAll('.sui-popover[style*="display: block"], .sui-popover[style*="display:block"]');
                openPopovers.forEach(popover => {
                    popover.style.display = 'none';
                });

                // Close Bootstrap modals
                const openModals = document.querySelectorAll('.modal.show');
                openModals.forEach(modal => {
                    const bsModal = bootstrap.Modal.getInstance(modal);
                    if (bsModal) {
                        bsModal.hide();
                    }
                });
            }

            // Arrow keys: Navigate batch gallery (when not focused on input)
            if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') &&
                !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
                const batchContainer = document.getElementById('current_image_batch');
                if (batchContainer) {
                    const images = Array.from(batchContainer.querySelectorAll('.image-block'));
                    if (images.length === 0) return;

                    // Find currently selected image (if any)
                    let currentIndex = images.findIndex(img => img.classList.contains('selected'));

                    if (e.key === 'ArrowLeft') {
                        currentIndex = currentIndex <= 0 ? images.length - 1 : currentIndex - 1;
                    } else {
                        currentIndex = currentIndex >= images.length - 1 ? 0 : currentIndex + 1;
                    }

                    // Remove previous selection
                    images.forEach(img => img.classList.remove('selected'));

                    // Select and click new image
                    const targetImage = images[currentIndex];
                    if (targetImage) {
                        targetImage.classList.add('selected');
                        targetImage.click();
                        targetImage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        e.preventDefault();
                    }
                }
            }

            // Ctrl/Cmd + /: Show keyboard shortcuts help
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                const shortcutsModal = document.getElementById('keyboard_shortcuts_modal');
                if (shortcutsModal) {
                    const modal = new bootstrap.Modal(shortcutsModal);
                    modal.show();
                    e.preventDefault();
                }
            }
        });

        // Theme toggle (light/dark) persistence
        const root = document.documentElement;
        const THEME_KEY = 'sui.bsTheme';
        function applyBsTheme(theme) {
            root.setAttribute('data-bs-theme', theme);
            localStorage.setItem(THEME_KEY, theme);
            const icon = document.getElementById('theme_toggle_icon');
            if (icon) {
                icon.className = theme === 'dark' ? 'bi bi-moon' : 'bi bi-sun';
            }
        }
        const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
        applyBsTheme(savedTheme);
        const toggleBtn = document.getElementById('theme_toggle_button');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const newTheme = (root.getAttribute('data-bs-theme') === 'dark') ? 'light' : 'dark';
                applyBsTheme(newTheme);
            });
        }

        // Auto-expanding textareas
        function setupAutoExpandTextarea(textarea) {
            if (!textarea) return;

            function resize() {
                textarea.style.height = 'auto';
                textarea.style.height = Math.min(textarea.scrollHeight, 300) + 'px';
            }

            textarea.addEventListener('input', resize);
            // Also resize on paste
            textarea.addEventListener('paste', () => setTimeout(resize, 0));
            // Initial resize
            resize();
        }

        // Setup auto-expand for prompt textboxes
        const promptTextbox = document.getElementById('alt_prompt_textbox');
        const negativePromptTextbox = document.getElementById('alt_negativeprompt_textbox');

        if (promptTextbox) {
            setupAutoExpandTextarea(promptTextbox);
        }

        if (negativePromptTextbox) {
            setupAutoExpandTextarea(negativePromptTextbox);
        }

        // Prompt history functionality
        const PROMPT_HISTORY_KEY = 'sui.promptHistory';
        const MAX_HISTORY = 20;
        let promptHistory = [];
        let historyIndex = -1;

        // Load prompt history from localStorage
        try {
            const saved = localStorage.getItem(PROMPT_HISTORY_KEY);
            if (saved) {
                promptHistory = JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load prompt history:', e);
        }

        // Save prompt to history
        function savePromptToHistory(prompt) {
            if (!prompt || prompt.trim() === '') return;

            // Remove duplicates
            promptHistory = promptHistory.filter(p => p !== prompt);

            // Add to beginning
            promptHistory.unshift(prompt);

            // Limit size
            if (promptHistory.length > MAX_HISTORY) {
                promptHistory = promptHistory.slice(0, MAX_HISTORY);
            }

            // Save to localStorage
            try {
                localStorage.setItem(PROMPT_HISTORY_KEY, JSON.stringify(promptHistory));
            } catch (e) {
                console.error('Failed to save prompt history:', e);
            }

            // Reset index
            historyIndex = -1;
        }

        // Navigate prompt history
        function navigateHistory(direction) {
            if (promptHistory.length === 0) return;

            if (direction === 'up') {
                historyIndex = Math.min(historyIndex + 1, promptHistory.length - 1);
            } else {
                historyIndex = Math.max(historyIndex - 1, -1);
            }

            if (historyIndex >= 0) {
                promptTextbox.value = promptHistory[historyIndex];
                // Trigger input event to resize textarea
                promptTextbox.dispatchEvent(new Event('input'));
            } else {
                promptTextbox.value = '';
            }
        }

        // Show prompt history dropdown
        function showPromptHistoryDropdown() {
            if (promptHistory.length === 0) {
                alert('No prompt history available');
                return;
            }

            const dropdown = document.createElement('div');
            dropdown.className = 'prompt-history-dropdown';
            dropdown.innerHTML = `
                <div class="prompt-history-header">
                    <span>Recent Prompts</span>
                    <button class="prompt-history-close" onclick="this.closest('.prompt-history-dropdown').remove()">×</button>
                </div>
                <div class="prompt-history-list">
                    ${promptHistory.map((prompt, index) => `
                        <div class="prompt-history-item" data-index="${index}">
                            <div class="prompt-history-text">${escapeHtml(prompt)}</div>
                        </div>
                    `).join('')}
                </div>
            `;

            // Position dropdown
            const button = document.getElementById('prompt_history_button');
            const rect = button.getBoundingClientRect();
            dropdown.style.position = 'fixed';
            dropdown.style.top = (rect.bottom + 5) + 'px';
            dropdown.style.right = (window.innerWidth - rect.right) + 'px';
            dropdown.style.zIndex = '10000';

            document.body.appendChild(dropdown);

            // Add click handlers
            dropdown.querySelectorAll('.prompt-history-item').forEach(item => {
                item.addEventListener('click', () => {
                    const index = parseInt(item.dataset.index);
                    promptTextbox.value = promptHistory[index];
                    promptTextbox.dispatchEvent(new Event('input'));
                    dropdown.remove();
                    promptTextbox.focus();
                });
            });

            // Close on click outside
            setTimeout(() => {
                document.addEventListener('click', function closeDropdown(e) {
                    if (!dropdown.contains(e.target) && e.target !== button) {
                        dropdown.remove();
                        document.removeEventListener('click', closeDropdown);
                    }
                });
            }, 100);
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // Hook into generate button to save prompts
        const generateBtn = document.getElementById('alt_generate_button');
        if (generateBtn && promptTextbox) {
            const originalOnClick = generateBtn.onclick;
            generateBtn.onclick = function(e) {
                savePromptToHistory(promptTextbox.value);
                if (originalOnClick) {
                    originalOnClick.call(this, e);
                }
            };
        }

        // Ctrl+Up/Down for history navigation
        if (promptTextbox) {
            promptTextbox.addEventListener('keydown', (e) => {
                if (e.ctrlKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
                    e.preventDefault();
                    navigateHistory(e.key === 'ArrowUp' ? 'up' : 'down');
                }
            });
        }

        // History button click handler
        const historyBtn = document.getElementById('prompt_history_button');
        if (historyBtn) {
            historyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                showPromptHistoryDropdown();
            });
        }

        // Status bar click-to-expand
        const statusBar = document.getElementById('top_status_bar');
        const statusDetails = document.getElementById('status_bar_details');

        if (statusBar && statusDetails) {
            statusBar.addEventListener('click', (e) => {
                e.stopPropagation();
                const isVisible = statusDetails.style.display !== 'none';
                statusDetails.style.display = isVisible ? 'none' : 'block';

                // Update content when showing
                if (!isVisible) {
                    updateStatusDetailsContent();
                }
            });

            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (statusDetails.style.display === 'block' &&
                    !statusDetails.contains(e.target) &&
                    e.target !== statusBar) {
                    statusDetails.style.display = 'none';
                }
            });
        }

        // Function to update status details content
        function updateStatusDetailsContent() {
            const content = document.getElementById('status_details_content');
            if (!content) return;

            // Get current generation info from the status text
            const statusText = statusBar.textContent;

            if (!statusText || statusText === 'Loading...') {
                content.innerHTML = '<p class="text-muted">Loading status...</p>';
                return;
            }

            // Parse the status text to show details
            const parts = statusText.match(/(\d+)\s+([^,]+)/g);

            if (!parts || parts.length === 0) {
                content.innerHTML = '<p class="text-muted">No active generations</p>';
                return;
            }

            let html = '';
            parts.forEach(part => {
                const match = part.match(/(\d+)\s+(.+)/);
                if (match) {
                    const [, count, label] = match;
                    html += `
                        <div class="status-queue-item">
                            <div class="status-queue-item-status">${count} ${label}</div>
                        </div>
                    `;
                }
            });

            content.innerHTML = html || '<p class="text-muted">No active generations</p>';
        }

        // Update status details when status bar changes
        if (statusBar) {
            const observer = new MutationObserver(() => {
                if (statusDetails.style.display === 'block') {
                    updateStatusDetailsContent();
                }
            });

            observer.observe(statusBar, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }

        // Density toggle (comfortable/compact) persistence
        const DENSITY_KEY = 'sui.density';
        function applyDensity(density) {
            if (density === 'compact') {
                root.setAttribute('data-density', 'compact');
            } else {
                root.removeAttribute('data-density');
            }
            localStorage.setItem(DENSITY_KEY, density);
            const dIcon = document.getElementById('density_toggle_icon');
            if (dIcon) {
                dIcon.className = density === 'compact' ? 'bi bi-arrows-collapse' : 'bi bi-arrows-expand';
            }
        }
        const savedDensity = localStorage.getItem(DENSITY_KEY) || 'comfortable';
        applyDensity(savedDensity);
        const densityBtn = document.getElementById('density_toggle_button');
        if (densityBtn) {
            densityBtn.addEventListener('click', () => {
                const newDensity = (root.getAttribute('data-density') === 'compact') ? 'comfortable' : 'compact';
                applyDensity(newDensity);
            });
        }
    } catch (err) {
        console.warn('site.js init error', err);
    }
});

function triggerChangeFor(elem) {
    elem.dispatchEvent(new Event('input', { bubbles: true }));
    if (elem.oninput) {
        elem.oninput(elem);
    }
    elem.dispatchEvent(new Event('change', { bubbles: true }));
    if (elem.onchange) {
        elem.onchange(elem);
    }
}

/** Safely show a Bootstrap 5 modal by element id (no jQuery). */
function showModalById(id) {
    let el = document.getElementById(id);
    if (!el) { return; }
    let instance = bootstrap.Modal.getOrCreateInstance(el);
    instance.show();
}

/** Safely hide a Bootstrap 5 modal by element id (no jQuery). */
function hideModalById(id) {
    let el = document.getElementById(id);
    if (!el) { return; }
    let instance = bootstrap.Modal.getOrCreateInstance(el);
    instance.hide();
}

/** Set multiple values for a <select multiple> or single value for normal selects, then trigger change. */
function setSelectValues(selectElem, values) {
    if (!selectElem) return;
    let vals = Array.isArray(values) ? values : [values];
    let isMultiple = selectElem.multiple === true;
    for (let opt of selectElem.options) {
        opt.selected = isMultiple ? vals.includes(opt.value) : (vals.length > 0 && opt.value === vals[0]);
    }
    triggerChangeFor(selectElem);
}

function textPromptDoCount(elem, countElem = null, prefix = '') {
    let tokenCount = countElem ?? elem.parentElement.querySelector('.auto-input-prompt-tokencount');
    function countTokens() {
        elem.dataset.has_token_count_running = true;
        genericRequest('CountTokens', { text: elem.value, skipPromptSyntax: true }, data => {
            let chunks = Math.max(75, Math.ceil(data.count / 75) * 75);
            tokenCount.innerText = `${prefix}${data.count}/${chunks}`;
            delete elem.dataset.has_token_count_running;
            if (elem.dataset.needs_token_recount) {
                delete elem.dataset.needs_token_recount;
                countTokens();
            }
        });
    }
    if (elem.dataset.has_token_count_running) {
        elem.dataset.needs_token_recount = true;
    }
    else {
        countTokens();
    }
}

let jitterDebug = false;

function textBoxSizeAdjust(elem) {
    elem.style.height = '0px';
    let height = elem.scrollHeight;
    elem.style.height = `max(3.4rem, min(15rem, ${height + 5}px))`;
    if (jitterDebug) {
        console.log(`JitterDebug textBoxSizeAdjust: ${elem.id} height adjust: ${height}, now ${elem.scrollHeight}`);
    }
}

function textPromptInputHandle(elem) {
    textBoxSizeAdjust(elem);
    textPromptDoCount(elem);
}

function internalSiteJsGetUserSetting(name, defaultValue) {
    if (typeof getUserSetting == 'function') {
        return getUserSetting(name, defaultValue);
    }
    return defaultValue;
}

function textPromptAddKeydownHandler(elem) {
    let shiftText = (up) => {
        let selStart = elem.selectionStart;
        let selEnd = elem.selectionEnd;
        if (selStart == selEnd) {
            let simpleText = elem.value;
            for (let char of ['\n', '\t', ',', '.']) {
                simpleText = simpleText.replaceAll(char, ' ');
            }
            let lastSpace = simpleText.lastIndexOf(" ", selStart - 1);
            if (lastSpace != -1) {
                selStart = lastSpace + 1;
            }
            else {
                selStart = 0;
            }
            let nextSpace = simpleText.indexOf(" ", selStart);
            if (nextSpace != -1) {
                selEnd = nextSpace;
            }
            else {
                selEnd = simpleText.length;
            }
        }
        let before = elem.value.substring(0, selStart);
        let after = elem.value.substring(selEnd);
        let mid = elem.value.substring(selStart, selEnd);
        if (mid.trim() == "") {
            return;
        }
        let strength = 1;
        while (mid.startsWith(" ")) {
            mid = mid.substring(1);
            before = before + " ";
        }
        while (mid.endsWith(" ")) {
            mid = mid.substring(0, mid.length - 1);
            after = " " + after;
        }
        if (mid.startsWith("(")) {
            before += mid.substring(0, 1);
            mid = mid.substring(1);
        }
        // Sorry for the regex. Matches ends with ":1.5)" or just ")". Or Just ":1.5". Also forbids backslash prefix. Also empty, so that needs a check after.
        let matched = mid.trim().match(/(?<![\\])(?:\:[0-9.-]*)?\)?$/);
        if (matched && matched[0]) {
            after = mid.substring(mid.length - matched[0].length) + after;
            mid = mid.substring(0, mid.length - matched[0].length);
        }
        if (before.trimEnd().endsWith("(") && after.trimStart().startsWith(":")) {
            let postColon = after.trimStart().substring(1);
            let paren = postColon.indexOf(')');
            while (paren > 0 && postColon.substring(paren - 1).startsWith('\\)')) {
                paren = postColon.indexOf(')', paren + 1);
            }
            if (paren != -1) {
                before = before.trimEnd();
                before = before.substring(0, before.length - 1);
                strength = parseFloat(postColon.substring(0, paren).trim());
                after = postColon.substring(paren + 1);
            }
        }
        else if (before.trimEnd().endsWith("(") && after.trimStart().startsWith(")")) {
            before = before.trimEnd();
            before = before.substring(0, before.length - 1);
            strength = 1.1;
            after = after.trimStart().substring(1);
        }
        strength += up ? 0.1 : -0.1;
        strength = `${formatNumberClean(strength, 5)}`;
        if (strength == "1") {
            elem.value = `${before}${mid}${after}`;
            elem.selectionStart = before.length;
            elem.selectionEnd = before.length + mid.length;
        }
        else {
            elem.value = `${before}(${mid}:${strength})${after}`;
            elem.selectionStart = before.length + 1;
            elem.selectionEnd = before.length + mid.length + 1;
        }
        triggerChangeFor(elem);
    }
    function moveCommaSeparatedElement(left) {
        let cursor = elem.selectionStart, cursorEnd = elem.selectionEnd;
        let parts = elem.value.split(',');
        let textIndex = 0;
        let index = -1;
        for (let i = 0; i < parts.length; i++) {
            let len = parts[i].length + 1;
            if (cursor >= textIndex && cursor < textIndex + len) {
                index = i;
                break;
            }
            textIndex += len;
        }
        if (index == -1) {
            return;
        }
        let swapIndex = left ? index - 1 : index + 1;
        if (swapIndex < 0 || swapIndex >= parts.length) {
            return;
        }
        let originalPart = parts[index];
        [parts[index], parts[swapIndex]] = [parts[swapIndex], parts[index]];
        let newValue = '';
        let newCursor = 0;
        for (let i = 0; i < parts.length; i++) {
            if (i > 0) {
                newValue += ',';
            }
            if (i == swapIndex) {
                newCursor = newValue.length + (cursor - textIndex);
            }
            newValue += parts[i];
        }
        elem.value = newValue;
        elem.selectionStart = newCursor;
        elem.selectionEnd = newCursor + (cursorEnd - cursor);
        triggerChangeFor(elem);
    }
    elem.addEventListener('keydown', (e) => {
        if (e.ctrlKey && (e.key == 'ArrowUp' || e.key == 'ArrowDown')) {
            shiftText(e.key == 'ArrowUp');
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        if (e.altKey && (e.key == 'ArrowLeft' || e.key == 'ArrowRight') && internalSiteJsGetUserSetting('ui.tagmovehotkeyenabled', false)) {
            moveCommaSeparatedElement(e.key == 'ArrowLeft');
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });
    if (typeof promptTabComplete != 'undefined') {
        promptTabComplete.enableFor(elem);
    }
}

function setSeedToRandom(elemId) {
    let elem = getRequiredElementById(elemId);
    elem.value = -1;
    triggerChangeFor(elem);
}

function doToggleEnable(id) {
    let elem = document.getElementById(id);
    if (!elem) {
        console.log(`Tried to toggle ${id} but it doesn't exist.`);
        return;
    }
    let toggler = document.getElementById(id + '_toggle');
    if (!toggler) {
        console.log(`Tried to toggle ${id} but the toggler doesn't exist.`);
        return;
    }
    let elem2 = document.getElementById(id + '_rangeslider');
    if (!toggler.checked) {
        if (elem.classList.contains('disabled-input')) {
            return;
        }
        elem.classList.add('disabled-input');
        if (elem2) {
            elem2.classList.add('disabled-input');
        }
        if (!elem.dataset.has_toggle_handler) {
            function autoActivate() {
                toggler.checked = true;
                doToggleEnable(id);
            };
            elem.addEventListener('focus', autoActivate);
            elem.addEventListener('change', autoActivate);
            if (elem2) {
                elem2.addEventListener('focus', autoActivate);
                elem2.addEventListener('change', autoActivate);
            }
            elem.dataset.has_toggle_handler = true;
        }
    }
    else {
        if (!elem.classList.contains('disabled-input')) {
            return;
        }
        elem.classList.remove('disabled-input');
        if (elem2) {
            elem2.classList.remove('disabled-input');
        }
    }
    if (typeof scheduleParamUnsupportUpdate == 'function') {
        scheduleParamUnsupportUpdate();
    }
}

function getToggleHtml(toggles, id, name, extraClass = '', func = 'doToggleEnable') {
    return toggles ? `<span class="form-check form-switch toggle-switch display-inline-block${extraClass}"><input class="auto-slider-toggle form-check-input" type="checkbox" id="${id}_toggle" title="Enable/disable ${name}" onclick="${func}('${id}')" onchange="${func}('${id}')" autocomplete="off"><div class="auto-slider-toggle-content"></div></span>` : '';
}

let loadImageFileDedup = false;

function load_image_file(elem) {
    if (loadImageFileDedup) {
        return;
    }
    updateFileDragging({ target: elem }, true);
    let file = elem.files[0];
    let parent = elem.closest('.auto-input');
    let preview = parent.querySelector('.auto-input-image-preview');
    let label = parent.querySelector('.auto-file-input-filename');
    if (file) {
        let name = file.name;
        if (name.length > 30) {
            name = `${name.substring(0, 27)}...`;
        }
        label.textContent = name;
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            elem.dataset.filedata = reader.result;
            preview.innerHTML = `<button class="interrupt-button auto-input-image-remove-button" title="Remove image">&times;</button><img alt="Image preview" />`;
            let img = preview.querySelector('img');
            img.onload = () => {
                label.textContent = `${name} (${img.naturalWidth}x${img.naturalHeight}, ${describeAspectRatio(img.naturalWidth, img.naturalHeight)})`;
                elem.dataset.width = img.naturalWidth;
                elem.dataset.height = img.naturalHeight;
                elem.dataset.filename = file.name.length > 500 ? file.name.substring(0, 150) + '...' : file.name;
                elem.dataset.resolution = `${img.naturalWidth}x${img.naturalHeight}`;
                loadImageFileDedup = true;
                triggerChangeFor(elem);
                loadImageFileDedup = false;
            };
            img.src = reader.result;
            preview.firstChild.addEventListener('click', () => {
                delete elem.dataset.filedata;
                label.textContent = "";
                preview.innerHTML = '';
                elem.value = '';
                triggerChangeFor(elem);
            });
        }, false);
        reader.readAsDataURL(file);
    }
    else {
        delete elem.dataset.filedata;
        label.textContent = "";
        preview.innerHTML = '';
    }
}

function autoSelectWidth(elem) {
    if (elem.classList.contains('nogrow')) {
        return;
    }
    let span = document.createElement('span');
    span.innerText = elem.selectedOptions[0] ? elem.selectedOptions[0].innerText : elem.value;
    document.body.appendChild(span);
    let width = Math.max(50, span.offsetWidth + 30);
    elem.style.width = `${width}px`;
    span.remove();
}

function autoNumberWidth(elem) {
    if (elem.classList.contains('nogrow')) {
        return;
    }
    let span = document.createElement('span');
    span.innerText = elem.value;
    document.body.appendChild(span);
    let width = Math.max(40, span.offsetWidth + 15);
    elem.style.width = `${width}px`;
    span.remove();
}


let popoverHoverTimer = null;

function doPopoverHoverDelay(id, ms) {
    popoverHoverTimer = setTimeout(function () { doPopoverHover(id); }, ms);
}

function doPopoverHover(id) {
    let input = getRequiredElementById(id);
    let parent = findParentOfClass(input, 'auto-input');
    let pop = getRequiredElementById(`popover_${id}`);
    if (pop.dataset.visible != "true") {
        let targetX = parent.getBoundingClientRect().right;
        let targetY = parent.getBoundingClientRect().top;
        pop.classList.add('sui-popover-visible');
        pop.style.width = '200px';
        pop.dataset.visible = "true";
        let x = Math.min(targetX, window.innerWidth - pop.offsetWidth - 10);
        let y = Math.min(targetY, window.innerHeight - pop.offsetHeight);
        pop.style.left = `${x}px`;
        pop.style.top = `${y}px`;
        pop.style.width = '';
    }
}

function hidePopoverHover(id) {
    if (popoverHoverTimer != null) {
        clearTimeout(popoverHoverTimer);
        popoverHoverTimer = null;
    }
    let pop = getRequiredElementById(`popover_${id}`);
    if (pop.dataset.visible == "true") {
        pop.classList.remove('sui-popover-visible');
        pop.dataset.visible = "false";
    }
}

function getPopoverElemsFor(id, popover_button) {
    if (!popover_button) {
        return ['', ''];
    }
    let settingElem = document.getElementById('usersettings_hintformat');
    let format = 'BUTTON';
    if (settingElem) {
        format = settingElem.value;
    }
    if (format == 'BUTTON') {
        return [`<span class="auto-input-qbutton info-popover-button" onclick="doPopover('${id}', arguments[0])">?</span>`, ''];
    }
    else if (format == 'HOVER') {
        return ['', ` onmouseover="doPopoverHover('${id}')" onmouseout="hidePopoverHover('${id}')"`];
    }
    else if (format == 'HOVER_DELAY') {
        let seconds = document.getElementById('usersettings_hoverdelayseconds');
        if (seconds) {
            let delayMs = parseInt(1000 * seconds.value);
            return ['', ` onmouseover="doPopoverHoverDelay('${id}', ${delayMs})" onmouseout="hidePopoverHover('${id}')"`]
        }
    }
    return ['', ''];
}

function getRangeStyle(value, min, max) {
    return `--range-value: ${(value-min)/(max-min)*100}%`;
}

// Generic popover HTML generator used across tabs
function makeGenericPopover(id, name, type, description, extraClass = '') {
    try {
        const cls = extraClass ? ` ${extraClass}` : '';
        const safeName = escapeHtmlNoBr ? escapeHtmlNoBr(name) : name;
        const safeDesc = (typeof safeHtmlOnly !== 'undefined') ? safeHtmlOnly(description) : description;
        return `<div class="sui-popover${cls}" id="popover_${id}"><b>${safeName}</b> (${type}):<br><span class="translate slight-left-margin-block">${safeDesc}</span></div>`;
    } catch (e) {
        // Fallback without helpers
        return `<div class=\"sui-popover${extraClass ? ' ' + extraClass : ''}\" id=\"popover_${id}\"><b>${name}</b> (${type}):<br><span class=\"translate slight-left-margin-block\">${description}</span></div>`;
    }
}

function updateRangeStyle(e) {
    const el = e.srcElement ? e.srcElement : e;
    el.parentElement.style.setProperty("--range-value", `${(el.value-el.min)/(el.max-el.min)*100}%`);
}

function makeSliderInput(featureid, id, paramid, name, description, value, min, max, view_min = 0, view_max = 0, step = 1, isPot = false, toggles = false, popover_button = true) {
    name = escapeHtml(name);
    featureid = featureid ? ` data-feature-require="${featureid}"` : '';
    let rangeVal = isPot ? potToLinear(value, max, min, step) : value;
    let [popover, featureid2] = getPopoverElemsFor(id, popover_button);
    featureid += featureid2;
    return `
    <div class="auto-input auto-slider-box"${featureid}>
        <label>
            <span class="auto-input-name">${getToggleHtml(toggles, id, name)}${translateableHtml(name)}${popover}</span>
        </label>
        <input class="auto-slider-number" type="number" id="${id}" data-param_id="${paramid}" value="${value}" min="${min}" max="${max}" step="${step}" data-ispot="${isPot}" autocomplete="off" onchange="autoNumberWidth(this)">
        <br>
        <div class="auto-slider-range-wrapper" style="${getRangeStyle(rangeVal, view_min, view_max)}">
            <input class="auto-slider-range" type="range" id="${id}_rangeslider" value="${rangeVal}" min="${view_min}" max="${view_max}" step="${step}" data-ispot="${isPot}" autocomplete="off" oninput="updateRangeStyle(this)" onchange="updateRangeStyle(this)">
        </div>
    </div>`;
}

function makeNumberInput(featureid, id, paramid, name, description, value, min, max, step = 1, format = 'big', toggles = false, popover_button = true) {
    name = escapeHtml(name);
    featureid = featureid ? ` data-feature-require="${featureid}"` : '';
    let [popover, featureid2] = getPopoverElemsFor(id, popover_button);
    featureid += featureid2;
    if (format == 'seed') {
        return `
            <div class="auto-input auto-number-box auto-input-flex"${featureid}>
                <label>
                    <span class="auto-input-name">${getToggleHtml(toggles, id, name)}${translateableHtml(name)}${popover}</span>
                </label>
                <input class="auto-number auto-number-seedbox" type="number" id="${id}" data-param_id="${paramid}" value="${value}" min="${min}" max="${max}" step="${step}" data-name="${name}" autocomplete="off">
                <button class="basic-button seed-button seed-random-button" title="Random (Set to -1)" onclick="setSeedToRandom('${id}')">&#x1F3B2;</button>
                <button class="basic-button seed-button seed-reuse-button" title="Reuse (from currently selected image)" onclick="reuseLastParamVal('${id}');">&#128257;</button>
            </div>`;
    }
    return `
        <div class="auto-input auto-number-box auto-input-flex"${featureid}>
            <label>
                <span class="auto-input-name">${getToggleHtml(toggles, id, name)}${translateableHtml(name)}${popover}</span>
            </label>
            <input class="auto-number" type="number" id="${id}" data-param_id="${paramid}" value="${value}" min="${min}" max="${max}" step="${step}" data-name="${name}" autocomplete="off" onchange="autoNumberWidth(this)">
        </div>`;
}

function makeSecretInput(featureid, id, paramid, name, description, value, placeholder, toggles = false, genPopover = false, popover_button = true) {
    name = escapeHtml(name);
    featureid = featureid ? ` data-feature-require="${featureid}"` : '';
    let [popover, featureid2] = getPopoverElemsFor(id, popover_button);
    featureid += featureid2;
    return `
    ${genPopover ? makeGenericPopover(id, name, 'Boolean', description, '') : ''}
    <div class="auto-input auto-text-box auto-input-flex-wide"${featureid}>
        <label>
            <span class="auto-input-name">${getToggleHtml(toggles, id, name)}${translateableHtml(name)}${popover}</span>
        </label>
        <input type="text" class="auto-text auto-text-block password" translate translate-no-text" id="${id}" data-param_id="${paramid}" placeholder="${escapeHtmlNoBr(placeholder)}" data-name="${name}" autocomplete="off" value="${escapeHtmlNoBr(value)}" />
    </div>`;
}

function dynamicSizeTextBox(elem, min=15) {
    let maxHeight = parseInt(internalSiteJsGetUserSetting('maxpromptlines', '10'));
    elem.style.height = '0px';
    let height = elem.scrollHeight;
    let fontSize = parseFloat(window.getComputedStyle(elem).fontSize);
    let roundedHeight = roundTo(height, fontSize);
    elem.style.height = `calc(min(${maxHeight}rem, ${Math.max(roundedHeight, min) + 5}px))`;
    if (jitterDebug) {
        console.error(`JitterDebug dynamicSizeTextBox: ${elem.id} height adjust: ${height} yield ${roundedHeight} max ${maxHeight} min ${min}, now ${elem.scrollHeight} db ${elem.offsetHeight} and ${elem.clientHeight}`);
    }
}

function makeTextInput(featureid, id, paramid, name, description, value, format, placeholder, toggles = false, genPopover = false, popover_button = true) {
    if (format == 'secret') {
        return makeSecretInput(featureid, id, paramid, name, description, value, placeholder, toggles, genPopover, popover_button);
    }
    name = escapeHtml(name);
    featureid = featureid ? ` data-feature-require="${featureid}"` : '';
    let onInp = format == "prompt" ? ' oninput="textPromptInputHandle(this)"' : (format == 'big' ? ' oninput="dynamicSizeTextBox(this, 32)"' : '');
    let tokenCounter = format == "prompt" ? '<span class="auto-input-prompt-tokencount" title="Text-Encoder token count / chunk-size">0/75</span>' : '';
    let [popover, featureid2] = getPopoverElemsFor(id, popover_button);
    featureid += featureid2;
    let isBig = format == "prompt" || format == "big";
    return `
    ${genPopover ? makeGenericPopover(id, name, 'Boolean', description, '') : ''}
    <div class="auto-input auto-text-box${(isBig ? "" : " auto-input-flex")} auto-input-flex-wide"${featureid}>
        <label>
            <span class="auto-input-name">${getToggleHtml(toggles, id, name)}${translateableHtml(name)}${popover}</span>
        </label>
        ${tokenCounter}
        <textarea class="auto-text${(isBig ? " auto-text-block" : "")} translate translate-no-text" id="${id}" data-param_id="${paramid}" rows="${isBig ? 2 : 1}"${onInp} placeholder="${escapeHtmlNoBr(placeholder)}" data-name="${name}" autocomplete="off">${escapeHtmlNoBr(value)}</textarea>
        ${format == 'prompt' ? `<button class="interrupt-button image-clear-button" style="display: none;">${translateableHtml("Clear Images")}</button>
        <div class="added-image-area" style="display: none;"></div>` : ''}
    </div>`;
}

function makeCheckboxInput(featureid, id, paramid, name, description, value, toggles = false, genPopover = false, popover_button = true) {
    name = escapeHtml(name);
    featureid = featureid ? ` data-feature-require="${featureid}"` : '';
    let checked = `${value}` == "true" ? ' checked="true"' : '';
    let [popover, featureid2] = getPopoverElemsFor(id, popover_button);
    featureid += featureid2;
    return `
    ${genPopover ? makeGenericPopover(id, name, 'Boolean', description, '') : ''}
    <div class="auto-input auto-checkbox-box auto-input-flex"${featureid}>
        <span class="auto-input-name">${getToggleHtml(toggles, id, name)}${translateableHtml(name)}${popover}</span>
        <input class="auto-checkbox" type="checkbox" data-name="${name}" id="${id}" data-param_id="${paramid}"${checked}>
    </div>`;
}

function htmlWithParen(text) {
    let start = text.indexOf("(");
    if (start == -1) {
        return escapeHtml(text);
    }
    let end = text.indexOf(")", start);
    if (end == -1) {
        return escapeHtml(text);
    }
    let prefix = text.substring(0, start);
    let mid = text.substring(start, end + 1);
    let suffix = text.substring(end + 1);
    return `${htmlWithParen(prefix)}<span class='parens'>${escapeHtml(mid)}</span>${htmlWithParen(suffix)}`;
}

function makeDropdownInput(featureid, id, paramid, name, description, values, defaultVal, toggles = false, popover_button = true, alt_names = null) {
    name = escapeHtml(name);
    featureid = featureid ? ` data-feature-require="${featureid}"` : '';
    let [popover, featureid2] = getPopoverElemsFor(id, popover_button);
    featureid += featureid2;
    let html = `
    <div class="auto-input auto-dropdown-box auto-input-flex"${featureid}>
        <label>
            <span class="auto-input-name">${getToggleHtml(toggles, id, name)}${translateableHtml(name)}${popover}</span>
        </label>
        <select class="form-select" id="${id}" data-name="${name}" data-param_id="${paramid}" autocomplete="off" onchange="autoSelectWidth(this)">`;
    for (let i = 0; i < values.length; i++) {
        let value = values[i];
        let alt_name = alt_names && alt_names[i] ? alt_names[i] : value;
        let selected = value == defaultVal ? ' selected="true"' : '';
        let cleanName = htmlWithParen(alt_name);
        html += `<option data-cleanname="${cleanName}" value="${escapeHtmlNoBr(value)}"${selected}>${cleanName}</option>\n`;
    }
    html += `
        </select>
    </div>`;
    return html;
}

function makeMultiselectInput(featureid, id, paramid, name, description, values, defaultVal, placeholder, toggles = false, popover_button = true) {
    name = escapeHtml(name);
    featureid = featureid ? ` data-feature-require="${featureid}"` : '';
    let [popover, featureid2] = getPopoverElemsFor(id, popover_button);
    featureid += featureid2;
    let html = `
    <div class="auto-input auto-dropdown-box"${featureid}>
        <label>
            <span class="auto-input-name">${getToggleHtml(toggles, id, name)}${translateableHtml(name)}${popover}</span>
        </label>
        <select class="form-select" id="${id}" data-param_id="${paramid}" autocomplete="off" data-placeholder="${escapeHtmlNoBr(placeholder)}" multiple>`;
    for (let value of values) {
        let selected = value == defaultVal ? ' selected="true"' : '';
        html += `<option value="${escapeHtmlNoBr(value)}"${selected}>${escapeHtml(value)}</option>`;
    }
    html += `
        </select>
    </div>`;
    return html;
}

function onImageInputPaste(e) {
    let element = findParentOfClass(e.target, 'auto-input').querySelector('input[type="file"]');
    let files = e.clipboardData.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        element.files = files;
        triggerChangeFor(element);
    }
}

function makeImageInput(featureid, id, paramid, name, description, toggles = false, popover_button = true) {
    name = escapeHtml(name);
    featureid = featureid ? ` data-feature-require="${featureid}"` : '';
    let [popover, featureid2] = getPopoverElemsFor(id, popover_button);
    featureid += featureid2;
    let html = `
    <div class="auto-input auto-file-box"${featureid}>
        <label class="auto-image-input-label">
            <span class="auto-input-name">${getToggleHtml(toggles, id, name)}${translateableHtml(name)}${popover}</span>
            <input type="text" id="${id}_pastebox" size="14" maxlength="0" placeholder="Ctrl+V: Paste Image" onpaste="onImageInputPaste(arguments[0])">
        </label>
        <label for="${id}" class="auto-file-label drag_image_target">
            <input class="auto-file" type="file" accept="image/png, image/jpeg, image/webp, image/gif" id="${id}" data-param_id="${paramid}" onchange="load_image_file(this)" ondragover="updateFileDragging(arguments[0], false)" ondragleave="updateFileDragging(arguments[0], true)" autocomplete="off">
            <div class="auto-file-input">
                <a class="auto-file-input-button basic-button">${translateableHtml("Choose File")}</a>
                <span class="auto-file-input-filename"></span>
            </div>
        </label>
        <div class="auto-input-image-preview"></div>
    </div>`;
    return html;
}

let chromeIsDumbFileName = null, chromeIsDumbFileUris = null;

/**
 * This is a deeply cursed bonus hack to fix like two separate bonus problems specific to Chromium just being bad.
 * It can't modify dataTransfer inside the drag start event (why??? they mention security in re drag*over* which makes sense, but why start?!),
 * and also it mixes up the file extension at random for unclear reasons. Also the lastModified time is just the current time instead of a reliable time.
 * Overall 0/10, chromium is trash, never use it.
 */
function chromeIsDumbFileHack(file, uris) {
    if (!file) {
        return;
    }
    chromeIsDumbFileName = strBeforeLast(file.name, '.');
    chromeIsDumbFileUris = uris;
}

// This is a giant hackpile to force dragging images onto inputs to treat them like files and thus actually work
// ft. bonus chrome nonsense hackfix, see above
window.addEventListener('drop', e => {
    let uris;
    if (e.dataTransfer && e.dataTransfer.files.length) {
        let fname = strBeforeLast(e.dataTransfer.files[0].name, '.');
        if (fname == chromeIsDumbFileName) {
            uris = chromeIsDumbFileUris;
        }
        else {
            chromeIsDumbFileName = null;
            return;
        }
    }
    else {
        uris = e.dataTransfer.getData('text/uri-list');
    }
    chromeIsDumbFileName = null;
    if (!uris) {
        return;
    }
    e.preventDefault();
    e.stopPropagation();
    let file = uris.split('\n')[0];
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = () => {
        let blob = xhr.response;
        let reader = new FileReader();
        reader.onload = () => {
            // idk why but I can't just "new DropEvent", and "new DragEvent('drop')" errors
            let dropEvent = document.createEvent('Event');
            dropEvent.initEvent('drop', true, true);
            dropEvent.dataTransfer = new DataTransfer();
            let outFile = new File([blob], file.split('/').pop(), { type: blob.type });
            dropEvent.dataTransfer.items.add(outFile);
            dropEvent.dataTransfer.files = [outFile];
            e.target.dispatchEvent(dropEvent);
            if (e.target.tagName == 'INPUT' && e.target.type == 'file') {
                e.target.files = dropEvent.dataTransfer.files;
                triggerChangeFor(e.target);
            }
        };
        reader.readAsDataURL(blob);
    };
    xhr.open('GET', file);
    xhr.send();
    return false;
}, { capture: true, passive: false });

function updateFileDragging(e, out) {
    let files = out ? [] : uiImprover.getFileList(e.dataTransfer);
    const el = e.target.nextElementSibling;
    const mode = files.length ? "add" : "remove";
    el.classList[mode]("auto-file-input-file-drag");
    if (e.preventDefault) {
        e.preventDefault();
    }
}

function describeAspectRatio(width, height) {
    let wh = width / height;
    let hw = height / width;
    if (roundTo(wh, 0.01) == 1) {
        return '1:1';
    }
    else if (roundTo(wh, 0.01) % 1 == 0) {
        return `${Math.round(wh)}:1`;
    }
    else if (roundTo(hw, 0.01) % 1 == 0) {
        return `1:${Math.round(hw)}`;
    }
    for (let i = 2; i < 50; i++) {
        if (roundTo(wh * i, 0.01) % 1 == 0) {
            return `${Math.round(wh * i)}:${i}`;
        }
        if (roundTo(hw * i, 0.01) % 1 == 0) {
            return `${i}:${Math.round(hw * i)}`;
        }
    }
    if (wh > 1) {
        return `${roundToStr(wh, 2)}:1`;
    }
    return `1:${roundToStr(hw, 2)}`;
}

function quickAppendButton(div, name, func, classes = '', title = '') {
    let button = document.createElement('button');
    button.className = `basic-button${classes}`;
    button.innerHTML = name;
    button.title = title;
    button.onclick = (e) => func(e, button);
    div.appendChild(button);
}

function modalHeader(id, title) {
    return `<div class="modal" tabindex="-1" id="${id}">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">${title}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>`;
}

function modalFooter() {
    return `</div></div></div>`;
}

let specialDebugTime = Date.now();
function specialDebug(message) {
    let now = Date.now();
    let diff = now - specialDebugTime;
    specialDebugTime = now;
    console.log(`${message} (${diff}ms since last debug)`);
}

function playCompletionAudio() {
    let audioFile = internalSiteJsGetUserSetting('audio.completionsound', null);
    if (audioFile) {
        let audio = new Audio(`/Audio/${audioFile}`);
        audio.volume = parseFloat(internalSiteJsGetUserSetting('audio.volume', '0.5'));
        audio.play();
    }
}

async function doPasswordClientPrehash(userId, pw) {
    if (!userId) {
        throw new Error('Password handling failed, no userId set?');
    }
    // The server does the real hash, but the client prehash is because dumb users tend to reuse passwords across sites, so we'd rather not let the Swarm instance owner know the raw password.
    // This is not particularly secure, but it doesn't hurt to do, and decreases the odds of a malicious owner (or hacker) to grab passwords.
    // (They could also just swap the JS or something so an intentional attacker wouldn't really be stopped here)
    let str = `swarmclientpw:${userId}:${pw}`;
    try {
        let hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
        return toHexString(new Uint8Array(hash)).toLowerCase();
    }
    catch (e) {
        // SHA-256 is restricted in some contexts (eg no https) because I guess web standards devs hate you? So if you don't have network security, transmit extra-raw passwords.
        // Prefixed to ensure server will do the prehash (so that https and non-https have equivalent values)
        console.warn(`Crypto.Subtle is invalid in your browser context, passwords won't be prehashed`);
        return `__swarmdoprehash:${str}`;
    }
}

function fixTabHeights() {
    let tabs = document.querySelectorAll('.scroll-within-tab');
    for (let tab of tabs) {
        tab.style.maxHeight = `calc(100vh - ${tab.offsetTop}px)`;
    }
}

fixTabHeights();
setTimeout(fixTabHeights, 100);

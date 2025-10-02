let gen_param_types = null, rawGenParamTypesFromServer = null, rawGroupMapFromServer = null;

let swarmHasLoaded = false;

let lastImageDir = '';

let lastModelDir = '';

let num_current_gens = 0, num_models_loading = 0, num_live_gens = 0, num_backends_waiting = 0;

let shouldApplyDefault = false;

let sessionReadyCallbacks = [];

let allModels = [];

let coreModelMap = {};

let otherInfoSpanContent = [];

let isGeneratingForever = false, isGeneratingPreviews = false;

let lastHistoryImage = null, lastHistoryImageDiv = null;

let currentMetadataVal = null, currentImgSrc = null;

let autoCompletionsList = null;
let autoCompletionsOptimize = false;

let mainGenHandler = new GenerateHandler();

let pageTitleSuffix = document.title.split(' - ')[1];
let curAutoTitle = "Page is loading...";

function setPageTitle(newTitle) {
    document.title = `${newTitle} - ${pageTitleSuffix}`;
}

function autoTitle() {
    let tabList = getRequiredElementById('toptablist');
    let activeTopTab = tabList.querySelector('.active');
    curAutoTitle = activeTopTab.textContent;
    setPageTitle(curAutoTitle);
}

function updateOtherInfoSpan() {
    let span = getRequiredElementById('other_info_span');
    span.innerHTML = otherInfoSpanContent.join(' ');
}

const time_started = Date.now();

let statusBarElem = getRequiredElementById('top_status_bar');

let generatingPreviewsText = translatable('Generating live previews...');
let waitingOnModelLoadText = translatable('waiting on model load');
let generatingText = translatable('generating');

function updateCurrentStatusDirect(data) {
    if (data) {
        num_current_gens = data.waiting_gens;
        num_models_loading = data.loading_models;
        num_live_gens = data.live_gens;
        num_backends_waiting = data.waiting_backends;
    }
    let total = num_current_gens + num_models_loading + num_live_gens + num_backends_waiting;
    if (isGeneratingPreviews && num_current_gens <= getRequiredElementById('usersettings_maxsimulpreviews').value) {
        total = 0;
    }
    getRequiredElementById('alt_interrupt_button').classList.toggle('interrupt-button-none', total == 0);
    let oldInterruptButton = document.getElementById('interrupt_button');
    if (oldInterruptButton) {
        oldInterruptButton.classList.toggle('interrupt-button-none', total == 0);
    }
    let elem = getRequiredElementById('num_jobs_span');
    function autoBlock(num, text) {
        if (num == 0) {
            return '';
        }
        return `<span class=\"interrupt-line-part\">${num} ${text.replaceAll('%', autoS(num))},</span> `;
    }
    let timeEstimate = '';
    if (total > 0 && mainGenHandler.totalGensThisRun > 0) {
        let avgGenTime = mainGenHandler.totalGenRunTime / mainGenHandler.totalGensThisRun;
        let estTime = avgGenTime * total;
        timeEstimate = ` (est. ${durationStringify(estTime)})`;
    }
    const statusText = total == 0 ? (isGeneratingPreviews ? generatingPreviewsText.get() : '') : `${autoBlock(num_current_gens, 'current generation%')}${autoBlock(num_live_gens, 'running')}${autoBlock(num_backends_waiting, 'queued')}${autoBlock(num_models_loading, waitingOnModelLoadText.get())} ${timeEstimate}...`;
    elem.innerHTML = statusText;
    let max = Math.max(num_current_gens, num_models_loading, num_live_gens, num_backends_waiting);
    setPageTitle(total == 0 ? curAutoTitle : `(${max} ${generatingText.get()}) ${curAutoTitle}`);
    const live = document.getElementById('live_status');
    if (live) { live.textContent = statusText.replace(/<[^>]*>/g, ''); }
}

let doesHaveGenCountUpdateQueued = false;

function updateGenCount() {
    updateCurrentStatusDirect(null);
    if (doesHaveGenCountUpdateQueued) {
        return;
    }
    doesHaveGenCountUpdateQueued = true;
    setTimeout(() => {
        reviseStatusBar();
    }, 500);
}

let hasAppliedFirstRun = false;
let backendsWereLoadingEver = false;
let reviseStatusInterval = null;
let currentBackendFeatureSet = [];
let rawBackendFeatureSet = [];
let lastStatusRequestPending = 0;
function reviseStatusBar() {
    if (lastStatusRequestPending + 20 * 1000 > Date.now()) {
        return;
    }
    if (session_id == null) {
        statusBarElem.innerText = 'Loading...';
        statusBarElem.className = `top-status-bar status-bar-warn`;
        return;
    }
    lastStatusRequestPending = Date.now();
    genericRequest('GetCurrentStatus', {}, data => {
        lastStatusRequestPending = 0;
        if (JSON.stringify(data.supported_features) != JSON.stringify(currentBackendFeatureSet)) {
            rawBackendFeatureSet = data.supported_features;
            currentBackendFeatureSet = data.supported_features;
            reviseBackendFeatureSet();
            hideUnsupportableParams();
        }
        doesHaveGenCountUpdateQueued = false;
        updateCurrentStatusDirect(data.status);
        let status;
        if (versionIsWrong) {
            status = { 'class': 'error', 'message': 'The server has updated since you opened the page, please refresh.' };
        }
        else {
            status = data.backend_status;
            if (data.backend_status.any_loading) {
                backendsWereLoadingEver = true;
            }
            else {
                if (!hasAppliedFirstRun) {
                    hasAppliedFirstRun = true;
                    refreshParameterValues(backendsWereLoadingEver || window.alwaysRefreshOnLoad);
                }
            }
            if (reviseStatusInterval != null) {
                if (status.class != '') {
                    clearInterval(reviseStatusInterval);
                    reviseStatusInterval = setInterval(reviseStatusBar, 2 * 1000);
                }
                else {
                    clearInterval(reviseStatusInterval);
                    reviseStatusInterval = setInterval(reviseStatusBar, 60 * 1000);
                }
            }
        }
        statusBarElem.innerText = translate(status.message);
        statusBarElem.className = `top-status-bar status-bar-${status.class}`;
    });
}

/** Array of functions called on key events (eg model selection change) to update displayed features.
 * Return format [array addMe, array removeMe]. For example `[[], ['sd3']]` indicates that the 'sd3' feature flag is not currently supported (eg by current model).
 * Can use 'curModelCompatClass', 'curModelArch' to check the current model architecture. Note these values may be null.
 * */
let featureSetChangers = [];

function reviseBackendFeatureSet() {
    currentBackendFeatureSet = Array.from(currentBackendFeatureSet);
    let addMe = [], removeMe = [];
    function doCompatFeature(compatClass, featureFlag) {
        if (curModelCompatClass && curModelCompatClass.startsWith(compatClass)) {
            addMe.push(featureFlag);
        }
        else {
            removeMe.push(featureFlag);
        }
    }
    function doAnyCompatFeature(compatClasses, featureFlag) {
        for (let compatClass of compatClasses) {
            if (curModelCompatClass && curModelCompatClass.startsWith(compatClass)) {
                addMe.push(featureFlag);
                return;
            }
        }
        removeMe.push(featureFlag);
    }
    function doAnyArchFeature(archIds, featureFlag) {
        for (let archId of archIds) {
            if (curModelArch && curModelArch.startsWith(archId)) {
                addMe.push(featureFlag);
                return;
            }
        }
        removeMe.push(featureFlag);
    }
    doCompatFeature('stable-diffusion-v3', 'sd3');
    doCompatFeature('stable-cascade-v1', 'cascade');
    doAnyArchFeature(['Flux.1-dev', 'hunyuan-video'], 'flux-dev');
    doCompatFeature('stable-diffusion-xl-v1', 'sdxl');
    doAnyCompatFeature(['genmo-mochi-1', 'lightricks-ltx-video', 'hunyuan-video', 'nvidia-cosmos-1', `wan-21`, `wan-22`], 'text2video');
    for (let changer of featureSetChangers) {
        let [add, remove] = changer();
        addMe.push(...add);
        removeMe.push(...remove);
    }
    let anyChanged = false;
    for (let add of addMe) {
        if (!currentBackendFeatureSet.includes(add)) {
            currentBackendFeatureSet.push(add);
            anyChanged = true;
        }
    }
    for (let remove of removeMe) {
        let index = currentBackendFeatureSet.indexOf(remove);
        if (index != -1) {
            currentBackendFeatureSet.splice(index, 1);
            anyChanged = true;
        }
    }
    if (anyChanged) {
        hideUnsupportableParams();
    }
}

let toolSelector = getRequiredElementById('tool_selector');
let toolContainer = getRequiredElementById('tool_container');

function genToolsList() {
    let altGenerateButton = getRequiredElementById('alt_generate_button');
    let oldGenerateButton = document.getElementById('generate_button');
    let altGenerateButtonRawText = altGenerateButton.innerText;
    let altGenerateButtonRawOnClick = altGenerateButton.onclick;
    toolSelector.value = '';
    // Restore last selected tool
    let savedTool = localStorage.getItem('sui.selectedTool') || '';
    if (savedTool) { toolSelector.value = savedTool; }
    // TODO: Dynamic-from-server option list generation
    toolSelector.addEventListener('change', () => {
        for (let opened of toolContainer.getElementsByClassName('tool-open')) {
            opened.classList.remove('tool-open');
        }
        altGenerateButton.innerText = altGenerateButtonRawText;
        altGenerateButton.onclick = altGenerateButtonRawOnClick;
        if (oldGenerateButton) {
            oldGenerateButton.innerText = altGenerateButtonRawText;
        }
        let tool = toolSelector.value;
        localStorage.setItem('sui.selectedTool', tool || '');
        if (tool == '') {
            getRequiredElementById('clear_selected_tool_button').style.display = 'none';
            return;
        }
        let div = getRequiredElementById(`tool_${tool}`);
        div.classList.add('tool-open');
        let override = toolOverrides[tool];
        if (override) {
            altGenerateButton.innerText = override.text;
            altGenerateButton.onclick = override.run;
            if (oldGenerateButton) {
                oldGenerateButton.innerText = override.text;
            }
        }
        div.dispatchEvent(new Event('tool-opened'));
        getRequiredElementById('clear_selected_tool_button').style.display = '';
    });
    // Trigger initial selection application
    triggerChangeFor(toolSelector);
}

let toolOverrides = {};

function registerNewTool(id, name, genOverride = null, runOverride = null) {
    let option = document.createElement('option');
    option.value = id;
    option.innerText = name;
    toolSelector.appendChild(option);
    let div = createDiv(`tool_${id}`, 'tool');
    toolContainer.appendChild(div);
    if (genOverride) {
        toolOverrides[id] = { 'text': genOverride, 'run': runOverride };
    }
    return div;
}
function disableSelectedTool() {
    toolSelector.value = '';
    triggerChangeFor(toolSelector);
}

let notePadTool = registerNewTool('note_pad', 'Text Notepad');
notePadTool.appendChild(createDiv(`note_pad_tool_wrapper`, `note_pad_tool_wrapper`, `<span class="translate hoverable-minor-hint-text">This is an open text box where you can type any notes you need to keep track of. They will be temporarily persisted in browser session.</span><br><br><textarea id="note_pad_tool" class="auto-text" style="width:100%;height:100%;" placeholder="Type any notes here..."></textarea>`));
let notePadToolElem = getRequiredElementById('note_pad_tool');
notePadToolElem.value = localStorage.getItem('note_pad_tool') || '';
let notePadToolSaveEvent = null;
notePadToolElem.addEventListener('input', () => {
    if (notePadToolSaveEvent) {
        clearTimeout(notePadToolSaveEvent);
    }
    notePadToolSaveEvent = setTimeout(() => {
        localStorage.setItem('note_pad_tool', notePadToolElem.value);
    }, 1000);
    textBoxSizeAdjust(notePadToolElem);
});
notePadTool.addEventListener('tool-opened', () => {
    textBoxSizeAdjust(notePadToolElem);
});

function tweakNegativePromptBox() {
    let altNegText = getRequiredElementById('alt_negativeprompt_textbox');
    let cfgScale = document.getElementById('input_cfgscale');
    let cfgScaleVal = cfgScale ? parseFloat(cfgScale.value) : 7;
    if (cfgScaleVal == 1) {
        altNegText.classList.add('alt-negativeprompt-textbox-invalid');
        altNegText.placeholder = translate(`Negative Prompt is not available when CFG Scale is 1`);
    }
    else {
        altNegText.classList.remove('alt-negativeprompt-textbox-invalid');
        altNegText.placeholder = translate(`Optionally, type a negative prompt here...`);
    }
    altNegText.title = altNegText.placeholder;
}

function loadUserData(callback) {
    genericRequest('GetMyUserData', {}, data => {
        permissions.updateFrom(data.permissions);
        starredModels = data.starred_models;
        autoCompletionsList = {};
        if (data.autocompletions) {
            let allSet = [];
            autoCompletionsList['all'] = allSet;
            for (let val of data.autocompletions) {
                let split = val.split('\n');
                let datalist = autoCompletionsList[val[0]];
                let entry = { name: split[0], low: split[1].replaceAll(' ', '_').toLowerCase(), clean: split[1], raw: val, count: 0 };
                if (split.length > 2) {
                    entry.tag = split[2];
                }
                if (split.length > 3) {
                    count = parseInt(split[3]) || 0;
                    if (count) {
                        entry.count = count;
                        entry.count_display = largeCountStringify(count);
                    }
                }
                if (split.length > 4) {
                    entry.alts = split[4].split(',').map(x => x.trim().toLowerCase());
                    for (let alt of entry.alts) {
                        if (!autoCompletionsList[alt]) {
                            autoCompletionsList[alt] = [];
                        }
                        autoCompletionsList[alt].push(entry);
                    }
                }
                else {
                    entry.alts = [];
                }
                if (!datalist) {
                    datalist = [];
                    autoCompletionsList[val[0]] = datalist;
                }
                datalist.push(entry);
                allSet.push(entry);
            }
        }
        else {
            autoCompletionsList = null;
        }
        if (!language) {
            language = data.language;
        }
        allPresetsUnsorted = data.presets;
        sortPresets();
        presetBrowser.update();
        if (shouldApplyDefault) {
            shouldApplyDefault = false;
            let defaultPreset = getPresetByTitle('default');
            if (defaultPreset) {
                applyOnePreset(defaultPreset);
            }
        }
        if (callback) {
            callback();
        }
        loadAndApplyTranslations();
    });
}

function updateAllModels(models) {
    coreModelMap = models;
    allModels = models['Stable-Diffusion'];
    let selector = getRequiredElementById('current_model');
    let selectorVal = selector.value;
    selector.innerHTML = '';
    let emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.innerText = '';
    selector.appendChild(emptyOption);
    for (let model of allModels) {
        let option = document.createElement('option');
        let clean = cleanModelName(model);
        option.value = clean;
        option.innerText = clean;
        selector.appendChild(option);
    }
    selector.value = selectorVal;
    pickle2safetensor_load();
    modelDownloader.reloadFolders();
}

/** Set some element titles via JavaScript (to allow '\n'). */
function setTitles() {
    getRequiredElementById('alt_prompt_textbox').title = "Tell the AI what you want to see, then press Enter to submit.\nConsider 'a photo of a cat', or 'cartoonish drawing of an astronaut'";
    getRequiredElementById('alt_interrupt_button').title = "Interrupt current generation(s)\nRight-click for advanced options.";
    getRequiredElementById('alt_generate_button').title = "Start generating images\nRight-click for advanced options.";
    let oldGenerateButton = document.getElementById('generate_button');
    if (oldGenerateButton) {
        oldGenerateButton.title = getRequiredElementById('alt_generate_button').title;
        getRequiredElementById('interrupt_button').title = getRequiredElementById('alt_interrupt_button').title;
    }
}
setTitles();

function doFeatureInstaller(name, button_div_id, alt_confirm, callback = null, deleteButton = true) {
    if (!confirm(alt_confirm)) {
        return;
    }
    let buttonDiv = button_div_id ? document.getElementById(button_div_id) : null;
    if (buttonDiv) {
        buttonDiv.querySelector('button').disabled = true;
        buttonDiv.appendChild(createDiv('', null, 'Installing...'));
    }
    genericRequest('ComfyInstallFeatures', {'features': name}, data => {
        if (buttonDiv) {
            buttonDiv.appendChild(createDiv('', null, "Installed! Please wait while backends restart. If it doesn't work, you may need to restart Swarm."));
        }
        if (typeof showSuccess === 'function') {
            showSuccess('Feature(s) installed. Backends are restarting...');
        }
        reviseStatusBar();
        setTimeout(() => {
            if (deleteButton && buttonDiv) {
                buttonDiv.remove();
            }
            hasAppliedFirstRun = false;
            reviseStatusBar();
            if (callback) {
                callback();
            }
        }, 8000);
    }, 0, (e) => {
        showError(e);
        if (buttonDiv) {
            buttonDiv.appendChild(createDiv('', null, 'Failed to install!'));
            buttonDiv.querySelector('button').disabled = false;
        }
    });
}

function installFeatureById(ids, buttonId = null, modalId = null) {
    let notice = '';
    for (let id of ids.split(',')) {
        let feature = comfy_features[id];
        if (!feature) {
            console.error(`Feature ID ${id} not found in comfy_features, can't install`);
            return;
        }
        notice += feature.notice + '\n';
    }
doFeatureInstaller(ids, buttonId, notice.trim(), () => {
        if (modalId) {
            hideModalById(modalId);
        }
    });
}

function installTensorRT() {
    doFeatureInstaller('comfyui_tensorrt', 'install_trt_button', `This will install TensorRT support developed by Comfy and NVIDIA.\nDo you wish to install?`, () => {
        getRequiredElementById('tensorrt_mustinstall').style.display = 'none';
        getRequiredElementById('tensorrt_modal_ready').style.display = '';
    });
}

function clearPromptImages() {
    let promptImageArea = getRequiredElementById('alt_prompt_image_area');
    promptImageArea.innerHTML = '';
    let clearButton = getRequiredElementById('alt_prompt_image_clear_button');
    clearButton.style.display = 'none';
    autoRevealRevision();
}

function hideRevisionInputs() {
    let revisionGroup = document.getElementById('input_group_imageprompting');
    let revisionToggler = document.getElementById('input_group_content_imageprompting_toggle');
    if (revisionGroup) {
        revisionToggler.checked = false;
        triggerChangeFor(revisionToggler);
        toggleGroupOpen(revisionGroup, false);
        revisionGroup.style.display = 'none';
    }
    genTabLayout.altPromptSizeHandle();
}

function showRevisionInputs(toggleOn = false) {
    let revisionGroup = document.getElementById('input_group_imageprompting');
    let revisionToggler = document.getElementById('input_group_content_imageprompting_toggle');
    if (revisionGroup) {
        toggleGroupOpen(revisionGroup, true);
        if (toggleOn) {
            revisionToggler.checked = true;
            triggerChangeFor(revisionToggler);
        }
        revisionGroup.style.display = '';
    }
}

revisionRevealerSources = [];

function autoRevealRevision() {
    let promptImageArea = getRequiredElementById('alt_prompt_image_area');
    if (promptImageArea.children.length > 0 || revisionRevealerSources.some(x => x())) {
        showRevisionInputs();
    }
    else {
        hideRevisionInputs();
    }
}

function imagePromptAddImage(file) {
    let clearButton = getRequiredElementById('alt_prompt_image_clear_button');
    let promptImageArea = getRequiredElementById('alt_prompt_image_area');
    let reader = new FileReader();
    reader.onload = (e) => {
        let data = e.target.result;
        let imageContainer = createDiv(null, 'alt-prompt-image-container');
        let imageRemoveButton = createSpan(null, 'alt-prompt-image-container-remove-button', '&times;');
        imageRemoveButton.addEventListener('click', (e) => {
            imageContainer.remove();
            autoRevealRevision();
            genTabLayout.altPromptSizeHandle();
        });
        imageRemoveButton.title = 'Remove this image';
        imageContainer.appendChild(imageRemoveButton);
        let imageObject = new Image();
        imageObject.src = data;
        imageObject.height = 128;
        imageObject.className = 'alt-prompt-image';
        imageObject.dataset.filedata = data;
        imageContainer.appendChild(imageObject);
        clearButton.style.display = '';
        showRevisionInputs(true);
        promptImageArea.appendChild(imageContainer);
        genTabLayout.altPromptSizeHandle();
    };
    reader.readAsDataURL(file);
}

function imagePromptInputHandler() {
    let dragArea = getRequiredElementById('alt_prompt_region');
    dragArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
    });
    let clearButton = getRequiredElementById('alt_prompt_image_clear_button');
    clearButton.addEventListener('click', () => {
        clearPromptImages();
    });
    dragArea.addEventListener('drop', (e) => {
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            e.preventDefault();
            e.stopPropagation();
            for (let file of e.dataTransfer.files) {
                if (file.type.startsWith('image/')) {
                    imagePromptAddImage(file);
                }
            }
        }
    });
}
imagePromptInputHandler();

function imagePromptImagePaste(e) {
    let items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (let item of items) {
        if (item.kind === 'file') {
            let file = item.getAsFile();
            if (file.type.startsWith('image/')) {
                imagePromptAddImage(file);
            }
        }
    }
}

function openEmptyEditor() {
    let canvas = document.createElement('canvas');
    canvas.width = document.getElementById('input_width').value;
    canvas.height = document.getElementById('input_height').value;
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let image = new Image();
    image.onload = () => {
        imageEditor.clearVars();
        imageEditor.setBaseImage(image);
        imageEditor.activate();
    };
    image.src = canvas.toDataURL();
}

function debugGenAPIDocs() {
    genericRequest('DebugGenDocs', { }, data => { });
}

let hashSubTabMapping = {
    'utilities_tab': 'utilitiestablist',
    'user_tab': 'usertablist',
    'server_tab': 'servertablist',
};

function clickFirstIn(listId) {
    const list = document.getElementById(listId);
    if (!list) return false;
    const first = list.querySelector('a.nav-link');
    if (first) { first.click(); return true; }
    return false;
}
function clickAnchorIn(listId, hrefId) {
    let list = document.getElementById(listId);
    if (!list) return false;
    let target = list.querySelector(`a[href='#${hrefId}']`);
    if (target) { target.click(); return true; }
    return false;
}

function applyWorkspaceRoute(hash) {
    // Supports routes like #Generate, #Simple, #Utilities, #Settings, #Settings/API-Keys, #Server, #Comfy (if present)
    if (!hash) return false;
    let parts = hash.replace(/^#/, '').split('/');
    let top = parts[0].toLowerCase();
    let sub = parts.length > 1 ? parts.slice(1).join('/') : '';
    
    // Hide only TOP-LEVEL tab panes (direct children of .tab-content), not nested ones
    const topLevelPanes = document.querySelectorAll('.tab-content.tab-hundred > .tab-pane');
    topLevelPanes.forEach(pane => {
        pane.style.display = 'none';
        pane.classList.remove('show', 'active');
    });
    
    // Update main navigation active states
    const mainNavLinks = document.querySelectorAll('#navbarNav .nav-link');
    mainNavLinks.forEach(link => link.classList.remove('active'));
    
    function showPane(paneId) {
        const pane = document.getElementById(paneId);
        if (pane) {
            pane.style.display = 'block';
            pane.classList.add('show', 'active');
        }
    }
    
    function setMainNavActive(navId) {
        const navLink = document.getElementById(navId);
        if (navLink) navLink.classList.add('active');
    }
    
    function click(id) { let e = document.getElementById(id); if (e) e.click(); }
    
    switch (top) {
        case 'generate':
        case 'image':
        case 'text2image':
            showPane('Text2Image');
            setMainNavActive('main_nav_generate');
            click('text2imagetabbutton');
            updateSubNavigation('generate');
            return true;
        case 'simple':
            showPane('Simple');
            setMainNavActive('main_nav_simple');
            click('simpletabbutton');
            updateSubNavigation('simple');
            return true;
        case 'utilities':
            showPane('utilities_tab');
            setMainNavActive('main_nav_utilities');
            click('utilitiestabbutton');
            updateSubNavigation('utilities', sub);
            // Allow subroutes like #Utilities/CLIP-Tokenization or #Utilities/LoRA-Extractor
            setTimeout(() => {
                let subLower = sub.toLowerCase();
                let matched = false;
                if (subLower.includes('clip')) matched = clickAnchorIn('utilitiestablist', 'Utilities-CLIP-Token-Tab');
                else if (subLower.includes('safetensor') || subLower.includes('pickle')) matched = clickAnchorIn('utilitiestablist', 'Utilities-Pickle2Safetensor-Tab');
                else if (subLower.includes('lora')) matched = clickAnchorIn('utilitiestablist', 'Utilities-LoraExtractor-Tab');
                else if (subLower.includes('model') && subLower.includes('down')) matched = clickAnchorIn('utilitiestablist', 'Utilities-ModelDownloader-Tab');
                if (!matched) clickFirstIn('utilitiestablist');
            }, 1);
            return true;
        case 'settings':
        case 'user':
            showPane('user_tab');
            setMainNavActive('main_nav_settings');
            click('usersettingstabbutton');
            updateSubNavigation('settings', sub);
            // Subroutes like #Settings/API-Keys, #Settings/User, #Settings/Layout
            setTimeout(() => {
                let subLower = sub.toLowerCase();
                let matched = false;
                if (subLower.includes('api')) matched = clickAnchorIn('usertablist', 'Param-Config-User');
                else if (subLower.includes('layout')) matched = clickAnchorIn('usertablist', 'Layout-Config-User');
                else if (subLower.includes('user')) matched = clickAnchorIn('usertablist', 'Settings-User');
                if (!matched) clickFirstIn('usertablist');
            }, 1);
            return true;
        case 'server':
            showPane('server_tab');
            setMainNavActive('main_nav_server');
            click('servertabbutton');
            updateSubNavigation('server');
            // Ensure the first sub-tab is activated
            setTimeout(() => {
                const firstSubTab = document.querySelector('#servertablist .nav-link');
                if (firstSubTab && !document.querySelector('#servertablist .nav-link.active')) {
                    firstSubTab.click();
                }
            }, 10);
            return true;
        case 'comfy':
            // Try common comfy anchors injected by @WebServer.T2ITabHeader
            let comfy = document.querySelector("a[href*='Comfy']");
            if (comfy) {
                let paneId = comfy.getAttribute('href').substring(1);
                showPane(paneId);
                setMainNavActive('main_nav_comfy');
                // Make sure ComfyUI nav item is visible
                const comfyNavItem = document.getElementById('main_nav_comfy_item');
                if (comfyNavItem) comfyNavItem.style.display = '';
                comfy.click();
                updateSubNavigation('comfy');
            }
            else {
                // Fallback: click any anchor containing 'comfy' text
                let anchors = [...document.querySelectorAll('#toptablist a')];
                let found = anchors.find(a => a.textContent.toLowerCase().includes('comfy'));
                if (found) {
                    let paneId = found.getAttribute('href').substring(1);
                    showPane(paneId);
                    setMainNavActive('main_nav_comfy');
                    // Make sure ComfyUI nav item is visible
                    const comfyNavItem = document.getElementById('main_nav_comfy_item');
                    if (comfyNavItem) comfyNavItem.style.display = '';
                    found.click();
                    updateSubNavigation('comfy');
                }
            }
            return true;
        default:
            return false;
    }
}

function buildWorkspaceHash() {
    let tabList = getRequiredElementById('toptablist');
    let activeTop = tabList.querySelector('.active');
    let activeTopHref = activeTop ? activeTop.href.split('#')[1] : '';
    // Default to Generate
    let route = '#Generate';
    if (activeTopHref === 'Simple') {
        route = '#Simple';
        // Optional: include selected workflow path later if desired
    }
    else if (activeTopHref === 'utilities_tab') {
        route = '#Utilities';
        let sub = document.querySelector('#utilitiestablist .nav-link.active');
        if (sub) {
            let id = sub.getAttribute('href').substring(1);
            // Map known utilities to human-friendly names
            const map = {
                'Utilities-CLIP-Token-Tab': 'CLIP-Tokenization',
                'Utilities-Pickle2Safetensor-Tab': 'Pickle2Safetensors',
                'Utilities-LoraExtractor-Tab': 'LoRA-Extractor',
                'Utilities-ModelDownloader-Tab': 'Model-Downloader'
            };
            if (map[id]) route += `/${map[id]}`;
        }
    }
    else if (activeTopHref === 'user_tab') {
        route = '#Settings';
        let sub = document.querySelector('#usertablist .nav-link.active');
        if (sub) {
            let id = sub.getAttribute('href').substring(1);
            const map = {
                'Param-Config-User': 'API-Keys',
                'Settings-User': 'User',
                'Layout-Config-User': 'Layout'
            };
            if (map[id]) route += `/${map[id]}`;
        }
    }
    else if (activeTopHref === 'server_tab') {
        route = '#Server';
    }
    else if (activeTopHref === 'Text2Image') {
        route = '#Generate';
    }
    return route;
}

function normalizeLegacyHash() {
    if (!location.hash || !location.hash.includes(',')) return false;
    let split = location.hash.substring(1).split(',');
    // split[1] is the top tab id in legacy format
    let top = split[1] || '';
    let route = '#Generate';
    switch (top) {
        case 'Simple': route = '#Simple'; break;
        case 'utilities_tab': route = '#Utilities'; break;
        case 'user_tab': route = '#Settings'; break;
        case 'server_tab': route = '#Server'; break;
        case 'Text2Image': route = '#Generate'; break;
    }
    // Optionally map third part for sub-tabs if coming from legacy
    if (split.length > 2) {
        const sub = split[2];
        const utilMap = {
            'Utilities-CLIP-Token-Tab': 'CLIP-Tokenization',
            'Utilities-Pickle2Safetensor-Tab': 'Pickle2Safetensors',
            'Utilities-LoraExtractor-Tab': 'LoRA-Extractor',
            'Utilities-ModelDownloader-Tab': 'Model-Downloader'
        };
        const settingsMap = {
            'Param-Config-User': 'API-Keys',
            'Settings-User': 'User',
            'Layout-Config-User': 'Layout'
        };
        if (route === '#Utilities' && utilMap[sub]) route += `/${utilMap[sub]}`;
        if (route === '#Settings' && settingsMap[sub]) route += `/${settingsMap[sub]}`;
    }
    history.replaceState(null, null, route);
    return true;
}

function updateHash() {
    // Always push simplified workspace route
    const route = buildWorkspaceHash();
    history.pushState(null, null, route);
    autoTitle();
}

function loadHashHelper() {
    let tabList = getRequiredElementById('toptablist');
    let bottomTabList = getRequiredElementById('bottombartabcollection');
    let tabs = [... tabList.getElementsByTagName('a')];
    tabs = tabs.concat([... bottomTabList.getElementsByTagName('a')]);
    for (let subMapping of Object.values(hashSubTabMapping)) {
        tabs = tabs.concat([... getRequiredElementById(subMapping).getElementsByTagName('a')]);
    }
    if (location.hash) {
        if (normalizeLegacyHash()) {
            // replaced with workspace route; fall through to apply
        }
        if (applyWorkspaceRoute(location.hash)) {
            // handled as workspace route; also allow legacy triplet after a pipe (#Generate|Image-History,Text2Image,Sub)
            let pipeIdx = location.hash.indexOf('|');
            if (pipeIdx >= 0) {
                let legacy = location.hash.substring(pipeIdx + 1);
                if (legacy.startsWith('#')) legacy = legacy.substring(1);
                let split = legacy.split(',');
                // fall through to legacy handling below using temporary variable
                // emulate original split variable for next block
                var __legacy_split = split;
                split = __legacy_split;
            } else {
                // Workspace-only route: skip legacy parsing
                autoTitle();
                return;
            }
        }
        let split = location.hash.substring(1).split(',');
        let bottomTarget = bottomTabList.querySelector(`a[href='#${split[0]}']`);
        if (bottomTarget && bottomTarget.style.display != 'none') {
            bottomTarget.click();
        }
        let target = tabList.querySelector(`a[href='#${split[1]}']`);
        if (target) {
            target.click();
        }
        let subMapping = hashSubTabMapping[split[1]];
        if (subMapping && split.length > 2) {
            let subTabList = getRequiredElementById(subMapping);
            let subTarget = subTabList.querySelector(`a[href='#${split[2]}']`);
            if (subTarget) {
                subTarget.click();
            }
        }
        else if (split[1] == 'Simple' && split.length > 2) {
            let target = decodeURIComponent(split[2]);
            simpleTab.mustSelectTarget = target;
        }
        autoTitle();
    }
    for (let tab of tabs) {
        tab.addEventListener('click', (e) => {
            updateHash();
            updateWorkspaceButtons();
        });
    }
    window.addEventListener('hashchange', () => {
        // Normalize any legacy hash, apply route, and sync visuals
        if (normalizeLegacyHash()) {
            // normalized; continue with applied route
        }
        applyWorkspaceRoute(location.hash);
        updateWorkspaceButtons();
    });
    updateWorkspaceButtons();
}

function clearParamFilterInput() {
    let filter = getRequiredElementById('main_inputs_filter');
    let filterClearer = getRequiredElementById('clear_input_icon');
    if (filter.value.length > 0) {
        filter.value = '';
        filter.focus();
        hideUnsupportableParams();
    }
    filterClearer.style.display = 'none';
}

function updateSubNavigation(pageType, subRoute = '') {
    // Sub-navigation is now handled inline within each tab (horizontal layout)
    // No need to copy to header subnav_bar
    const subnavBar = document.getElementById('subnav_bar');
    if (subnavBar) {
        subnavBar.style.display = 'none';
    }
}

function updateWorkspaceButtons() {
    // This function is now simplified since we moved the logic to updateSubNavigation
    // Just update the sub-navigation based on current active pane
    let activePane = document.querySelector('.tab-content > .tab-pane.show.active');
    if (!activePane) return;
    
    let pageType = '';
    switch (activePane.id) {
        case 'Text2Image': pageType = 'generate'; break;
        case 'Simple': pageType = 'simple'; break;
        case 'utilities_tab': pageType = 'utilities'; break;
        case 'user_tab': pageType = 'settings'; break;
        case 'server_tab': pageType = 'server'; break;
        default:
            // Check if it's a ComfyUI pane
            if (activePane.id.toLowerCase().includes('comfy')) {
                pageType = 'comfy';
            }
            break;
    }
    
    if (pageType) {
        updateSubNavigation(pageType);
    }
}

function genpageLoad() {
    // Keep tab list hidden - it's only for routing, navigation is in the main header
    const topTabList = getRequiredElementById('toptablist');
    if (topTabList) {
        // Don't make it visible - keep it hidden
        // topTabList.style.display = '';
        // topTabList.classList.remove('d-none');
        
        // Initialize Bootstrap tabs (even though hidden, needed for routing)
        const tabTriggers = topTabList.querySelectorAll('a[data-bs-toggle="tab"]');
        tabTriggers.forEach(trigger => {
            // Ensure Bootstrap knows about each tab
            const tab = new bootstrap.Tab(trigger);
        });
    }
    
    topTabList.addEventListener('shown.bs.tab', function (e) {
        let versionDisp = getRequiredElementById('version_display');
        if (e.target.id == 'maintab_comfyworkflow') {
            versionDisp.style.display = 'none';
        }
        else {
            versionDisp.style.display = '';
        }
        // When any top tab changes, ensure route reflects the new workspace
        const route = buildWorkspaceHash();
        history.replaceState(null, null, route);
        updateWorkspaceButtons();
    });
    window.imageEditor = new ImageEditor(getRequiredElementById('image_editor_input'), true, true, () => genTabLayout.reapplyPositions(), () => needsNewPreview());
    let editorSizebar = getRequiredElementById('image_editor_sizebar');
    window.imageEditor.onActivate = () => {
        editorSizebar.style.display = '';
    };
    window.imageEditor.onDeactivate = () => {
        editorSizebar.style.display = 'none';
    };
    window.imageEditor.tools['options'].optionButtons = [
        ... window.imageEditor.tools['options'].optionButtons,
        { key: 'Store Current Image To History', action: () => {
            let img = window.imageEditor.getFinalImageData();
            storeImageToHistoryWithCurrentParams(img);
        }},
        { key: 'Store Full Canvas To History', action: () => {
            let img = window.imageEditor.getMaximumImageData();
            storeImageToHistoryWithCurrentParams(img);
        }},
        { key: 'Auto Segment Image (SAM2)', action: () => {
            if (!currentBackendFeatureSet.includes('sam2')) {
let modal = new bootstrap.Modal(getRequiredElementById('sam2_installer'));
                modal.show();
            }
            else {
                let img = window.imageEditor.getFinalImageData();
                let genData = getGenInput();
                genData['controlnetimageinput'] = img;
                genData['controlnetstrength'] = 1;
                genData['controlnetpreprocessor'] = 'Segment Anything 2 Global Autosegment base_plus';
                genData['images'] = 1;
                genData['prompt'] = '';
                delete genData['batchsize'];
                genData['donotsave'] = true;
                genData['controlnetpreviewonly'] = true;
                makeWSRequestT2I('GenerateText2ImageWS', genData, data => {
                    if (!data.image) {
                        return;
                    }
                    let newImg = new Image();
                    newImg.onload = () => {
                        imageEditor.addImageLayer(newImg);
                    };
                    newImg.src = data.image;
                });
            }
        }}
    ];
    genTabLayout.init();
    reviseStatusBar();
    loadHashHelper();
    // Apply current hash on startup to ensure initial content matches route
    if (normalizeLegacyHash()) {}
    applyWorkspaceRoute(location.hash || '#Generate');
    updateWorkspaceButtons();
    
    // Make updateWorkspaceButtons globally available for site.js
    window.updateWorkspaceButtons = updateWorkspaceButtons;
    
    // Make layout system available globally
    window.genTabLayout = genTabLayout;
    
    // CRITICAL: Force bottom bar to be visible after initialization
    function forceBottomBarVisible() {
        const bottomBar = document.getElementById('t2i_bottom_bar');
        if (bottomBar) {
            bottomBar.style.display = 'block';
            bottomBar.style.visibility = 'visible';
            bottomBar.style.minHeight = '400px';
            bottomBar.style.height = 'auto'; // Let it size naturally
        }
    }
    
    // Run immediately
    forceBottomBarVisible();
    
    // Run after a short delay to override any layout calculations
    setTimeout(forceBottomBarVisible, 100);
    setTimeout(forceBottomBarVisible, 500);
    
    // Watch for any changes and re-apply
    if (window.MutationObserver) {
        const bottomBar = document.getElementById('t2i_bottom_bar');
        if (bottomBar) {
            const observer = new MutationObserver((mutations) => {
                for (let mutation of mutations) {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        const computed = window.getComputedStyle(bottomBar);
                        if (computed.display === 'none' || computed.visibility === 'hidden') {
                            forceBottomBarVisible();
                        }
                    }
                }
            });
            observer.observe(bottomBar, { attributes: true, attributeFilter: ['style'] });
        }
    }
    getSession(() => {
        imageHistoryBrowser.navigate('');
        initialModelListLoad();
        genericRequest('ListT2IParams', {}, data => {
            updateAllModels(data.models);
            wildcardHelpers.newWildcardList(data.wildcards);
            [rawGenParamTypesFromServer, rawGroupMapFromServer] = buildParameterList(data.list, data.groups);
            gen_param_types = rawGenParamTypesFromServer;
            paramConfig.preInit();
            paramConfig.applyParamEdits(data.param_edits);
            paramConfig.loadUserParamConfigTab();
            autoRepersistParams();
            setInterval(autoRepersistParams, 60 * 60 * 1000); // Re-persist again hourly if UI left over
            genInputs();
            genToolsList();
            reviseStatusBar();
            getRequiredElementById('advanced_options_checkbox').checked = localStorage.getItem('display_advanced') == 'true';
            toggle_advanced();
            setCurrentModel();
            loadUserData(() => {
                if (permissions.hasPermission('view_backends_list')) {
                    loadBackendTypesMenu();
                }
                selectInitialPresetList();
            });
            for (let callback of sessionReadyCallbacks) {
                callback();
            }
            automaticWelcomeMessage();
            autoTitle();
            swarmHasLoaded = true;
        });
        reviseStatusInterval = setInterval(reviseStatusBar, 2000);
        window.resLoopInterval = setInterval(serverResourceLoop, 1000);
    });
}

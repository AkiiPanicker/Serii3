// static/js/script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Get HTML elements for the graph creator ---
    const numNodesInput = document.getElementById('num-nodes');
    const connectionsContainer = document.getElementById('connections-container');
    const graphContainer = document.getElementById('graph-visualization');

    // --- Get HTML elements for the Edit Modal ---
    const modalOverlay = document.getElementById('modal-overlay');
    const editModal = document.getElementById('edit-modal');
    const modalLabelInput = document.getElementById('modal-label-input');
    const modalColorInput = document.getElementById('modal-color-input');
    const modalSizeInput = document.getElementById('modal-size-input');
    const modalSizeValue = document.getElementById('modal-size-value');
    const modalSaveBtn = document.getElementById('modal-save-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');

    // --- Get HTML elements for the Welcome Modal ---
    const welcomeModalOverlay = document.getElementById('welcome-modal-overlay');
    const welcomeModalCloseBtn = document.getElementById('welcome-modal-close-btn');

    let currentlyEditingNodeId = null;

    // --- VIS.JS SETUP ---
    const nodes = new vis.DataSet([]);
    const edges = new vis.DataSet([]);
    const options = {
        nodes: {
            shape: 'circle',
            borderWidth: 2,
            font: { size: 16, color: '#343a40' }
        },
        edges: { width: 2, selfReference: { size: 20, angle: Math.PI / 4, renderBehindTheNode: true } },
        physics: { enabled: true, solver: 'barnesHut' },
        interaction: { hover: true },
        manipulation: { enabled: false }
    };
    const network = new vis.Network(graphContainer, { nodes: nodes, edges: edges }, options);


    // --- Logic for the Welcome Modal ---
    
    // Function to show the welcome modal with a smooth fade-in effect
    const showWelcomeModal = () => {
        if (welcomeModalOverlay) {
            welcomeModalOverlay.classList.add('visible');
        }
    };

    // Function to hide the welcome modal
    const hideWelcomeModal = () => {
        if (welcomeModalOverlay) {
            // A class is used to control visibility, allowing for CSS transitions
            welcomeModalOverlay.classList.remove('visible');
        }
    };

    // Add a click listener to the close button
    if (welcomeModalCloseBtn) {
        welcomeModalCloseBtn.addEventListener('click', hideWelcomeModal);
    }
    
    // This line is crucial: It calls the function to show the modal when the page is ready
    showWelcomeModal();

    // --- Core Graph Creator Functions ---

    function setupControlsAndGraph() {
        const num = parseInt(numNodesInput.value, 10) || 0;
        nodes.clear();
        edges.clear();
        connectionsContainer.innerHTML = '';
        if (num > 15 || num < 0) return;

        const newNodes = [];
        for (let i = 1; i <= num; i++) {
            newNodes.push({
                id: i,
                label: String(i),
                color: { border: '#007bff', background: '#90caff' },
                size: 25
            });
        }
        nodes.add(newNodes);
        
        createCheckboxes(num);
    }

    function createCheckboxes(num) {
        connectionsContainer.innerHTML = ''; // Clear existing
        for (let i = 1; i <= num; i++) {
            const nodeData = nodes.get(i);
            if (!nodeData) continue;

            const group = document.createElement('div');
            group.className = 'connection-group';

            const title = document.createElement('div');
            title.className = 'connection-group-title';
            title.innerText = `Node ${nodeData.label} connects to:`;
            title.dataset.titleForNode = i;
            group.appendChild(title);

            const checkboxList = document.createElement('div');
            checkboxList.className = 'checkbox-list';

            for (let j = 1; j <= num; j++) {
                const targetNode = nodes.get(j);
                if (!targetNode) continue;

                checkboxList.innerHTML += `
                    <label class="checkbox-item" data-label-for-node="${j}">
                        <input type="checkbox" data-from="${i}" data-to="${j}">
                        ${targetNode.label}
                    </label>
                `;
            }
            group.appendChild(checkboxList);
            connectionsContainer.appendChild(group);
        }
    }
    
    function updateControlPanelLabels(nodeId, newLabel) {
        const titleElement = document.querySelector(`[data-title-for-node="${nodeId}"]`);
        if (titleElement) {
            titleElement.innerText = `Node ${newLabel} connects to:`;
        }

        const labelElements = document.querySelectorAll(`[data-label-for-node="${nodeId}"]`);
        labelElements.forEach(label => {
            const checkbox = label.querySelector('input');
            label.innerHTML = ''; 
            label.appendChild(checkbox);
            label.append(` ${newLabel}`); 
        });
    }
    
    // --- Edit Node Modal Logic ---
    
    function openEditModal(nodeId) {
        currentlyEditingNodeId = nodeId;
        const nodeData = nodes.get(nodeId);

        modalLabelInput.value = nodeData.label;
        modalColorInput.value = nodeData.color.background;
        modalSizeInput.value = nodeData.size;
        modalSizeValue.innerText = nodeData.size;

        modalOverlay.classList.remove('hidden');
    }

    function closeModal() {
        modalOverlay.classList.add('hidden');
        currentlyEditingNodeId = null;
    }
    
    function saveNodeChanges() {
        if (!currentlyEditingNodeId) return;

        const newLabel = modalLabelInput.value.trim() || 'Node';
        const newColor = modalColorInput.value;
        const newSize = parseInt(modalSizeInput.value, 10);
        
        nodes.update({
            id: currentlyEditingNodeId,
            label: newLabel,
            color: { background: newColor, border: '#0056b3' },
            size: newSize,
        });
        
        updateControlPanelLabels(currentlyEditingNodeId, newLabel);
        
        closeModal();
    }

    // --- Event Listeners ---

    numNodesInput.addEventListener('input', setupControlsAndGraph);
    
    connectionsContainer.addEventListener('change', (event) => {
        if (event.target.type === 'checkbox') {
            const fromNode = parseInt(event.target.dataset.from);
            const toNode = parseInt(event.target.dataset.to);
            handleEdgeChange(fromNode, toNode, event.target.checked);
        }
    });
    
    modalSizeInput.addEventListener('input', () => { modalSizeValue.innerText = modalSizeInput.value; });

    network.on('click', (params) => {
        if (params.nodes.length > 0) {
            const nodeId = params.nodes[0];
            openEditModal(nodeId);
        }
    });

    modalSaveBtn.addEventListener('click', saveNodeChanges);
    modalCancelBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            closeModal();
        }
    });
    
    function handleEdgeChange(from, to, isChecked) {
        const edgeId = from <= to ? `${from}-${to}` : `${to}-${from}`;
        if (isChecked && !edges.get(edgeId)) {
            edges.add({ id: edgeId, from: from, to: to });
        } else if (!isChecked && edges.get(edgeId)) {
            edges.remove(edgeId);
        }
    }
});

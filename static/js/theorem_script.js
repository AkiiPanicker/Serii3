// static/js/theorem_script.js (modified with the fix)

document.addEventListener('DOMContentLoaded', () => {
    // --- Get HTML Elements ---
    const numNodesInput = document.getElementById('sim-num-nodes');
    const randomBtn = document.getElementById('generate-random-btn');
    const connectionsContainer = document.getElementById('connections-container');
    const graphContainer = document.getElementById('graph-visualization');
    const resultsContainer = document.getElementById('simulation-results');

    // --- VIS.JS Setup ---
    const nodes = new vis.DataSet([]);
    const edges = new vis.DataSet([]);

    // Filled in the options based on our working version
    const options = {
        nodes: {
            borderWidth: 2,
            shape: 'circle',
            font: { size: 14, color: '#343a40' }
        },
        interaction: { dragNodes: false, selectable: false },
        physics: { solver: 'barnesHut', stabilization: { iterations: 1000 } }
    };
    const network = new vis.Network(graphContainer, { nodes, edges }, options);


    // --- Core Functions ---

    /**
     * The main analysis function. It calculates degrees, updates node colors,
     * and displays the results. This is the heart of the page.
     */
    function analyzeAndDisplayResults() {
        const allNodes = nodes.get();
        if (allNodes.length === 0) return;

        const degrees = {};
        allNodes.forEach(node => { degrees[node.id] = 0; }); // Init degrees

        edges.get().forEach(edge => {
            degrees[edge.from]++;
            degrees[edge.to]++;
        });

        let oddCount = 0;
        const nodesToUpdate = [];

        for (const [nodeId, degree] of Object.entries(degrees)) {
            const isOdd = degree % 2 !== 0;
            if (isOdd) oddCount++;
            
            nodesToUpdate.push({
                id: Number(nodeId),
                label: `Degree: ${degree}`,
                color: { background: isOdd ? '#ffcc80' : '#a4f5b3', border: isOdd ? '#ff9800' : '#4caf50' }
            });
        }
        nodes.update(nodesToUpdate);
        displayResults(oddCount);
    }
    
    /**
     * Updates the text in the results box.
     */
    function displayResults(oddCount) {
        resultsContainer.innerHTML = `
            <h3>Results:</h3>
            <p>Number of odd degree nodes (orange): <strong>${oddCount}</strong></p>
            <div class="conclusion">
                Conclusion: ${oddCount} is an EVEN number. The theorem holds!
            </div>
        `;
    }

    /**
     * Creates a new graph setup based on the number of nodes.
     */
    function setupNewGraph() {
        const numNodes = parseInt(numNodesInput.value, 10);
        nodes.clear();
        edges.clear();

        const newNodes = [];
        for (let i = 1; i <= numNodes; i++) {
            newNodes.push({ id: i, label: `Degree: 0`, size: 25, color: { background: '#a4f5b3', border: '#4caf50' }});
        }
        nodes.add(newNodes);

        createManualControls(numNodes);
        analyzeAndDisplayResults();
    }
    
    /**
     * Generates a random set of edges for the current nodes.
     */
    function generateRandomGraph() {
        const numNodes = parseInt(numNodesInput.value, 10);
        edges.clear();
        const newEdges = [];

        for (let i = 1; i <= numNodes; i++) {
            for (let j = i + 1; j <= numNodes; j++) {
                if (Math.random() < 0.4) {
                    newEdges.push({ from: i, to: j });
                }
            }
        }
        edges.add(newEdges);
        syncCheckboxesToGraph(); // Make checkboxes match the new graph
        
        // --- FIX APPLIED HERE ---
        // Delay the analysis to give the DataSet time to update.
        setTimeout(analyzeAndDisplayResults, 0);
    }
    
    /**
     * Creates the interactive checkbox controls.
     */
    function createManualControls(numNodes) {
        connectionsContainer.innerHTML = '';
        for (let i = 1; i <= numNodes; i++) {
            const group = document.createElement('div');
            group.className = 'connection-group';
            group.innerHTML = `<div class="connection-group-title">Node ${i} connects to:</div>`;
            const checkboxList = document.createElement('div');
            checkboxList.className = 'checkbox-list';

            for (let j = 1; j <= numNodes; j++) {
                if (i === j) continue; // Don't allow self-loops for this theorem's clarity
                checkboxList.innerHTML += `
                    <label class="checkbox-item">
                        <input type="checkbox" data-from="${i}" data-to="${j}">
                        ${j}
                    </label>
                `;
            }
            group.appendChild(checkboxList);
            connectionsContainer.appendChild(group);
        }
    }
    
    /**
     * Ensures checkboxes are checked/unchecked to match the current state of edges.
     */
    function syncCheckboxesToGraph() {
        const allCheckboxes = connectionsContainer.querySelectorAll('input[type="checkbox"]');
        allCheckboxes.forEach(cb => cb.checked = false); // Uncheck all first

        edges.forEach(edge => {
            let checkbox1 = document.querySelector(`input[data-from="${edge.from}"][data-to="${edge.to}"]`);
            let checkbox2 = document.querySelector(`input[data-from="${edge.to}"][data-to="${edge.from}"]`);
            if(checkbox1) checkbox1.checked = true;
            if(checkbox2) checkbox2.checked = true;
        });
    }

    /**
     * Handles adding or removing a single edge.
     */
    function handleEdgeChange(from, to, isChecked) {
        const edgeId = from < to ? `${from}-${to}` : `${to}-${from}`;
        if (isChecked && !edges.get(edgeId)) {
            edges.add({ id: edgeId, from: from, to: to });
        } else if (!isChecked && edges.get(edgeId)) {
            edges.remove(edgeId);
        }
        syncCheckboxesToGraph(); // Keep both sides of connection (1->2 and 2->1) in sync
    }

    // --- EVENT LISTENERS ---

    // 1. When the number of nodes input changes, rebuild everything.
    numNodesInput.addEventListener('input', setupNewGraph);

    // 2. When the random button is clicked, generate a random graph.
    randomBtn.addEventListener('click', generateRandomGraph);

    // 3. When a checkbox is changed, update the graph and re-analyze.
    connectionsContainer.addEventListener('change', (event) => {
        if (event.target.type === 'checkbox') {
            const from = parseInt(event.target.dataset.from);
            const to = parseInt(event.target.dataset.to);
            handleEdgeChange(from, to, event.target.checked);
            
            // --- AND FIX APPLIED HERE ---
            // This ensures the results text updates after the graph data has changed.
            setTimeout(analyzeAndDisplayResults, 0);
        }
    });

    // Initialize the page on first load
    setupNewGraph();
});

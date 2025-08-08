// static/js/theorem_script.js (completely rewritten for multi-theorem support)

document.addEventListener('DOMContentLoaded', () => {
    // --- Get HTML Elements ---
    const numNodesInput = document.getElementById('sim-num-nodes');
    const randomBtn = document.getElementById('generate-random-btn');
    const connectionsContainer = document.getElementById('connections-container');
    const graphContainer = document.getElementById('graph-visualization');
    const resultsContainer = document.getElementById('simulation-results');
    const theoremSelect = document.getElementById('theorem-select');

    // --- VIS.JS Setup ---
    const nodes = new vis.DataSet([]);
    const edges = new vis.DataSet([]);
    const network = new vis.Network(graphContainer, { nodes, edges }, { /* options */ });


    // --- ALGORITHMS ---

    /**
     * Theorem 1: Checks the degree of each vertex.
     * @returns {Object} An object with counts of odd/even degree nodes.
     */
    function runOddDegreeAnalysis() {
        const degrees = getDegrees();
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
        resultsContainer.innerHTML = `<h3>Results:</h3><p>Odd degree nodes: <strong>${oddCount}</strong></p><div class="conclusion">${oddCount} is an EVEN number!</div>`;
    }

    /**
     * Theorem 2: Checks if the graph is bipartite using 2-coloring BFS.
     * @returns {Object} An object indicating if the graph is bipartite and providing conflict details if not.
     */
    function runBipartiteAnalysis() {
        const adj = buildAdjacencyList();
        const nodeIds = nodes.getIds();
        const colors = {}; // 1 for partition 1, 2 for partition 2
        
        for (const startNode of nodeIds) {
            if (!colors[startNode]) { // If not yet colored, start a new BFS
                const queue = [startNode];
                colors[startNode] = 1;

                while (queue.length > 0) {
                    const u = queue.shift();
                    const neighbors = adj[u] || [];
                    
                    for (const v of neighbors) {
                        if (!colors[v]) { // Neighbor is uncolored
                            colors[v] = 3 - colors[u]; // The opposite color (1 -> 2, 2 -> 1)
                            queue.push(v);
                        } else if (colors[v] === colors[u]) { // CONFLICT! Odd cycle detected.
                            displayBipartiteResult(false, { u, v }, colors);
                            return; // End the analysis
                        }
                    }
                }
            }
        }
        // If we get here, no conflicts were found.
        displayBipartiteResult(true, null, colors);
    }
    

    // --- DISPLAY & HELPER LOGIC ---

    function getDegrees() {
        const degrees = {};
        nodes.getIds().forEach(id => { degrees[id] = 0; });
        edges.get().forEach(edge => { degrees[edge.from]++; degrees[edge.to]++; });
        return degrees;
    }

    function buildAdjacencyList() {
        const adj = {};
        nodes.getIds().forEach(id => { adj[id] = []; });
        edges.get().forEach(edge => { adj[edge.from].push(edge.to); adj[edge.to].push(edge.from); });
        return adj;
    }

    function displayBipartiteResult(isBipartite, conflict, colors) {
        // First, reset all edge colors and widths to default
        const defaultEdges = edges.map(edge => ({id: edge.id, color: null, width: 2}));
        edges.update(defaultEdges);

        if (isBipartite) {
            const nodesToUpdate = Object.entries(colors).map(([nodeId, color]) => ({
                id: Number(nodeId), label: `Group ${color}`,
                color: color === 1 ? { background: '#8ce2ff', border: '#009dff' } : { background: '#ffc382', border: '#ff8c00' }
            }));
            nodes.update(nodesToUpdate);
            resultsContainer.innerHTML = `<h3>Results:</h3><div class="conclusion">It's Bipartite!</div><p>All nodes can be split into two groups (blue and orange) without internal connections.</p>`;
        } else {
            const nodesToUpdate = Object.entries(colors).map(([nodeId, color]) => ({
                id: Number(nodeId), label: `Group ${color}`,
                color: { background: '#d1d1d1', border: '#aaaaaa' } // Default grey
            }));
            nodes.update(nodesToUpdate);
            // Highlight conflicting nodes and edge
            nodes.update([ {id: conflict.u, color: '#ff7b7b'}, {id: conflict.v, color: '#ff7b7b'} ]);
            const conflictEdge = edges.get({filter: e => (e.from === conflict.u && e.to === conflict.v) || (e.from === conflict.v && e.to === conflict.u)})[0];
            if (conflictEdge) edges.update({id: conflictEdge.id, color: 'red', width: 4});

            resultsContainer.innerHTML = `<h3>Results:</h3><div class="conclusion" style="color: #d9534f;">NOT Bipartite!</div><p>Nodes ${conflict.u} and ${conflict.v} are connected, but coloring forces them into the same group. This proves an odd cycle exists.</p>`;
        }
    }
    
    function runActiveTheorem() {
        const theorem = theoremSelect.value;
        if (theorem === 'odd_degree') {
            runOddDegreeAnalysis();
        } else if (theorem === 'bipartite') {
            runBipartiteAnalysis();
        }
    }
    
    // All manual control functions remain the same as before...
    function setupNewGraph() { /* ... unchanged ... */ }
    function generateRandomGraph() { /* ... unchanged, but calls runActiveTheorem at end ... */ }
    function createManualControls(num) { /* ... unchanged ... */ }
    function syncCheckboxesToGraph() { /* ... unchanged ... */ }
    function handleEdgeChange(from, to, isChecked) { /* ... unchanged ... */ }
    

    // --- EVENT LISTENERS ---

    theoremSelect.addEventListener('change', () => {
        // Hide all description boxes
        document.querySelectorAll('.theorem-description').forEach(d => d.classList.add('hidden'));
        // Show the selected one
        document.getElementById(`theorem-${theoremSelect.value}-description`).classList.remove('hidden');
        // Re-run the analysis for the new theorem on the current graph
        runActiveTheorem();
    });
    
    numNodesInput.addEventListener('input', setupNewGraph);
    randomBtn.addEventListener('click', generateRandomGraph);
    connectionsContainer.addEventListener('change', (event) => {
        if (event.target.type === 'checkbox') {
            const from = parseInt(event.target.dataset.from);
            const to = parseInt(event.target.dataset.to);
            handleEdgeChange(from, to, event.target.checked);
            setTimeout(runActiveTheorem, 0); // Crucial setTimeout to prevent timing issues
        }
    });

    // Initialize the page on first load
    setupNewGraph();
    // Copy/paste of unchanged functions
    function setupNewGraph() {
        const num = parseInt(numNodesInput.value, 10);
        nodes.clear();
        edges.clear();
        const newNodes = [];
        for (let i = 1; i <= num; i++) newNodes.push({id:i, size:25});
        nodes.add(newNodes);
        createManualControls(num);
        runActiveTheorem();
    }
    function generateRandomGraph() {
        const num = parseInt(numNodesInput.value, 10);
        edges.clear();
        const newEdges = [];
        for (let i = 1; i <= num; i++) {
            for (let j = i + 1; j <= num; j++) {
                if (Math.random() < 0.4) newEdges.push({from:i, to:j});
            }
        }
        edges.add(newEdges);
        syncCheckboxesToGraph();
        setTimeout(runActiveTheorem, 0);
    }
    function createManualControls(num) {
        connectionsContainer.innerHTML = '';
        for (let i=1; i<=num; i++) {
            const group=document.createElement('div');
            group.className='connection-group';
            group.innerHTML=`<div class="connection-group-title">Node ${i} connects to:</div>`;
            const list=document.createElement('div');
            list.className='checkbox-list';
            for (let j=1; j<=num; j++) {
                if (i===j) continue;
                list.innerHTML += `<label class="checkbox-item"><input type="checkbox" data-from="${i}" data-to="${j}">${j}</label>`;
            }
            group.appendChild(list);
            connectionsContainer.appendChild(group);
        }
    }
    function syncCheckboxesToGraph() {
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked=false);
        edges.forEach(e => {
            const cb1=document.querySelector(`input[data-from="${e.from}"][data-to="${e.to}"]`);
            const cb2=document.querySelector(`input[data-from="${e.to}"][data-to="${e.from}"]`);
            if (cb1) cb1.checked=true;
            if (cb2) cb2.checked=true;
        });
    }
    function handleEdgeChange(from, to, isChecked) {
        const edgeId = from < to ? `${from}-${to}` : `${to}-${from}`;
        if(isChecked && !edges.get(edgeId)) edges.add({id: edgeId, from, to});
        else if(!isChecked && edges.get(edgeId)) edges.remove(edgeId);
        syncCheckboxesToGraph();
    }
});
